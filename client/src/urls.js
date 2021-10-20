import {HomePage} from "./pages/home";
import {PatientsPage} from "./pages/patient";
import {TreatmentsPage} from "./pages/treatment";
import {ImportTasksPage} from "./pages/task";


export const urls = [
    {
        path: '/',
        component: HomePage,
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
        path: '/tasks',
        component: ImportTasksPage,
    },
];
