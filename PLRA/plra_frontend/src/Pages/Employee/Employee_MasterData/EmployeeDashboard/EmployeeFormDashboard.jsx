import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import team from "../../../../Assets/jpg/team.jpg";
import { HeadingBar } from "../../../../Components";
import { useTheme } from "@emotion/react";
import "../../Styles.css"



const EmployeeFormDashboard = () => {
    const theme = useTheme();
    return (
        <Box className="employee_form_dashboard" >
            {/* Image  */}
            <Box className="employee_form_dashboard_Img" sx={{ width:"200px", height:'200px', overflow:'hidden', objectFit:'cover' }}>
                <img src={team} alt="" />
            </Box>
            <Typography variant="h5" color="initial" sx={{ textAlign: 'center', color: theme.palette.primary.main, mt: 1, fontWeight: 600 }}>Ahmed Ali </Typography>
            <HeadingBar title="Detail" />

            <Grid container spacing={2} sx={{ mt: -2 }}>
                <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <Box className="employee_form_dashboard_detail_box">
                        <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                            0
                        </Typography>
                        <Typography variant="h6" color="initial">
                            Leave's
                        </Typography>
                    </Box>
                    <Box className="employee_form_dashboard_detail_box">
                        <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                            0
                        </Typography>
                        <Typography variant="h6" color="initial">
                            Leave's
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={4}>
                    <Box className="employee_form_dashboard_detail_box">
                        <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                            0
                        </Typography>
                        <Typography variant="h6" color="initial">
                            Salary
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box className="employee_form_dashboard_detail_box">
                        <Typography variant="h5" color="initial" sx={{ fontWeight: 600 }}>
                            0
                        </Typography>
                        <Typography variant="h6" color="initial">
                            Transfer's
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeFormDashboard;
