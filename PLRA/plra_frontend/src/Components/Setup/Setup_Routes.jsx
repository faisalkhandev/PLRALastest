import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Wing from "../../Pages/Setups/Employee_Setup/Wing.jsx";
import SubWing from "../../Pages/Setups/Employee_Setup/SubWing.jsx";
import Job from "../../Pages/Setups/Employee_Setup/Job.jsx";
import Job_Level from '../../Pages/Setups/Employee_Setup/JobLevel.jsx';
import Position from '../../Pages/Setups/Employee_Setup/Position.jsx';
import PPG from "../../Pages/Setups/Employee_Setup/PPGLevel.jsx";
import Center from '../../Pages/Setups/Employee_Setup/Center.jsx';
import Region from '../../Pages/Setups/Employee_Setup/Region.jsx';
import District from '../../Pages/Setups/Employee_Setup/District.jsx';
import Division from '../../Pages/Setups/Employee_Setup/Division.jsx';
import Tahsil from '../../Pages/Setups/Employee_Setup/Tahsil.jsx';
import Job_Level_Validity from '../../Pages/Setups/Employee_Setup/JobLevelValidity.jsx'
import Position_Type from '../../Pages/Setups/Employee_Setup/PositionType.jsx'
import Employee_Title from '../../Pages/Setups/Employee_Setup/EmployeeTitle.jsx'
import Approval_Matrix from '../../Pages/Setups/Employee_Setup/ApprovalMatrix.jsx'
import Noc_Type from '../../Pages/Setups/NOC_Setup/Noc_Type.jsx';
import Noc_Process from '../../Pages/Setups/NOC_Setup/Noc_Process.jsx';
import Add_HrCalendar_Year from '../../Pages/Setups/Employee_Setup/Add_HrCalendar_Year.jsx';

// Annual Assessment
// import AAR_Prescribed_Form from '../../Pages/Setups/Annual_Assesments_Setups/'
import AAR_Process_HOS from '../../Pages/Setups/Annual_Assesments_Setups/AAR_Process_HOS.jsx';
import Rating_Models from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Models.jsx';
import RatingModelTypes from '../../Pages/Setups/Annual_Assesments_Setups/RatingModelTypes.jsx';
import Rating_Type_Points from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Type_Points.jsx';
import Rating_Types_Likert_Scales from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Types_Likert_Scales.jsx';
import Rating_Types_Point_Assignment from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Types_Point_Assignment.jsx';


//Leave setup's
import LeaveType from '../../Pages/Setups/Leave_Setup/LeaveType.jsx';
import LeaveApply from '../../Pages/Setups/Leave_Setup/LeaveApply.jsx';
import LeaveDependency from '../../Pages/Setups/Leave_Setup/LeaveDependency.jsx';
import LeaveDependableDetail from '../../Pages/Setups/Leave_Setup/LeaveDependableDetail.jsx';
import SalaryDeductibles from '../../Pages/Setups/Leave_Setup/SalaryDeductibles.jsx';
import New_Leave_Approvals from '../../Pages/Setups/Leave_Setup/New_Leave_Approvals.jsx';
import Leave_Approvals from '../../Pages/Setups/Leave_Setup/Leave_Approvals.jsx';


// Roles
import Roles from '../../Pages/Setups/Role_Management/Roles.jsx';
import BasicRole from '../../Pages/Setups/Role_Management/BasicRole.jsx';
import AdvanceRole from '../../Pages/Setups/Role_Management/AdvanceRole.jsx';
import UpdateRole from '../../Pages/Setups/Role_Management/UpdateRole.jsx'
import TransferRatingModel from '../../Pages/Transfer/TransferRatingModel.jsx';
import Wedlock_Rating_Formula from '../../Pages/Transfer/Wedlock_Rating_Formula.jsx';
import CompetentAuthority from '../../Pages/Setups/Competent_Authority/CompetentAuthority.jsx';
import AnnualAssesmentApply from '../../Pages/AnnualAssessment/AssesmentApply/AnnualAssesmentApply.jsx';









const Setup_Routes = () => {
  return (
    <div style={{ width: "100%", paddingTop: '10px', paddingRight: '15px' }}>
      <Routes>
        <Route path="wing" element={<Wing />} />
        <Route path="Sub_Wing" element={<SubWing />} />
        <Route path="job" element={<Job />} />
        <Route path="Job_Level" element={<Job_Level />} />
        <Route path="position" element={<Position />} />
        <Route path="Ppg_Level_Setup" element={<PPG />} />
        <Route path="center" element={<Center />} />
        <Route path="Region_Setup" element={<Region />} />
        <Route path="Division" element={<Division />} />
        <Route path="district" element={<District />} />
        <Route path="Tehsil" element={<Tahsil />} />
        <Route path="joblevelvalidity" element={<Job_Level_Validity />} />
        <Route path="Position_Type" element={<Position_Type />} />
        <Route path="Employee_Title" element={<Employee_Title />} />
        <Route path="Approval_Matrix" element={<Approval_Matrix />} />
        <Route path="Noc_Type" element={<Noc_Type />} />
        <Route path="nocprocess" element={<Noc_Process />} />
        <Route path="add_hrcalendar_year" element={<Add_HrCalendar_Year />} />
        <Route path="Rating_Model" element={<Rating_Models />} />
        <Route path="Rating_Model_Type" element={<RatingModelTypes />} />
        <Route path="RatingModelTypes" element={<RatingModelTypes />} />
        <Route path="Rating_Type_Points" element={<Rating_Type_Points />} />
        <Route path="RatingTypeLikertScale" element={<Rating_Types_Likert_Scales />} />
        <Route path="Rating_Model_Assignment" element={<Rating_Types_Point_Assignment />} />


        {/* Annual Assessment Setup  */}
        <Route path="Aar_Process_Ho" element={<AAR_Process_HOS />} />

        {/* Leave  */}
        <Route path="Leave_Type" element={<LeaveType />} />
        <Route path="Leave_Apply" element={<LeaveApply />} />
        <Route path="Leave_Dependency" element={<LeaveDependency />} />
        <Route path="Leave_Dependable_Detail" element={<LeaveDependableDetail />} />
        <Route path="Salary_Deductible" element={<SalaryDeductibles />} />
        <Route path="Leave_Approvals" element={<Leave_Approvals />} />
        <Route path="New_Leave_Approvals" element={<New_Leave_Approvals />} />

        {/* Role's  */}
        <Route path="Group" element={<Roles />} />
        <Route path="BasicRole" element={<BasicRole />} />
        <Route path="AdvanceRole" element={<AdvanceRole />} />
        <Route path="BasicRole/:id" element={<UpdateRole />} />

        {/* Transfer Setup */}
        {/* <Route path='Transfer_Rating_Type' element={<TransferRatingType />} /> */}
        <Route path='Transfer_Rating_Model' element={<TransferRatingModel />} />
        {/* {WedLockRoutes} */}
        <Route path="Wedlock_Rating_Farmula" element={<Wedlock_Rating_Formula />} />


        {/* Competent Authority */}
        <Route path='Competent_Authority' element={<CompetentAuthority />} />

        <Route path='Notification' element={<AnnualAssesmentApply />} />



      </Routes>
    </div>
  );
}

export default Setup_Routes

