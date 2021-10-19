import express from "express";
import {initializeDatabase} from "./models.js";
import router from "./api/urls.js";

const init = () => {
    initializeDatabase();
};


const app = express();
app.use('', router);
app.listen(3000, () => {
    init();
    console.log("app listening on port 3000")
});
