import React, { useState } from "react";
import { GoBack } from "../../../../Assets/Icons/index.jsx";
import { Breadcrumb } from "../../../../Components/index.js";
import { Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import EmployeeMinidashboard from "../../../../Components/shared/EmployeeMinidashboard.jsx";

import SuperApprovalsDetails from "./SuperApprovalsDetails.jsx";
import MiniDashboardLeaveDetail from "../LeaveApprovals/MiniDashboardLeaveDetail.jsx";

const SuperDetail = () => {
    const theme = useTheme();
    const [selectedLabel, setSelectedLabel] = useState(null);
    const navigate = useNavigate();

    const handleCasualClick = (label) => {
        setSelectedLabel(label);
        console.log(`Casual mini card clicked with label: ${label}`);
    };

    return (
        <div>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                    sx={{
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "rotate(180deg)",
                        cursor: "pointer",
                        m: 1,
                        borderRadius: "6px",
                        backgroundColor: `${theme.palette.white[800]}`,
                        boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,
                    }}
                    onClick={() => window.history.go(-1)}
                >
                    <GoBack />
                </Box>
                <Breadcrumb
                    title="Super Approvals"
                    breadcrumbItem="Approvals / Super Approvals"
                />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={9}>
                    <Box
                        sx={{
                            border: `1px solid ${theme.palette.gray[100]}`,
                            p: 0.5,
                            borderRadius: "4px",
                            height: "calc(100vh - 200px)",
                            maxWidth: "100%",
                            overflow: "scroll",
                        }}
                    >
                        {selectedLabel === "Casual Leave" || selectedLabel === "Medical" ? (
                            <Box>
                                <MiniDashboardLeaveDetail
                                    fillter={`${selectedLabel}`}
                                    onCasualClick={handleCasualClick}
                                />
                            </Box>
                        ) : (
                            <SuperApprovalsDetails />
                        )}
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Box
                        sx={{
                            border: `1px solid ${theme.palette.gray[100]}`,
                            p: 0.5,
                            borderRadius: "4px",
                            height: "calc(100vh - 200px)",
                            maxWidth: "100%",
                            overflow: "scroll",
                        }}
                    >
                        <EmployeeMinidashboard onCasualClick={handleCasualClick} />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default SuperDetail;
