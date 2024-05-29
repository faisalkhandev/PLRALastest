import ApplyForm from "../Pages/AnnualAssessment/Apply/ApplyForm.jsx";
import Disciplinary_Proceeding_Form from "../Pages/DisciplinaryProceeding/Disciplinary_Proceeding_Form.jsx";
import AllETransferProcess from "../Pages/ETransferProcess/AllETransferProcess.jsx";
import ETransferApply from "../Pages/ETransferProcess/ETransferApply.jsx";
import {
    AddEmployeeTransfer, AllAnnualAssesment, AllEmployees, AllNOC, AllResignation, AllTermination, AnnualAssesmentApply,
    ApplyLeave, BasicEmployee, Dashboard, Dashboard_Routes, DisciplinaryProceedingSteper, ElevationDoc, ElevationProcess, Employee, EmployeeGrid,
    Employee_MasterData, HR_Calendar, Leave, Login, MyProfile, NocApply, ProgressionProcess, ResignationApply, Setting,
    Setups, TerminationApply, Transfer, AnnualAssessmentCenter, AnnualAssessment, AllDisciplanaryProceeding, NOCReport,
    ResignationReport
} from "../Pages/index.js";
import AllETransferWindow from '../Pages/ETransferWindow/AllETransferWindow.jsx'
import ETransferWindowApply from "../Pages/ETransferWindow/ETransferWindowApply.jsx";
import ETransferWindowEdit from "../Pages/ETransferWindow/ETransferWindowEdit.jsx";
import ElevationHistory from "../Pages/ElevationProcess/ElevationHistory.jsx";
import ApprovalDetail from "../Pages/ProgressionProcess/ApprovalDetail.jsx";
import Terminationreport from '../Pages/Termination/Terminationreport.jsx';
//import ResignationReport from '../Pages/Resignation/ResignationReport.jsx';

// Public Routes
const publicRoutes = [
    { path: "/login", component: Login },
];

// Private Routes
const privateRoutes = [
    { path: "/", component: Dashboard },
    //MyProfile
    { path: "/profile", component: MyProfile },
    // Employee Route
    { path: "/employee", component: Employee },
    { path: "/employee/:id", component: Employee_MasterData },
    // leaves
    { path: "/Leave", component: Leave },
    { path: "/applyleave", component: ApplyLeave },

    // AnnualAssessment
    { path: "/AnnualAssessment", component: AllAnnualAssesment },
    { path: '/applyAnnaualAssesment', component: AnnualAssesmentApply },

    { path: '/AnnualAssessment/center/:id', component: AnnualAssessmentCenter },
    { path: "/AnnualAssessment/:id", component: AnnualAssessment },

    // DisciplinaryProceeding
    // { path: "/DisciplinaryProceeding", component: DisciplinaryProceeding },
    // { path: "/Disciplinary-Proceeding-Form", component: Disciplinary_Proceeding_Form },

    { path: '/applyNewAnnaualAssesment', component: ApplyForm },

    // DisciplinaryProceeding
    // { path: "/DisciplinaryProceeding", component: DisciplinaryProceeding },
    { path: "/DisciplinaryProceeding", component: AllDisciplanaryProceeding },
    { path: "/DisciplinaryProceedingApply", component: DisciplinaryProceedingSteper },

    { path: "/Disciplinary-Proceeding-Form/:id", component: Disciplinary_Proceeding_Form },
    // ElevationProcess
    { path: "/ElevationProcess", component: ElevationProcess },
    { path: "/ElevationHistory/:id", component: ElevationHistory },
    { path: "/Elevation/ElevationDoc/:id", component: ElevationDoc },

    //ProgressionProcess
    { path: "/ProgressionProcess", component: ProgressionProcess },
    { path: "/Progression/:id", component: ApprovalDetail },
    // { path: "/Progression/ProgressionDoc/:id", component: ProgressionDoc },

    // NOC
    { path: "/noc", component: AllNOC },
    { path: '/applynoc', component: NocApply },
    { path: "/nocreport/:nocId", component: NOCReport },

    { path: "/ETransferProcess", component: AllETransferProcess },
    { path: "/applyetransfer/:id/window/:windowid", component: ETransferApply },


    { path: "/opentransferwindow", component: AllETransferWindow },
    { path: "/applytransferwindow", component: ETransferWindowApply },
    { path: "/edittransferwindow/:id", component: ETransferWindowEdit },


    // Resignation
    { path: "/Resignation", component: AllResignation },
    { path: "/applyresignation", component: ResignationApply },
    { path: "/resignationreport/:resignationId", component: ResignationReport },

    // HR_Calendar
    // { path: "/HR_Calendar", component: HolidayCalendar },
    // Termination
    { path: "/Termination", component: AllTermination },
    { path: '/EmployeeGrid', component: EmployeeGrid },
    { path: "/Termination/applyTermination/:id", component: TerminationApply },
    { path: "/terminationreport/:terminationId", component: Terminationreport },

    // Transfer
    { path: "/Transfer", component: Transfer },
    { path: '/EmployeeGrid/Transfers', component: AllEmployees },
    { path: '/applyTransfer/:id', component: AddEmployeeTransfer },

    // Setting
    { path: "/Setting", component: Setting },
    // Employee setup's
    { path: "/employee/setup/*", component: Setups },
    { path: "/add_new_employee", component: BasicEmployee },

    { path: "/approval/*", component: Dashboard_Routes },

];



export { privateRoutes, publicRoutes };
