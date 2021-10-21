import fs from "fs";
import express from "express";
import {initializeDatabase} from "./models.js";
import router from "./api/urls.js";
import cors from "cors";
import {uploadPath} from "./config/index.js";

const initializeUploadDirectory = () => {
    const dir = uploadPath;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const init = () => {
    initializeUploadDirectory();
    initializeDatabase();
};

const app = express();

app.use(cors({
    origin: '*'
}));

app.use('', router);

app.use(function (err, req, res, next) {
    console.error('ERROR: ' + err);
    res.statusCode = 500;
    res.send({code: "INTERNAL_SERVER_ERROR"});
});

app.listen(3001, () => {
    init();
    console.log("app listening on port 3001")
});
