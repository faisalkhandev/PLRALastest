import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Grow } from "@mui/material";
import { useTheme } from "@emotion/react";
import { AngleDown, AngleUp } from "../../../../Assets/Icons";
import { useApprovalsByIdQuery, useGetEmployeeDataByIDQuery } from "../../../../Features/API/SetupApi";
import { useFetcher } from "react-router-dom";


const MiniDashboardTerminationDetail = ({ onCasualClick, leaveId }) => {
  const theme = useTheme();
  const [detail, setDetail] = useState(true);
  const [getId, setGetId] = useState(null)


  useEffect(() => {
    setGetId(leaveId?.employee?.id)
  }, [])

  
  //Queries
  const { data: leaveIdemployeeData, isLoading, refetch: employeeRefetch } = useGetEmployeeDataByIDQuery(leaveId?.results[0]?.employee?.id);


  //functions
  const detailToggle = () => setDetail(!detail)
  const handleCasualClick = (label) => {
    if (onCasualClick) {
      onCasualClick(label);
    }
  };

  return (
    <Box sx={{}}>
      <Box className="employee_form_dashboard_Img" sx={{ width: "120px", height: '120px', overflow: 'hidden', objectFit: 'cover', mt: 2 }}>
        <img src={leaveId?.results[0]?.employee?.employee_image} alt="" />
      </Box>

      <Typography variant="h5" color="initial"
        sx={{
          textAlign: 'center',
          color: theme.palette.primary.main,
          mt: 1, fontWeight: 600
        }}>  {leaveId?.results[0]?.employee?.first_name || ''} {leaveId?.results[0]?.employee?.last_name || ''}</Typography>
      <Box sx={{
        borderBottom: `1px solid ${theme.palette.gray[100]}`,
        borderTop: `1px solid ${theme.palette.gray[100]}`,
        mt: 2,
        pb: 1
      }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            background: theme.palette.gray[100],
            py: 0.8, px: 0.5
          }}
          onClick={detailToggle}
          role="button"
          aria-pressed={detail}
        >
          <Typography variant="body1" color="initial">Employee Detail</Typography>
          {detail ? <AngleUp /> : <AngleDown />}
        </Box>
        <Box sx={{ mt: 1, display: detail ? 'block' : 'none' }}>
           <Grow in={detail} timeout={{ enter: 800, exit: 1000 }}>
           <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "space-between", px: 0.5 }}>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
               <Typography variant="body2" color="initial" fontWeight={600}>Center</Typography>
               <Typography variant="body2" color="initial" fontWeight={600}>Position</Typography>
               <Typography variant="body2" color="initial" fontWeight={600}>Reporting Officer</Typography>

             </Box>
             <Box sx={{ textAlign: "right", display: 'flex', flexDirection: 'column', gap: 1 }}>
               <Typography variant="body2" color="initial" >{leaveIdemployeeData?.results[0]?.employee_id?.center?.center_name}</Typography>
               <Typography variant="body2" color="initial" >{leaveIdemployeeData?.results[0]?.employee_id?.position?.position_id}</Typography>
               <Typography variant="body2" color="initial" >{leaveIdemployeeData?.results[0]?.employee_id?.reporting_officer?.first_name + ' ' + leaveIdemployeeData?.results[0]?.employee_id?.reporting_officer?.last_name}</Typography>
             </Box> 
           </Box>
         </Grow>
        </Box>
      </Box>
      {/* <Grid container spacing={2} sx={{ mt: 0.6 }}>
                <Grid item xs={4} sx={{ display: "flex", gap: 2 }} >
                    <EmployeeMiniCard value={2} total={10} label="Casual" onClick={() => handleCasualClick("Casual Leave")} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", gap: 2 }} >
                    <EmployeeMiniCard value={3} total={10} label="Medical" onClick={() => handleCasualClick("Medical Leave")} />
                </Grid>
            </Grid> */}
    </Box>
  );
};

export default MiniDashboardTerminationDetail;