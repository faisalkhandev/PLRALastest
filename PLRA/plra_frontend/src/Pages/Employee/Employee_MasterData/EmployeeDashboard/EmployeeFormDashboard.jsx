import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Grid, Grow, Typography } from "@mui/material";
import team from "../../../../Assets/jpg/team.jpg";
import { HeadingBar } from "../../../../Components";
import { useTheme } from "@emotion/react";
import "../../Styles.css"
import { AngleDown, AngleUp } from "../../../../Assets/Icons";
import EmployeeDetailBox from "../../../../Components/shared/EmployeeMiniCard";
import { useGetEmployeeDataByIDQuery } from "../../../../Features/API/SetupApi";
import { useGetEmployeeMiniDashboardDataQuery } from "../../../../Features/API/EmployeeMasterDataAPI";

const EmployeeFormDashboard = ({ dataType, height, userId, onCasualClick,title,processName }) => {

    //useStates
    const theme = useTheme();
    const [detail, setDetail] = useState(true);
    const detailToggle = () => setDetail(!detail);
    const [api, setApi] = useState(null);
    const { data: employeeData, isLoading, refetch: employeeRefetch, } = useGetEmployeeDataByIDQuery(userId);
    const { data: miniData, isLoading: miniLoading, isError: miniRefreshError, error: miniQueryError, refetch: Refetch } = useGetEmployeeMiniDashboardDataQuery(userId);

console.log(miniData)
//useEffect
    useEffect(() => {
        fetchData();
        employeeRefetch();
        Refetch();
    }, [userId, employeeData, miniData]);
    
//Functions
    const fetchData = async () => {
        try {
            if (dataType === "leave") {
                setApi(employeeData?.results[0]);
            } else {
                setApi(miniData?.results[0]);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handleCasualClick = (label) => {
        if (onCasualClick) {
            onCasualClick(label);
        }
    };
    
    return (
        <Box className="employee_form_dashboard" sx={{ height: { height } }} >
            {/* Image  */}
            <Box className="employee_form_dashboard_Img" sx={{ width: "200px", height: '200px', overflow: 'hidden', objectFit: 'cover' }}>
                <img src={api?.employee_id?.employee_image} alt="" style={{ objectFit: "contain", width: "100%", height: "100%" }} />
            </Box>
            {api ?
                <Typography variant="h5" color="initial" sx={{ textAlign: 'center', color: theme.palette.primary.main, mt: 1, fontWeight: 600 }}>{employeeData?.results[0]?.employee_id.title?.employee_title || ''} {api?.employee_id?.first_name + ' ' + api?.employee_id?.last_name}</Typography>
                : "No Data"}

            <Box sx={{ borderBottom: `1px solid ${theme.palette.gray[100]}`, borderTop: `1px solid ${theme.palette.gray[100]}`, mt: 1, pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: theme.palette.gray[100], py: 0.8, px: 0.5, }} onClick={detailToggle} role="button" aria-pressed={detail}>
                    <Typography variant="body1" color="initial" sx={{fontWeight:"bold"}} >
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
                                    {api?.employee_id?.center?.center_name || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {api?.employee_id?.position?.wing?.wing_name || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {api?.employee_id?.position?.job?.job_title || "-"}
                                </Typography>
                                <Typography variant="body2" color="initial">
                                    {api?.employee_id?.reporting_officer?.first_name ? `${api?.employee_id?.reporting_officer?.first_name} 
                                    ${api?.employee_id?.reporting_officer?.last_name || '-'}` : '-'
                                    }
                                </Typography>
                            </Box>
                        </Box>
                    </Grow>
                </Box>
            </Box>
          
                        <Box sx={{ pl: 0.5, mb:1.5}}>
                            <HeadingBar title="Processes" /></Box>
                           
            <Grid container spacing={1} sx={{ mt: -2,backgroundColor:"black" }}>
                {
                    dataType === "leave" ?
                        (
                            <>
                                <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", gap: 0.5, cursor: "pointer", flexWrap: "wrap", }}>

                                    {api?.leave_dependable_balance.map((item) => (
                                        <Grid item xs={3.8} key={item.leave_type.leave_id}>
                                            <EmployeeDetailBox value={item?.leave_deduction_used} total={item?.leave_deduction_bucket_allowed} label={item?.leave_type?.leave_type} onClick={() => handleCasualClick(item?.leave_type?.leave_type)} />
                                        </Grid>
                                    ))}

                                    {api?.leave_non_dependable_balance.map((item) => (
                                        <Grid item xs={3.8} key={item.leave_type.leave_id}>
                                            <EmployeeDetailBox value={item?.leave_type_used} total={item?.leave_type_allowed} label={item?.leave_type?.leave_type} onClick={() => handleCasualClick(item?.leave_type?.leave_type)} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) :
                        <Grid item xs={12} sx={{ display: "flex", flexDirection: "row", gap: 0.5, cursor: "pointer", flexWrap: "wrap" }}>
                        {api?.process_counts ? (
                            Object.entries(api?.process_counts).map(([key, value]) => (
                                processName ? (
                                    value.name === processName ? (
                                        <Grid key={key} item xs={3.8}>
                                            <Box className="employee_form_dashboard_detail_box" sx={{ height: '92px' }}>
                                                <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                                                    {value.count}
                                                </Typography>
                                                <Typography variant="body1" color="initial" sx={{textAlign:"center"}}>
                                                    {value.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ) : null
                                ) : (
                                    <Grid key={key} item xs={3.8}>
                                        <Box className="employee_form_dashboard_detail_box" sx={{ height: '92px' }}>
                                            <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                                                {value.count}
                                            </Typography>
                                            <Typography variant="body1" color="initial" sx={{textAlign:"center"}}>
                                                {value.name}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )
                            ))
                        ) : (
                            <Typography variant="body1" color="initial">No Data</Typography>
                        )}
            </Grid>
}
            </Grid>

        </Box>
    );
};

export default EmployeeFormDashboard;
