import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { useApprovalsQuery } from "../../../Features/API/SetupApi";
import Cookies from 'js-cookie';

const ApprovalCard = () => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null)


    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [user_id])

    const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch } = useApprovalsQuery(user_id);

    const approvalsRecord = [
        { id: 1, approval: "Leave Approval", route: "leaveapproval", count: leaveData?.count },
        { id: 2, approval: "Super Approval", route: "superapproval", count: 2 },
    ]



    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
                sx={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: theme.palette.white[800],
                    borderRadius: "6px",
                    boxShadow: "0 0 15px 2px #efefef",
                    overflow: "hidden",
                }}
            >
                {/* Header  */}
                <Box
                    sx={{ height: "30px", width: "100%", backgroundColor: theme.palette.primary.main, color: theme.palette.white[800], textAlign: "center", }} >
                    <Typography variant="h6" color="#fff" sx={{ fontWeight: 600 }}>
                        Approvals
                    </Typography>
                </Box>
                {/* Body  */}
                <Box
                    sx={{
                        height: "270px",
                        width: "100%",
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "start",
                        flexDirection: "column",
                        overflow: "scroll",
                    }}
                >
                    {approvalsRecord.map((record) => (
                        <Box
                            sx={{
                                width: "100%",
                                "&:hover": { backgroundColor: theme.palette.gray[200] },
                            }}
                            key={record.id} container spacing={0}
                        // onClick={() => handleRowClick(record)}
                        >
                            <Link
                                to={`approval/${record.route}`}
                                style={{ width: "100%", padding: 6, borderBottom: `1px solid ${theme.palette.gray[400]}`, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", }} >
                                <Typography variant="body1" color="#000">
                                    {record.approval}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ width: "20px", height: "20px", bgcolor: "green", textAlign: "center", borderRadius: "50%", color: "#fff", }} >
                                    {record.count}
                                </Typography>
                            </Link>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default ApprovalCard;
