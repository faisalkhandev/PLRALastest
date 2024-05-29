import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AllLeaveApprovals from './Approvals/LeaveApprovals/AllLeaveApprovals.jsx';
import AllSuperLeaveApprovals from './Approvals/SuperApprovals/AllSuperLeaveApprovals.jsx';

import ConditionalLeaveApproval from './Approvals/LeaveApprovals/ConditionalLeaveApproval.jsx';
import ConditionalSuperLeaveApprovals from './Approvals/SuperApprovals/ConditionalSuperLeaveApprovals.jsx';

import PendingSuperApprovalsDetails from './Approvals/SuperApprovals/PendingSuperApprovalsDetails.jsx';

import AllResignationApprovals from './Approvals/ResignationApprovals/AllResignationApprovals.jsx';
import ConditionalResignationApproval from './Approvals/ResignationApprovals/ConditionalResignationApproval.jsx';

import AllTerminationApprovals from './Approvals/TerminationApprovals/AllTerminationApprovals.jsx';
import ConditionalTerminationApproval from './Approvals/TerminationApprovals/ConditionalTerminationApproval.jsx';

import AllNocApprovals from './Approvals/NocApprovals/AllNocApprovals.jsx';
import ConditionalNocApproval from './Approvals/NocApprovals/ConditionalNocApproval.jsx';

import AllCounterApprovals from './Approvals/AnnualAssesmentApprovals/Center/Counter/AllCounterApprovals.jsx';
import ConditionalCounterApproval from './Approvals/AnnualAssesmentApprovals/Center/Counter/ConditionalCounterApproval.jsx';

import AllReportingOfficerApprovals from './Approvals/AnnualAssesmentApprovals/Center/ReportingOfficer/AllReportingOfficerApprovals.jsx';
import ConditionalReportingOfficerApproval from './Approvals/AnnualAssesmentApprovals/Center/ReportingOfficer/ConditionalReportingOfficerApproval.jsx';

import AllHOCounterApprovals from './Approvals/AnnualAssesmentApprovals/HeadOffice/Counter/AllHOCounterApprovals.jsx';
import ConditionalHoCounterApproval from './Approvals/AnnualAssesmentApprovals/HeadOffice/Counter/ConditionalHoCounterApproval.jsx';

import AllHOReportingOfficerApprovals from './Approvals/AnnualAssesmentApprovals/HeadOffice/ReportingOfficer/AllHOReportingOfficerApprovals.jsx';
import ConditionalHOReportingOfficerApproval from './Approvals/AnnualAssesmentApprovals/HeadOffice/ReportingOfficer/ConditionalHOReportingOfficerApproval.jsx';


import AllDgApprovals from './Approvals/AnnualAssesmentApprovals/DG/AllDGApprovals.jsx';
import ConditionalDgApproval from './Approvals/AnnualAssesmentApprovals/DG/ConditionalDgApprovals.jsx';
import AllDGFinalApprovals from './Approvals/DisciplinaryProcedingApprovals/DGFinalApprovals/AllDGFinalApprovals.jsx';
import ConditionalDGFinalApproval from './Approvals/DisciplinaryProcedingApprovals/DGFinalApprovals/ConditionalDGFinalApproval.jsx';
import AllDGFirstApprovals from './Approvals/DisciplinaryProcedingApprovals/DGFirstApprovals/AllDGFirstApprovals.jsx';
import ConditionalDGFirstApproval from './Approvals/DisciplinaryProcedingApprovals/DGFirstApprovals/ConditionalDGFirstApproval.jsx';
import AllDirHRApprovals from './Approvals/DisciplinaryProcedingApprovals/HRDirApprovals/AllHRDirApprovals.jsx';
import ConditionalDirHRApproval from './Approvals/DisciplinaryProcedingApprovals/HRDirApprovals/ConditionalHRDirApproval.jsx';
import AllHRUserApprovals from './Approvals/DisciplinaryProcedingApprovals/HRUserApprovals/AllHRUserApprovals.jsx';
import ConditionalHRUserApproval from './Approvals/DisciplinaryProcedingApprovals/HRUserApprovals/ConditionalHRUserApproval.jsx';
import AllProbOfficerApprovals from './Approvals/DisciplinaryProcedingApprovals/ProbOfficerApprovals/AllProbOfficerApprovals.jsx';
import ConditionalProbOfficerApproval from './Approvals/DisciplinaryProcedingApprovals/ProbOfficerApprovals/ConditionalProbOfficerApproval.jsx';
import AllRegularInquiryOfficerApprovals from './Approvals/DisciplinaryProcedingApprovals/RegularInquiryOfficerApprovals/AllRegularInquiryOfficerApprovals.jsx';
import ConditionalRegularInquiryOfficerApproval from './Approvals/DisciplinaryProcedingApprovals/RegularInquiryOfficerApprovals/ConditionalRegularInquiryOfficerApproval.jsx';
import AllTransferApprovals from './Approvals/TransferApprovals/AllTransferApprovals.jsx';
import ConditionalTransferApproval from './Approvals/TransferApprovals/ConditionalTransferApproval.jsx';
import AllEtransferWindow from './Approvals/ETransferApprovals/ConcernOfficerApproval/AllETransferWindow.jsx';
import AllETransferProcess from './Approvals/ETransferApprovals/ConcernOfficerApproval/ALlETransferProcess.jsx';
import ElevationProcess from './Approvals/ElevationApprovals/ElevationProcess.jsx';
import ElevationDoc from './Approvals/ElevationApprovals/ElevationDoc.jsx';
import ProgressionProcess from './Approvals/ProgressionApprovals/ProgressionProcess.jsx';
import ApprovalDetail from './Approvals/ProgressionApprovals/ApprovalDetail.jsx';
import OpenTransferPositions from './Approvals/ETransferApprovals/HRDirApproval/OpenTransferPositions.jsx';
import HRApprovalDetails from './Approvals/ETransferApprovals/HRDirApproval/HRDirApprovalDetails.jsx';




const Approval = () => {
    return (
        <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Routes>
                <Route path="/leaveapproval" element={<AllLeaveApprovals />} />
                <Route path="/leaveapproval/:id/approval/:leave_request_id" element={<ConditionalLeaveApproval />} />

                <Route path="/superapproval" element={<AllSuperLeaveApprovals />} />
                <Route path="/superapproval/:id/superapproval/:leave_request_id" element={<ConditionalSuperLeaveApprovals />} />

                <Route path="/superapproval/:id/pending-superapproval/:leave_request_id" element={<PendingSuperApprovalsDetails />} />

                <Route path="/resignationapproval" element={<AllResignationApprovals />} />
                <Route path="/resignationapproval/:id/resignationapproval/:apprvalID" element={<ConditionalResignationApproval />} />

                <Route path="/terminationapproval" element={<AllTerminationApprovals />} />
                <Route path="/terminationapproval/:id/terminationapproval/:approvalID" element={<ConditionalTerminationApproval />} />

                <Route path="/disciplinaryprocedingapproval/probofficerapproval" element={<AllProbOfficerApprovals />} />
                <Route path="/probofficerapproval/:id/probofficerapproval/:approvalID" element={<ConditionalProbOfficerApproval />} />

                <Route path="/disciplinaryprocedingapproval/dgfirstapproval" element={<AllDGFirstApprovals />} />
                <Route path="/dgfirstapproval/:id/dgfirstapproval/:approvalID" element={<ConditionalDGFirstApproval />} />

                <Route path="/disciplinaryprocedingapproval/hruserapproval" element={<AllHRUserApprovals />} />
                <Route path="/hruserapproval/:id/hruserapproval/:approvalID" element={<ConditionalHRUserApproval />} />

                <Route path="/disciplinaryprocedingapproval/regularinquiryofficerapproval" element={<AllRegularInquiryOfficerApprovals />} />
                <Route path="/regularinquiryofficerapproval/:id/regularinquiryofficerapproval/:approvalID" element={<ConditionalRegularInquiryOfficerApproval />} />

                <Route path="/disciplinaryprocedingapproval/dirhrapproval" element={<AllDirHRApprovals />} />
                <Route path="/dirhrapproval/:id/dirhrapproval/:approvalID" element={<ConditionalDirHRApproval />} />

                <Route path="/disciplinaryprocedingapproval/dgfinalapproval" element={<AllDGFinalApprovals />} />
                <Route path="/dgfinalapproval/:id/dgfinalapproval/:approvalID" element={<ConditionalDGFinalApproval />} />

                <Route path="/nocapproval" element={<AllNocApprovals />} />
                <Route path="/nocapproval/:id/nocapproval/:noc_id" element={<ConditionalNocApproval />} />

                <Route path="/annualassesment/center/counter" element={<AllCounterApprovals />} />
                <Route path="/annualassesment/:id/approval/:apprvalID" element={<ConditionalCounterApproval />} />

                <Route path="/annualassesment/center/reportingofficer" element={<AllReportingOfficerApprovals />} />
                <Route path="/annualassesment/:id/cro_approval/:apprvalID" element={<ConditionalReportingOfficerApproval />} />

                <Route path="/annualassesment/headoffice/counter" element={<AllHOCounterApprovals />} />
                <Route path="/annualassesment/:id/hoc_approval/:apprvalID" element={<ConditionalHoCounterApproval />} />

                <Route path="/annualassesment/headoffice/reportingOfficer" element={<AllHOReportingOfficerApprovals />} />
                <Route path="/annualassesment/:id/horo_approval/:apprvalID" element={<ConditionalHOReportingOfficerApproval />} />
                
                <Route path="/annualassesment/center/competentauthority" element={<AllDgApprovals />}  />
                <Route path="/annualassesment/:id/ca_approval/:apprvalID" element={<ConditionalDgApproval />} />

                <Route path="/transferapproval" element={<AllTransferApprovals />}  />
                <Route path="/transferapproval/:id" element={<ConditionalTransferApproval />} />

                <Route path="/transferwindow" element={<AllEtransferWindow />} />
                <Route path="/transferprocess/:id" element={<AllETransferProcess />} />

                <Route path="/hrdirtransferapproval" element={<OpenTransferPositions />} />
                <Route path="/hrdirtransferapproval/:id" element={<HRApprovalDetails />} />

                <Route path="/ElevationProcess" element={<ElevationProcess />} />
                <Route path="/ElevationProcess/:id" element={<ElevationDoc />} />

                <Route path="/ProgressionProcess" element={<ProgressionProcess />} />
                <Route path="/progressionapproval/:id" element={<ApprovalDetail />} />

            </Routes>
        </div>
    )
}

export default Approval
