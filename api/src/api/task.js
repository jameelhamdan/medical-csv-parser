import multer from "multer";
import fs from "fs";
import csv from "fast-csv";
import {ImportTask, Hospital, sequelize} from "../models.js";
import {getPagination, getPagingData} from "../utils.js";
import {uploadPath} from "../config/index.js";


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
            return ValidationErrorResponse(res,"Hospital Code is invalid, please check hospitals list for correct code.");
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
            fs.unlink(req.file.path, err => {});
            return ValidationErrorResponse(res, "File type is invalid, please only upload .csv files! " + req.file.mimetype);
        }

        // Add task to pending
        const importTask = await ImportTask.create({
            hospital_id: hospital.id,
            type: importType,
            path: req.file.path.replaceAll(uploadPath, ""),
        });

        // Read and go through the file
        // TODO: Move this to background task queue
        fs.createReadStream(req.file.path).pipe(csv.parse({headers: true})).on('error', error => {
            //console.error(error);
        }).on('data', row => {
            // console.log(row)
        }).on('end', (rowCount) => {
            // console.log(`Parsed ${rowCount} rows`);
        });

        await importTask.update({
            state: ImportTask.STATE.SUCCESS,
            finish_on: sequelize.fn('NOW'),
        });

        return res.status(200).send(importTask.toJSON());
    });
}


export default {
    retrieve,
    list,
    create,
}
