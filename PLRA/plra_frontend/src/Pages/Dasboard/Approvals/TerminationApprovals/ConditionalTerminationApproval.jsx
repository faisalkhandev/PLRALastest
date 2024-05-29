import React, { useState } from 'react'
import { GoBack } from '../../../../Assets/Icons/index.jsx'
import { Breadcrumb } from '../../../../Components/index.js'
import { Box, Grid } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useNavigate, useParams } from 'react-router-dom'
import ApprovalDetail from './ApprovalDetail.jsx'
import MiniDashboardResignationDetailPage from './MiniDashboardResignationDetailPage.jsx'
import MiniDashboardTerminationDetail from './MiniDashboardTerminationDetail.jsx'
import { useGetTerminationApprovalQuery } from '../../../../Features/API/Termination.js'
import EmployeeFormDashboard from '../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx'




const ConditionalTerminationApproval = () => {
  const theme = useTheme();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigate = useNavigate();
  const { id, approvalID } = useParams();

  const { data: approvalData, isLoading: approvalLoading, isError: approvalRefreshError, error: approvalQueryError, refetch } = useGetTerminationApprovalQuery(approvalID);

  console.log('EmployeeDataa:::', approvalData?.results[0]?.employee?.id)

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
        <Breadcrumb title="Termination  Approvals" breadcrumbItem="Approvals / Termination Approvals" />
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
                <MiniDashboardResignationDetailPage fillter={`${selectedLabel}`} onCasualClick={handleCasualClick} />
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
          }}>
            {/* <MiniDashboardTerminationDetail onCasualClick={handleCasualClick} leaveId={approvalData} /> */}
        <EmployeeFormDashboard userId={approvalData?.results[0]?.employee?.id} title="Processess" processName="Termination"   />


          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ConditionalTerminationApproval
