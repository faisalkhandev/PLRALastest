import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Typography, Grid, Grow } from "@mui/material";
import { useTheme } from "@emotion/react";
import { AngleUp, AngleDown } from '../../Assets/Icons/index'
import EmployeeMiniCard from './EmployeeMiniCard'
import { useApprovalsByIdQuery, useGetEmployeeDataByIDQuery } from "../../Features/API/SetupApi";
import { useGetUserByIdQuery } from "../../Features/API/AnnualAssessment";
import Cookies from 'js-cookie'

const EmployeeMinidashboard = ({ onCasualClick, leaveId }) => {
    const theme = useTheme();
    const [detail, setDetail] = useState(true);
    const [empId, setEmpId] = useState(null);
    const [formData, setFormData] = useState({
        employee: empId
    });
  
    useLayoutEffect(() => {
        setEmpId(Cookies.get("user_id"));
        setFormData({
            employee: empId
        })
    }, [empId]);

    //Queries
    const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch } = useApprovalsByIdQuery(leaveId);

    useEffect(() => {
        if (leaveId) {
            const id = leaveData?.results[0]?.employee?.id;
            console.log("leaveData?.results[0]?.employee?.id", leaveData?.results[0]?.employee?.id);
            setEmpId(id);
        }
    }, [leaveData, leaveId]);

    const id = empId;
    //Employee Data 

    const {
        data: employeeById,
        isError,
        EmpisLoading,
        empRefetch,
    } = useGetUserByIdQuery(empId);
    console.log("employeeData in MiniDashBoardsdas ", employeeById);


    //functions
    const detailToggle = () => setDetail(!detail);

    const handleCasualClick = (label) => {
        if (onCasualClick) {
            onCasualClick(label);
        }
    };
    console.log("employeeById", employeeById);
console.log("Center Name", employeeById?.center?.center_name);
console.log("Job Abbreviation", employeeById?.position?.job?.job_abbrivation);
console.log("Reporting Officer", employeeById?.reporting_officer);


    return (
        <Box sx={{}}>
            <Box className="employee_form_dashboard_Img" sx={{ width: "120px", height: '120px', overflow: 'hidden', objectFit: 'cover', mt: 2 }}>
                {/* <img src={`${employeeById?.employee_image}`} alt="" /> */}
            </Box>
            <Typography variant="h5" color="initial"
                sx={{
                    textAlign: 'center',
                    color: theme.palette.primary.main,
                    mt: 1, fontWeight: 600
                }}>{employeeById?.first_name || ""} {employeeById?.last_name || ""}  </Typography>
            <Box sx={{
                borderBottom: `1px solid ${theme.palette.gray[100]}`,
                borderTop: `1px solid ${theme.palette.gray[100]}`,
                mt: 2,
                pb: 1
            }}>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: theme.palette.gray[100], py: 0.8, px: 0.5 }}
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
                                <Typography variant="body2" color="initial">{employeeById?.center?.center_name || ""}</Typography>
                                <Typography variant="body2" color="initial" >{employeeById?.position?.job?.job_abbrivation || ""} </Typography>
                                <Typography variant="body2" color="initial" >{employeeById?.reporting_officer?.first_name || ""} {employeeById?.reporting_officer?.last_name || ""}</Typography> 
                            </Box>
                        </Box>
                    </Grow>
                </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 0.6 }}>
                <Grid item xs={4} sx={{ display: "flex", gap: 2 }} >
                    <EmployeeMiniCard value={7} total={10} label="Casual" onClick={() => handleCasualClick("Casual Leave")} />
                </Grid>
                <Grid item xs={4} sx={{ display: "flex", gap: 2 }} >
                    <EmployeeMiniCard value={6} total={10} label="Medical" onClick={() => handleCasualClick("Medical Leave")} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeMinidashboard;
