import React, { useState } from 'react'
import { GoBack } from '../../../../Assets/Icons/index.jsx'
import { Breadcrumb, Loader, ErrorHandler } from '../../../../Components/index.js'
import { Box, Grid } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useNavigate, useParams } from 'react-router-dom'
import EmployeeMinidashboard from '../../../../Components/shared/EmployeeMinidashboard.jsx'
import ApprovalDetail from './NocApprovalDetail.jsx'
import MiniDashboardResignationDetailPage from './MiniDashboardResignationDetailPage.jsx'
import NocApprovalDetail from './NocApprovalDetail.jsx'
import { useApprovalsByIdQuery } from '../../../../Features/API/SetupApi.js'
import { useGetNocApprovalByIdQuery } from '../../../../Features/API/NocAPI.js'
import EmployeeFormDashboard from '../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx'




const ConditionalNocApproval = () => {
  const theme = useTheme();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigate = useNavigate();
  const { id, noc_id } = useParams();
  const {
    data: NocData,
    isLoading: nocLoading,
    isError: nocError,
    refetch,
} = useGetNocApprovalByIdQuery(noc_id);
console.log("first",NocData);

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
        <Breadcrumb title="NOC Approvals" breadcrumbItem="Approvals / NOC Approvals" />
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
              <NocApprovalDetail />
            )}
          </Box>

        </Grid>
        <Grid item xs={3}>
          <Box sx={{
            border: `1px solid ${theme.palette.gray[100]}`, p: 0.5,
            borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll'
          }}>
            <EmployeeFormDashboard userId={NocData?.results[0]?.employee?.id}  title="Processess" processName="NOC"   />
        
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ConditionalNocApproval
