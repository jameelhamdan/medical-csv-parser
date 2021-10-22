import {PatientsPage} from "./patient";
import {TreatmentsPage} from "./treatment";
import {ImportTasksPage} from "./task";
import {UploadPage} from "./upload";
import {HospitalsPage} from "./hospital";


export const urls = [
    {
        path: '/',
        component: ImportTasksPage,
    },
    {
        path: '/upload',
        component: UploadPage,
    },
    {
        path: '/patients',
        component: PatientsPage,
    },
    {
        path: '/treatments',
        component: TreatmentsPage,
    },
    {
        path: '/hospitals',
        component: HospitalsPage,
    }
];
