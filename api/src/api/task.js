import multer from "multer";
import fs from "fs";
import {ImportTask} from "../models.js";
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
        limit, offset, order: ['createdAt'],
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
    upload.single("file")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({message: "File upload error."});
        } else if (err) {
            throw err;
        }

        if (!req.file) {
            return res.status(400).send({message: "File is required."});
        } else if (!["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(req.file.mimetype)) {
            fs.unlink(req.file.path, err => {});
            return res.status(400).send({message: "File type is invalid, please only upload .csv files! "+ req.file.mimetype});
        }

        // TODO: get hospital from req
        const hospital = "hospital_1";

        const importTask = await ImportTask.create({
            state: 1,
            path: req.file.path.replaceAll(uploadPath, ""),
        });

        return res.status(200).send(importTask.toJSON());
    });
}


export default {
    retrieve,
    list,
    create,
}
