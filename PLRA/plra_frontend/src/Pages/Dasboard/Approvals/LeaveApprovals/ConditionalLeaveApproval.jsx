import React, { useState } from 'react'
import { GoBack } from '../../../../Assets/Icons/index.jsx'
import { Breadcrumb, Loader, ErrorHandler } from '../../../../Components/index.js'
import { Box, Grid } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useNavigate, useParams } from 'react-router-dom'
import EmployeeMinidashboard from '../../../../Components/shared/EmployeeMinidashboard.jsx'
// Real import 
import EmployeeFormDashboard from '../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx'

import ApprovalDetail from './ApprovalDetail.jsx'
//Test import 
// import ApprovalDetail from '../AnnualAssesmentApprovals/HeadOffice/Counter/ApprovalDetail.jsx'
import MiniDashboardLeaveDetailpage from './MiniDashboardLeaveDetailpage.jsx'

import { useApprovalsByIdQuery } from '../../../../Features/API/SetupApi.js';

const ConditionalLeaveApproval = () => {
  const theme = useTheme();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigate = useNavigate();
  const { id, leave_request_id } = useParams();

  const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch: leaverefectch } = useApprovalsByIdQuery(leave_request_id);

  const handleCasualClick = (label) => {
    setSelectedLabel(label)
    console.log(`Casual mini card clicked with label: ${label}`);
  };
   
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <Box sx={{
          width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
          transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
          boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
        }} onClick={() => window.history.go(-1)}><GoBack /></Box>
        <Breadcrumb title="Leave Approvals" breadcrumbItem="Approvals / LeaveApprovals" />
      </Box>

      <Grid container spacing={3} >
        <Grid item xs={9}>
          <Box sx={{
            border: `1px solid ${theme.palette.gray[100]}`,
            borderRadius: '4px',
            height: 'calc(100vh - 200px)',
            maxWidth: '100%',
            overflow: 'scroll'
          }}>
            {selectedLabel === "Casual Leave" || selectedLabel === "Medical Leave" ? ( 
              <Box>
                <MiniDashboardLeaveDetailpage fillter={`${selectedLabel}`} onCasualClick={handleCasualClick} />
              </Box>
            ) : (
              <ApprovalDetail />
            )}
          </Box>

        </Grid>
        <Grid item xs={3}>
          <Box sx={{
            border: `1px solid ${theme.palette.gray[100]}`, p: 0.5,
            borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll'
          }}><EmployeeFormDashboard userId={leaveData?.results[0]?.employee?.id} onCasualClick={handleCasualClick} dataType="leave" title="Leave Balance Detail" height="calc(100vh - 150px)" />
            
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ConditionalLeaveApproval
