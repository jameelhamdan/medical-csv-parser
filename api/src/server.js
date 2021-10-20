import express from "express";
import {initializeDatabase} from "./models.js";
import router from "./api/urls.js";
import cors from "cors";


const init = () => {
    initializeDatabase();
};

const app = express();

app.use(cors({
    origin: '*'
}));

app.use('', router);
app.listen(3001, () => {
    init();
    console.log("app listening on port 3001")
});
