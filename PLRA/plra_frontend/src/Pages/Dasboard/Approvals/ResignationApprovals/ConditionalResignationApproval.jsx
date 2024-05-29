import { useTheme } from '@emotion/react'
import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GoBack } from '../../../../Assets/Icons/index.jsx'
import { Breadcrumb } from '../../../../Components/index.js'
import ApprovalDetail from './ApprovalDetail.jsx'
import { default as MiniDashboardResignationDetail, default as MiniDashboardResignationDetailPage } from './MiniDashboardResignationDetailPage.jsx'
import { useAllResignationByIdQuery } from '../../../../Features/API/ResignationApi.js'
import EmployeeFormDashboard from '../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx'

const ConditionalResignationApproval = () => {
  const theme = useTheme();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigate = useNavigate();
  const { id, apprvalID } = useParams();

  const { data: ResignationData, isLoading: ResignationLoading, isError: ResignationisError, error: ResignationError, refetch, } = useAllResignationByIdQuery(apprvalID);

  useEffect(() => { refetch(); }, []);

  console.log(ResignationData);

  const handleCasualClick = (label) => {
    setSelectedLabel(label)
    console.log(`Casual mini card clicked with label: ${label}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <Box sx={{ width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}` }} onClick={() => window.history.go(-1)}><GoBack /></Box>
        <Breadcrumb title="Resignation Approvals" breadcrumbItem="Approvals / Resignation Approvals" />
      </Box>

      <Grid container spacing={3} >
        <Grid item xs={9}>
          <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll' }}>
            <ApprovalDetail />
          </Box>

        </Grid>
        <Grid item xs={3}>
          <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, p: 0.5, borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll' }}>
            <EmployeeFormDashboard userId={ResignationData?.employee?.id}  title="Processess" processName="Resignation"   />
        
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ConditionalResignationApproval
