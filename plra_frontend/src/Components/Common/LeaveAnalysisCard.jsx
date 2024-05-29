import React, { useEffect, useState } from "react";
import { Box, Grid, Grow, Typography } from "@mui/material";
import { AngleDown, AngleUp } from "../../Assets/Icons";
import EmployeeDetailBox from "../shared/EmployeeMiniCard";

import team from "../../Assets/jpg/team.jpg";
import { HeadingBar } from "../../Components";
import { useTheme } from "@emotion/react";
import "../Styles.css"
import { useGetEmployeeDataByIDQuery } from "../../Features/API/SetupApi";




const LeaveAnalysisCard = ({ userId , onCasualClick}) => {
    const theme = useTheme();
    const [detail, setDetail] = useState(true);
    const detailToggle = () => setDetail(!detail);

    const handleCasualClick = (label) => {
        if (onCasualClick) {
            onCasualClick(label);
        }
    };
    const { data: employeeData, isLoading, refetch: employeeRefetch, } = useGetEmployeeDataByIDQuery(userId);
    useEffect(() => { employeeRefetch(); }, []);
    // console.log("user ID DATA", employeeData);
    // console.log("Data Balance NON ", employeeData?.results[0]?.leave_non_dependable_balance);
    // console.log("Data title ", employeeData?.results[0]?.employee_id?.title?.employee_title);



    return (
        <Box className="employee_form_dashboard" sx={{ height: "calc(100vh - 150px)" }}  >
            {/* Image  */}
            <Box className="employee_form_dashboard_Img" sx={{ width: "200px", height: '200px', overflow: 'hidden', objectFit: 'cover' }}>
                <img src={employeeData?.results[0]?.employee_id?.employee_image} alt="" />
            </Box>
            <Typography variant="h5" color="initial" sx={{ textAlign: 'center', color: theme.palette.primary.main, mt: 1, fontWeight: 600 }}>
                {employeeData?.results[0]?.employee_id?.title?.employee_title ? employeeData.results[0].employee_id.title.employee_title + " " : ""}
                {employeeData?.results[0]?.employee_id?.first_name + " "} {employeeData?.results[0]?.employee_id?.last_name}
            </Typography>


            <Box sx={{ borderBottom: `1px solid ${theme.palette.gray[100]}`, borderTop: `1px solid ${theme.palette.gray[100]}`, mt: 2, pb: 1, }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: theme.palette.gray[100], py: 0.8, px: 0.5, }} onClick={detailToggle} role="button" aria-pressed={detail}>
                    <Typography variant="body1" color="initial">
                        Employee Detail
                    </Typography>
                    {detail ? <AngleUp /> : <AngleDown />}
                </Box>
                <Box sx={{ mt: 1, display: detail ? "block" : "none" }}>
                    <Grow in={detail} timeout={{ enter: 800, exit: 1000 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5, }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography variant="body2" color="initial" fontWeight={600}>
                                    Center
                                </Typography>
                                <Typography variant="body2" color="initial" fontWeight={600}>
                                    Wing
                                </Typography>
                                <Typography variant="body2" color="initial" fontWeight={600}>
                                    Position
                                </Typography>
                                <Typography variant="body2" color="initial" fontWeight={600}>
                                    Reporting Officer
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 1, }}>
                                <Typography variant="body2" color="initial">
                                {employeeData?.results[0]?.employee_id?.center?.center_name || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {employeeData?.results[0]?.employee_id?.position?.wing?.wing_name || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {employeeData?.results[0]?.employee_id?.position?.job?.job_title || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {employeeData?.results[0]?.employee_id?.reporting_officer?.first_name  ? `${employeeData?.results[0]?.employee_id?.reporting_officer?.first_name} 
                                    ${employeeData?.results[0]?.employee_id?.reporting_officer?.last_name || '-'}`  : '-'
                                    }
                                </Typography>
                            </Box>
                        </Box>
                    </Grow>
                </Box>
            </Box>


            <HeadingBar title="Leave Balance Detail" />
            <Grid container spacing={2} sx={{ mt: -2 }}>

                {employeeData?.results[0]?.leave_dependable_balance.map((item) => (
                    <Grid item xs={4} key={item.leave_type.leave_id}>
                            <EmployeeDetailBox value={item?.leave_deduction_used} total={item?.leave_deduction_bucket_allowed} label={item?.leave_type?.leave_type} onClick={() => handleCasualClick(item?.leave_type?.leave_type)} />
                    </Grid>
                ))}

                {employeeData?.results[0]?.leave_non_dependable_balance.map((item) => (
                    <Grid item xs={4} key={item.leave_type.leave_id}>
                            <EmployeeDetailBox value={item?.leave_type_used} total={item?.leave_type_allowed} label={item?.leave_type?.leave_type} onClick={() => handleCasualClick(item?.leave_type?.leave_type)} />
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
};

export default LeaveAnalysisCard;
