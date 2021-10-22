import multer from "multer";
import fs from "fs";
import csvParse from "csv-parse";
import {ImportTask, ImportTaskError, Hospital, sequelize, Patient, Treatment} from "../models.js";
import {getPagination, getPagingData} from "../utils.js";
import {uploadPath} from "../config/index.js";
import {PatientParser, TreatmentParser} from "../parsers.js";

const retrieve = async (req, res) => {
    const data = await ImportTask.findByPk(req.params.id);
    if (data === null) {
        return res.status(404).json({});
    }

    return res.status(200).json(data.toJSON());
}

const list = async (req, res) => {
    const {page, size} = req.query;
    const {limit, offset} = getPagination(page, size);

    const data = await ImportTask.findAndCountAll({
        limit: limit,
        offset: offset,
        include: Hospital,
        order: ['createdAt'],
    });

    return res.status(200).send(getPagingData(data, page, limit));
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        }
    }),
});


async function processCsv(parser, importTask, filePath) {
    let rowCount = 0;
    let successCount = 0;
    let errorCount = 0;

    const reader = fs.createReadStream(filePath).pipe(csvParse({
        columns: true,
        trim: true,
    }));

    for await (const record of reader) {
        const errors = await parser.validate(record);
        if (errors.length > 0) {
            // invalid
            errorCount += 1;
            await ImportTaskError.create({
                errors: JSON.stringify(errors),
                import_task_id: importTask.id,
                row_count: rowCount,
            });
        } else {
            const data = parser.parse(record);
            if (importTask.type === ImportTask.TYPE.PATIENT) {
                await Patient.create(data);
            } else if (importTask.type === ImportTask.TYPE.TREATMENT) {
                await Treatment.create(data);
            }
            successCount += 1;
        }
        rowCount += 1;
    }

    return [rowCount, successCount, errorCount];
}

const create = async (req, res) => {
    const ValidationErrorResponse = (_, m) => {
        return _.status(400).send({message: m});
    }

    upload.single("file")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return ValidationErrorResponse(res, "File upload error.");
        } else if (err) {
            throw err;
        }

        const hospitalCode = req.body?.hospital;
        const importType = req.body?.importType;

        // Validate Hospital
        if (!hospitalCode) {
            return ValidationErrorResponse(res, "Hospital Code is required.");
        }

        const hospital = await Hospital.findOne({where: {code: hospitalCode}});
        if (hospital === null) {
            return ValidationErrorResponse(res, "Hospital Code is invalid, please check hospitals list for correct code.");
        }

        // Validate import type
        if (!importType) {
            return ValidationErrorResponse(res, "Import Type is required.")
        } else if (!Object.values(ImportTask.TYPE).includes(importType)) {
            return ValidationErrorResponse(res, "Import Type is invalid.")
        }

        if (!req.file) {
            return ValidationErrorResponse(res, "File is required.");
        } else if (!["text/csv", "application/vnd.ms-excel"].includes(req.file.mimetype)) {
            fs.unlink(req.file.path, err => {
            });
            return ValidationErrorResponse(res, "File type is invalid, please only upload .csv files! " + req.file.mimetype);
        }

        // Add task to pending
        let parser = null

        if (importType === ImportTask.TYPE.PATIENT) {
            parser = new PatientParser(hospital.code);
        } else if (importType === ImportTask.TYPE.TREATMENT) {
            parser = new TreatmentParser(hospital.code);
        }

        const importTask = await ImportTask.create({
            hospital_id: hospital.id,
            type: importType,
            path: req.file.path.replaceAll(uploadPath, ""),
        });

        const [rowCount, successCount, errorCount] = await processCsv(parser, importTask, req.file.path);
        let newState = ImportTask.STATE.SUCCESS;

        let message = `Uploaded ${rowCount} records Successfully.`;
        if (errorCount !== 0) {
            newState = ImportTask.STATE.FAILURE;
            message = `Uploaded ${rowCount} records with ${errorCount} failures.`;
        }

        await importTask.update({
            state: newState,
            finish_on: sequelize.fn('NOW'),
        });

        return res.status(200).send({
            message: message,
            data: importTask.toJSON(),
            row_count: rowCount,
            error_count: errorCount,
            success_count: successCount,
        });
    });
}


export default {
    retrieve,
    list,
    create,
}
