import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Leave_approval_table from './LeaveApprovals/Leave_approval_table.jsx';
import Super_approval_table from './SuperApprovals/Super_approval_table.jsx';

import LeaveApprovalDetail from './LeaveApprovals/LeaveApprovalDetail.jsx'
import Super_approval_detail from './SuperApprovals/Super_approval_detail.jsx';

import SuperApprovalsTable from './SuperApprovals/SuperApprovalsTable.jsx';
import SuperApprovalsDetails from './SuperApprovals/SuperApprovalsDetails.jsx';
import SuperDetail from './SuperApprovals/SuperDetail.jsx';


const Approval = () => {
    return (
        <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Routes>
                <Route path="/leaveapproval" element={<Leave_approval_table />} />
                <Route path="/leaveapproval/:id/approval/:leave_request_id" element={<LeaveApprovalDetail />} />
                <Route path="/superapproval" element={<Super_approval_table />} />
                <Route path="/superapproval/:id/superapproval/:leave_request_id" element={<Super_approval_detail />} />
            </Routes>
        </div>
    )
}

export default Approval
