import express from "express";
import patient from "./patient.js";
import treatment from "./treatment.js";
import task from "./task.js";
import hospital from "./hospital.js";

const router = express.Router();

router.get('/patient/', patient.list);
router.get('/patient/:id', patient.retrieve);

router.get('/treatment/', treatment.list);
router.get('/treatment/:id', treatment.retrieve);

router.post('/import_task/', task.create);
router.get('/import_task/', task.list);
router.get('/import_task/:id', task.retrieve);

router.get('/hospital', hospital.list);

export default router;
