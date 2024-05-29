
import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LayoutOfSetups from '../../Pages/Setups/LayoutOfSetups/LayoutOfSetups.jsx';
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
import Add_HrCalendar_Year from '../../Pages/Setups/Employee_Setup/Add_HrCalendar_Year.jsx';

// Annual Assessment
import AAR_Prescribed_Form from '../../Pages/Setups/Annual_Assesments_Setups/AAR_Prescribed_Form.jsx'
import AAR_Process_HOS from '../../Pages/Setups/Annual_Assesments_Setups/AAR_Process_HOS.jsx';
import AllRatingModel from '../../Pages/Setups/Annual_Assesments_Setups/AllRatingModel.jsx';
import RatingModelTypes from '../../Pages/Setups/Annual_Assesments_Setups/RatingModelTypes.jsx';
import Rating_Type_Points from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Type_Points.jsx';
import Rating_Types_Likert_Scales from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Types_Likert_Scales.jsx';
import Rating_Types_Point_Assignment from '../../Pages/Setups/Annual_Assesments_Setups/Rating_Types_Point_Assignment.jsx';

//Leave setup's
import LeaveType from '../../Pages/Setups/Leave_Setup/LeaveType.jsx';
import LeaveDependency from '../../Pages/Setups/Leave_Setup/LeaveDependency.jsx';
import LeaveDependableDetail from '../../Pages/Setups/Leave_Setup/LeaveDependableDetail.jsx';
import SalaryDeductibles from '../../Pages/Setups/Leave_Setup/SalaryDeductibles.jsx';
import New_Leave_Approvals from '../../Pages/Setups/Leave_Setup/New_Leave_Approvals.jsx';
import Leave_Approvals from '../../Pages/Setups/Leave_Setup/Leave_Approvals.jsx';
//Hr setups
import HR_Calender_Year from '../../Pages/Setups/HR_Setup/HR_Calender_Year.jsx';
import HR_Add_Holiday from '../../Pages/Setups/HR_Setup/HR_Add_Holiday.jsx';


// Roles
import Roles from '../../Pages/Setups/Role_Management/Roles.jsx';
import BasicRole from '../../Pages/Setups/Role_Management/BasicRole.jsx';
import AdvanceRole from '../../Pages/Setups/Role_Management/AdvanceRole.jsx';
import UpdateRole from '../../Pages/Setups/Role_Management/UpdateRole.jsx'
import TransferRatingModel from '../../Pages/Transfer/ETransferRatingModel/TransferRatingModel.jsx';
import Wedlock_Rating_Formula from '../../Pages/Transfer/Wedlock_Rating_Formula.jsx';
import CompetentAuthority from '../../Pages/Setups/Competent_Authority/CompetentAuthority.jsx';
import AnnualAssesmentApply from '../../Pages/AnnualAssessment/Apply/AllAnnualAssesment.jsx';
import Noc_Process from '../../Pages/NOC/NocApply.jsx';
import Class_Setup from '../../Pages/Setups/Payroll_Setups/Class_Setup.jsx';
import TransferRatingModelApply from '../../Pages/Transfer/ETransferRatingModel/TransferRatingModelApply.jsx';
import TransferRatingModelEdit from '../../Pages/Transfer/ETransferRatingModel/TransferRatingModelEdit.jsx';
import AllEtransferWindow from '../../Pages/Transfer/ETransferWindow/AllETransferWindow.jsx';
import ETransferWindowApply from '../../Pages/Transfer/ETransferWindow/ETransferWindowApply.jsx';
import Deduction_Code from '../../Pages/Setups/Payroll_Setups/Deduction_Code.jsx';
import SameDistrictRestriction from '../../Pages/Transfer/SameDistrictRestriction.jsx';

//Payroll Setups
import Payroll_Period from '../../Pages/Setups/Payroll_Setups/Payroll_Period.jsx';
import Payroll_EmployeeForm from '../../Pages/Setups/Payroll_Setups/Payroll_EmployeeForm.jsx';
import Payroll_Setup from '../../Pages/Setups/Payroll_Setups/Payroll_Setup.jsx';
import Tax_Credit_claim from '../../Pages/Setups/Payroll_Setups/Tax_Credit_claim.jsx';
import Tax_Slabs from '../../Pages/Setups/Payroll_Setups/Tax_Slabs.jsx';
import Pay_Code_Group_Apply from '../../Pages/Setups/Payroll_Setups/Basic_Pay_ Code_Group/Pay_Code_Group_Apply.jsx';
import Pay_Code_Group from '../../Pages/Setups/Payroll_Setups/Basic_Pay_ Code_Group/Pay_Code_Group.jsx';
import Benifit_code from '../../Pages/Setups/Payroll_Setups/Benifit_code.jsx';
import Pay_Code from '../../Pages/Setups/Payroll_Setups/Pay_Code.jsx';
import SalaryBank_SetupForm from '../../Pages/Setups/Payroll_Setups/SalaryBank_SetupForm.jsx';
import Transaction from '../../Pages/Setups/Payroll_Setups/Transaction.jsx';








const Setup_Routes = () => {
  return (
    <div style={{ width: "100%", paddingTop: '10px', paddingRight: '15px' }}>
      <Routes>
        LayoutOfSetups
        <Route path="LayoutOfSetups" element={<LayoutOfSetups />} />
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
        <Route path="Job_Level_Validity" element={<Job_Level_Validity />} />
        <Route path="Position_Type" element={<Position_Type />} />
        <Route path="Employee_Title" element={<Employee_Title />} />
        <Route path="Approval_Matrix" element={<Approval_Matrix />} />
        <Route path="Noc_Type" element={<Noc_Type />} />
        <Route path="nocprocess" element={<Noc_Process />} />
        <Route path="Hr_Calendar_Year" element={<HR_Calender_Year />} />
        <Route path="Rating_Model" element={<AllRatingModel />} />
        <Route path="Hr_Calendar_Year" element={<Add_HrCalendar_Year />} />
        <Route path="Rating_Model_Type" element={<RatingModelTypes />} />
        <Route path="RatingModelTypes" element={<RatingModelTypes />} />
        <Route path="Rating_Type_Points" element={<Rating_Type_Points />} />
        <Route path="RatingTypeLikertScale" element={<Rating_Types_Likert_Scales />} />
        <Route path="Rating_Model_Assignment" element={<Rating_Types_Point_Assignment />} />

        {/* Annual Assessment Setup  */}
        <Route path="Aar_Process_Ho" element={<AAR_Process_HOS />} />
        <Route path="Aa_Rprescribed_Form" element={<AAR_Prescribed_Form />} />

        {/* Leave  */}
        <Route path="Leave_Type" element={<LeaveType />} />
        <Route path="Leave_Dependency" element={<LeaveDependency />} />
        <Route path="Leave_Dependable_Detail" element={<LeaveDependableDetail />} />
        <Route path="Salary_Deductible" element={<SalaryDeductibles />} />
        <Route path="Leave_Approval_Setup" element={<Leave_Approvals />} />
        <Route path="New_Leave_Approvals" element={<New_Leave_Approvals />} />

        <Route path='Transfer_Rating_Model_Apply' element={<TransferRatingModelApply />} />
        <Route path='Transfer_Rating_Model_Edit/:id' element={<TransferRatingModelEdit />} />
        <Route path='Transfer_Rating_Model' element={<TransferRatingModel />} />
        <Route path='E_Transfer_Window_Period' element={<AllEtransferWindow />} />
        <Route path='E_Transfer_Window_Period_Apply' element={<ETransferWindowApply />} />

        {/* Role's  */}
        <Route path="Group" element={<Roles />} />
        <Route path="BasicRole" element={<BasicRole />} />
        <Route path="AdvanceRole" element={<AdvanceRole />} />
        <Route path="BasicRole/:id" element={<UpdateRole />} />

        {/* Transfer Setup */}
        {/* <Route path='Transfer_Rating_Type' element={<TransferRatingType />} /> */}
        <Route path='Same_District_Restriction_Rule' element={<SameDistrictRestriction />} />

        {/* {WedLockRoutes} */}
        <Route path="Wedlock_Rating_Farmula" element={<Wedlock_Rating_Formula />} />
        {/* Competent Authority */}
        <Route path='Competent_Authority' element={<CompetentAuthority />} />
        <Route path='Notification' element={<AnnualAssesmentApply />} />

        {/* Payrole  */}
        <Route path='class_setup' element={<Class_Setup />} />
        <Route path='payroll_period' element={<Payroll_Period />} />
        <Route path='pay_code' element={<Pay_Code />} />
        <Route path='pay_code_group' element={<Pay_Code_Group />} />
        <Route path='pay_code_group_apply' element={<Pay_Code_Group_Apply />} />
        <Route path='payroll_code' element={<Job />} />
        <Route path='tax_slab' element={<Tax_Slabs />} />
        <Route path='tax_credit_claim' element={<Tax_Credit_claim />} />
        <Route path='benefit_code' element={<Benifit_code />} />
        <Route path='payroll_setup' element={<Payroll_Setup />} />
        <Route path='deduction_code' element={<Deduction_Code />} />
        <Route path='employee_form' element={<Payroll_EmployeeForm />} />
        <Route path='salary_bank' element={<SalaryBank_SetupForm />} />
        <Route path='transaction' element={<Transaction />} />

        {/* Hr Calender */}
        <Route path='/Hr_Celander_Year' element={<HR_Calender_Year />} />
        <Route path='/Holiday_Dates' element={<HR_Add_Holiday />} />


      </Routes>
    </div>
  );
}

export default Setup_Routes

