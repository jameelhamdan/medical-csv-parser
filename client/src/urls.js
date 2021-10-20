import {ImportTasksPage} from "./pages/task";
import {PatientsPage} from "./pages/patient";
import {TreatmentsPage} from "./pages/treatment";
import {HomePage} from "./pages/home";


export const urls = [
    {
        path: '/',
        component: HomePage,
    },
    {
        path: '/tasks',
        component: ImportTasksPage,
    },
    {
        path: '/patients',
        component: PatientsPage,
    },
    {
        path: '/treatments',
        component: TreatmentsPage,
    },
];
