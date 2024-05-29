import React, { useState } from 'react'
import { Box, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import { useTheme } from '@emotion/react'
import SwiperCard from './Swiper/SwiperCard.jsx'
import { IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ApprovalCard from './Approvals/ApprovalCard.jsx'
import { useDashboardProcessCountQuery, useDashboardApprovalCountQuery } from '../../Features/API/DashboardApi.js'
import PersonalDetail from './PersonalDetail'
import PersonalDashboard from './Tabs/@Personal'
import ReportingOfficerDashboard from './Tabs/@ReportingOfficer'
import CounterAssiginingOfficerlDashboard from './Tabs/@CounterAssiginingOfficer'
import WingDirectorDashboard from './Tabs/@WingDirector'
import HRUserDashboard from './Tabs/@HRUser'
import ConcernOfficerDashboard from './Tabs/@ConcernOfficer'
import HRDirectorDashboard from './Tabs/@HRDirector'
import ADGDashboard from './Tabs/@ADG'
import DGDashboard from './Tabs/@DG'
import AllWingBarData from './MyDepartment/AllWingBarData.jsx';
import { DataStatusCard } from '../../Components/index.js'


const Dashboard = () => {
  const theme = useTheme();
  const [activitesTab, setActivitesTab] = useState(true);
  const [leaveTab, setLeaveTab] = useState(true);
  const [directorHRTab, setDirectorHRTab] = useState(true);
  const [workItem, setWorkItem] = useState(true)
  const [value, setValue] = useState('dashboard');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleActivitesTab = () => setActivitesTab(!activitesTab);
  const handleLeaveTab = () => setLeaveTab(!leaveTab);
  const handleDirectorHRTab = () => setDirectorHRTab(!directorHRTab);
  const handleWorkItem = () => setWorkItem(!workItem);


  //Queries
  const { data: processData, isLoading: loading, isError: refreshError, error: queryError, refetch } = useDashboardProcessCountQuery();
  const { data: approvalData, loading: approvalLoading, isError: approvalRefreshError, error: approvalQueryError } = useDashboardApprovalCountQuery();
  const ApprovalCount = approvalData?.count > 0;

  const headers = ['ID', 'Wing Name', 'Description'];
  const rows = [
    ['1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['2', 'Row 2 Col 2', 'Row 2 Col 3'],
    ['3', 'Row 3 Col 2', 'Row 3 Col 3'],
    ['2', 'Row 4 Col 2', 'Row 4 Col 3'],
  ];

  const NocLength = processData?.results[0]?.process_counts?.Leave?.length > 0;

  // Function to determine which component to render
  const renderComponent = () => {
    switch (value) {
      case 'dashboard':
        return <PersonalDashboard />;
      case 'ro':
        return <ReportingOfficerDashboard />;
      case 'cao':
        return <CounterAssiginingOfficerlDashboard />;
      case 'wd':
        return <WingDirectorDashboard />;
      case 'hru':
        return <HRUserDashboard />;
      case 'co':
        return <ConcernOfficerDashboard />;
      case 'hrd':
        return <HRDirectorDashboard />;
      case 'adg':
        return <ADGDashboard />;
      case 'dg':
        return <DGDashboard />;
      default:
        return null;
    }
  };



  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h5" sx={{ margin: 0, fontWeight: "bold", mb: 2 }}>Dashboard</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <SwiperCard />
        </Grid>
        <Grid item xs={2.5}></Grid>
        <Grid item xs={3.5} >
          <PersonalDetail />
        </Grid>
      </Grid>



      {/* Leave and Activity */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ borderRadius: '4px', backgroundColor: 'transparent' }}>
            <Box sx={{ borderBottom: "2px solid black", display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.3, cursor: 'pointer' }} onClick={handleLeaveTab}>
              <Typography sx={{ fontWeight: 'bold' }}>Leave</Typography>
              <IconButton> {leaveTab ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
              <FormControl sx={{ width: '200px' }}>
                <InputLabel id="demo-simple-select-label">Options</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  label="Options"
                  onChange={handleChange}
                >
                  <MenuItem value="dashboard" sx={{ width: '200px' }}>My Dashboard</MenuItem>
                  <MenuItem value="ro" sx={{ width: '200px' }}>Reporting Officer</MenuItem>
                  <MenuItem value="cao" sx={{ width: '200px' }}>Counter Assigining Officer</MenuItem>
                  <MenuItem value="wd" sx={{ width: '200px' }}>Wing Director</MenuItem>
                  <MenuItem value="hru" sx={{ width: '200px' }}>HR User</MenuItem>
                  <MenuItem value="co" sx={{ width: '200px' }}>Concern Officer</MenuItem>
                  <MenuItem value="hrd" sx={{ width: '200px' }}>HR Director</MenuItem>
                  <MenuItem value="adg" sx={{ width: '200px' }}>ADG</MenuItem>
                  <MenuItem value="dg" sx={{ width: '200px' }}>DG</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {leaveTab && (
              <>
                  <Box sx={{ mt: -6 }}>
                    <Grid container spacing={2}>
                      <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={1.5}>
                          <DataStatusCard title="JOINING THIS MONTH" count={35} redirectLink="/" bgcolor={'#00838f'} />
                        </Grid>
                        <Grid item xs={1.5}>
                          <DataStatusCard title="JOINING THIS YEAR" count={130} redirectLink="/" bgcolor={'#00838f'} />
                        </Grid>
                        <Grid item xs={1.5}>
                          <DataStatusCard title="RESIGNATION THIS MONTH" count={5} redirectLink="/" bgcolor={'#00838f'} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                {renderComponent()}
              </>
            )}
          </Box>
        </Grid>
      </Grid>


      {/* Work Items */}
      {ApprovalCount ?
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ borderRadius: '4px', backgroundColor: 'transparent' }}>
              <Box sx={{ borderBottom: "2px solid black", display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.3, cursor: 'pointer' }} onClick={handleWorkItem} // Step 1
              >
                <Typography sx={{ fontWeight: 'bold' }}>Work Assign to Me</Typography>
                <IconButton>{directorHRTab ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
              </Box>
              {workItem && (
                <Box sx={{ py: 1 }}>
                  <Grid container spacing={2} sx={{ my: 2 }}>
                    <Grid item xs={4}>
                      <ApprovalCard />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid> : null}


    </Box >
  )
}

export default Dashboard


{/* {leaveTab && (
              <Box sx={{ py: 1 }}>
                <Grid container spacing={2}>
                  <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={1.5}>
                      <DataStatusCard title="JOINING THIS MONTH" count={35} redirectLink="/" bgcolor={'#00838f'} />
                    </Grid>
                    <Grid item xs={1.5}>
                      <DataStatusCard title="JOINING THIS YEAR" count={130} redirectLink="/" bgcolor={'#00838f'} />
                    </Grid>
                    <Grid item xs={1.5}>
                      <DataStatusCard title="RESIGNATION THIS MONTH" count={5} redirectLink="/" bgcolor={'#00838f'} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )} */}
{/* Extra  */ }
{/* <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <LeaveAnalysisCard name="Earned Leave" count={35} redirectLink="/" bgcolor={'#7AC4CB'} />
                        <LeaveAnalysisCard name="Casual Leave" count={35} redirectLink="/" bgcolor={'#00838f'} />
                        <LeaveAnalysisCard name="Maternity Leave" count={35} redirectLink="/" bgcolor={'#00838f'} />
                        <LeaveAnalysisCard name="Sick Leave" count={7} redirectLink="/" bgcolor={'#00838f'} />
    </Box> */}