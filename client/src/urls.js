import {PatientsPage} from "./pages/patient";
import {TreatmentsPage} from "./pages/treatment";
import {ImportTasksPage} from "./pages/task";
import {UploadPage} from "./pages/upload";


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
    }
];
