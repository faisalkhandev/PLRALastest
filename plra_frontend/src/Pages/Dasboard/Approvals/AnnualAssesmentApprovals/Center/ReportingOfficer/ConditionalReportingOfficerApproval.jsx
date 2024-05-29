import { useTheme } from '@emotion/react'
import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GoBack } from '../../../../../../Assets/Icons/index.jsx'
import { Breadcrumb } from '../../../../../../Components/index.js'
import { useCcoApprovalByIDQuery } from '../../../../../../Features/API/AnnualAssessment.js'
import MiniDashboardCenter from '../MiniDashboardCenter.jsx'
import ApprovalDetail from './ApprovalDetail.jsx'
import MiniDashboardHeadOffice from '../../HeadOffice/MiniDashboardHeadOffice.jsx'
import EmployeeFormDashboard from '../../../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx'

const ConditionalCounterApproval = () => {
  const theme = useTheme();
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigate = useNavigate();
  const { id, apprvalID } = useParams();

  const { data: counterData, isLoading: counterLoading, isError: counterRefreshError, error: leaveQueryError, refetch, } = useCcoApprovalByIDQuery(apprvalID);

  useEffect(() => { refetch(); }, []);
  console.log("id" + apprvalID);
  console.log("data" + counterData);
  console.log("emp" + counterData?.results[0]?.employee);

  const handleCasualClick = (label) => {
    setSelectedLabel(label)
    console.log(`Casual mini card clicked with label: ${label}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <Box sx={{ width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}` }} onClick={() => window.history.go(-1)}><GoBack /></Box>
        <Breadcrumb title="Reporting Officer Approvals" breadcrumbItem="Approvals / Reporting Officer Approvals" />
      </Box>

      <Grid container spacing={3} >
        <Grid item xs={9}>
          <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll' }}>
            <ApprovalDetail />
          </Box>

        </Grid>
        <Grid item xs={3}>
          <Box sx={{border: `1px solid ${theme.palette.gray[100]}`, p: 0.5,borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll'}}>
        <EmployeeFormDashboard userId={counterData?.results[0]?.employee?.id} title="Processess" processName="Annual Assessment"   />
            
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default ConditionalCounterApproval
