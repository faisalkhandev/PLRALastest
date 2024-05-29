import { Box, Grow, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { AngleDown, AngleUp } from "../../../../../Assets/Icons/index";
import { useGetEmployeeDataByIDQuery } from "../../../../../Features/API/SetupApi";

const MiniDashboardHeadOffice = ({ leaveId, onCasualClick }) => {
  const theme = useTheme();
  const [detail, setDetail] = useState(true);

  console.log(leaveId);
  const {data: employeeData,isLoading,refetch: employeeRefetch,} = useGetEmployeeDataByIDQuery(leaveId);
  console.log("EmployeeData: ", employeeData);
  //functions
  const detailToggle = () => setDetail(!detail);

  return (
    <Box sx={{}}>
      <Box className="employee_form_dashboard_Img" sx={{width: "120px",height: "120px",overflow: "hidden",objectFit: "cover",mt: 2,}}>
        <img src={employeeData?.results[0]?.employee_id.employee_image} alt=""/>
      </Box>
      <Typography variant="h5" color="initial" sx={{textAlign: "center",color: theme.palette.primary.main,mt: 1,fontWeight: 600,}}>
        {`${employeeData?.results[0]?.employee_id?.title?.employee_title || ""} ${employeeData?.results[0]?.employee_id?.first_name || ""} ${employeeData?.results[0]?.employee_id?.last_name || ""}`}
      </Typography>
      <Box sx={{borderBottom: `1px solid ${theme.palette.gray[100]}`,borderTop: `1px solid ${theme.palette.gray[100]}`,mt: 2,pb: 1,}}>
        <Box sx={{display: "flex",justifyContent: "space-between",alignItems: "center",cursor: "pointer",background: theme.palette.gray[100],py: 0.8,px: 0.5,}} onClick={detailToggle} role="button" aria-pressed={detail}>
          <Typography variant="body1" color="initial">
            Employee Detail
          </Typography>
          {detail ? <AngleUp /> : <AngleDown />}
        </Box>
        <Box sx={{ mt: 1, display: detail ? "block" : "none" }}>
          <Grow in={detail} timeout={{ enter: 800, exit: 1000 }}>
            <Box sx={{display: "flex",alignItems: "center",justifyContent: "space-between",px: 0.5,}}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="initial" fontWeight={600}>
                  Center
                </Typography>
                <Typography variant="body2" color="initial" fontWeight={600}>
                  Position
                </Typography>
                <Typography variant="body2" color="initial" fontWeight={600}>
                  Reporting Officer
                </Typography>
              </Box>
              <Box sx={{textAlign: "right",display: "flex",flexDirection: "column",gap: 1,}}>
                <Typography variant="body2" color="initial">
                  {employeeData?.results[0]?.employee_id?.center?.center_name}
                </Typography>
                <Typography variant="body2" color="initial">
                  {employeeData?.results[0]?.employee_id?.position?.job?.job_title}
                </Typography>
                <Typography variant="body2" color="initial">
                  {employeeData?.results[0]?.employee_id?.reporting_officer?.first_name +" " +employeeData?.results[0]?.employee_id?.reporting_officer?.last_name}
                </Typography>
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

export default MiniDashboardHeadOffice;
