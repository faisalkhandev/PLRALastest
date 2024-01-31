import {
    Login, MyProfile, Setups, Employee_MasterData,
    Dashboard, Employee, AnnualAssessment, DisciplinaryProceeding, ElevationProcess, HR_Calendar,
    Leave, NOC, Resignation, Termination, Transfer, Setting, BasicEmployee, ApplyLeave, Approval
} from "../Pages/index.js";
import Disciplinary_Proceeding_Form from '../Pages/DisciplinaryProceeding/Disciplinary_Proceeding_Form.jsx';
import ApplyForm from "../Pages/AnnualAssessment/AssesmentApply/ApplyForm.jsx";

// Public Routes
const publicRoutes = [
    { path: "/login", component: Login },
];

// Private Routes
const privateRoutes = [
    { path: "/", component: Dashboard },
    // MyProfile
    { path: "/profile", component: MyProfile },
    // Employee Route
    { path: "/employee", component: Employee },
    { path: "/employee/:id", component: Employee_MasterData },
    // Leaves
    { path: "/Leave", component: Leave },
    // AnnualAssessment
    { path: "/AnnualAssessment", component: AnnualAssessment },
    // DisciplinaryProceeding
    { path: "/DisciplinaryProceeding", component: DisciplinaryProceeding },
    { path: "/Disciplinary-Proceeding-Form", component: Disciplinary_Proceeding_Form },
    // ElevationProcess
    { path: "/ElevationProcess", component: ElevationProcess },
    // NOC
    { path: "/NOC", component: NOC },
    // Resignation
    { path: "/Resignation", component: Resignation },
    // HR_Calendar
    { path: "/HR_Calendar", component: HR_Calendar },
    // Termination
    { path: "/Termination", component: Termination },
    // Transfer
    { path: "/Transfer", component: Transfer },
    // Setting
    { path: "/Setting", component: Setting },
    // Employee setups
    { path: "/employee/setup/*", component: Setups },
    { path: "/Basic_Info", component: BasicEmployee },
    { path: "/applyleave", component: ApplyLeave },

    { path: "/Apply_AnnualAssessment", component: ApplyForm }, // Fix the spelling here

    { path: "/approval/*", component: Approval },
];

export { publicRoutes, privateRoutes };
