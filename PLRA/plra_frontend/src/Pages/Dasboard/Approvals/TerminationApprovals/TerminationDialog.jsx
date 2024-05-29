import React, { useEffect, useState } from "react";
import {
    useTheme,
    Typography,
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import Cookies from "js-cookie";

import { Outlined_eye } from "../../../../Assets/Icons/index.jsx";
import { useGetTerminationApprovalQuery } from "../../../../Features/API/Termination.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Btn } from "../../../../Components/index.js";

const TerminationDialog = ({ DialogData }) => {
    const theme = useTheme();
    const data = DialogData;
    const terminationId = data?.id;
    const [user_id, set_user_id] = useState(null)

    const { data: approvalData } = useGetTerminationApprovalQuery(terminationId);

    console.log(approvalData);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
      }, [user_id]);

    //function
    const openInNewTab = (path) => {
        if (!path) {
            toast.error("No Attachment", {
                position: 'top-center',
                autoClose: 3000,
            })
        }
        else {
            window.open(path, "_blank");
        }

    };
    return ( 
        <div>
 
            {DialogData?.status === "Closed" && DialogData?.approvals[1]?.approving_authority_designation === "HR DIRECTOR"  &&(
                <Link to={`/terminationreport/${DialogData.id}`} style={{ float: 'right', marginBottom: '10px' }} >
                    <Btn type="Generate Report" />
                </Link>
            )}

            <Box sx={{ p: 1 }}>
                <Grid
                    container
                    spacing={0}
                    sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
                >
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "110px" }}
                            >
                                ID:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {terminationId}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "110px" }}
                            >
                                Employee Name:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.first_name} {data?.last_name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "100px" }}
                            >
                                Attachment:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box
                                    sx={{
                                        fontWeight: 600,
                                        px: 2,
                                        pt: 0.4,
                                        borderRadius: "4px",
                                        backgroundColor: theme.palette.success[300],
                                        color: theme.palette.success[600],
                                        cursor: "pointer",
                                    }}
                                >
                                    <div onClick={() => openInNewTab(data?.attachment)}>

                                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                                    </div>

                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "100px" }}
                            >
                                Initiate Date:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.case_initiation_date}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "100px" }}
                            >
                                Notice Period:
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                            >{`${data?.notice_period} Months`}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "60px" }}
                            >
                                Status:
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                sx={{
                                    fontWeight: 600,
                                    px: 2,
                                    borderRadius: "4px",
                                    backgroundColor:
                                        data.status === "In process"
                                            ? theme.palette.primary[200]
                                            : data.status === "Pending"
                                                ? theme.palette.warning[300]
                                                : data.status === "Closed"
                                                    ? theme.palette.error[300]
                                                    : "black",
                                    color:
                                        data.status === "In process"
                                            ? theme.palette.primary.main
                                            : data.status === "Pending"
                                                ? theme.palette.warning.main
                                                : data.status === "Closed"
                                                    ? theme.palette.error[600]
                                                    : "black",
                                }}
                            >
                                {data?.status}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "200px", pt: 1 }}
                            >
                                Reason:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.termination_reason}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box>
                    <Typography variant="h6" color="initial" sx={{ my: 2 }}>
                        Approvals Status:
                    </Typography>
                    {data?.approvals.map((data, index) => (
                        <Accordion key={index}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index + 1}-content`}
                                id={`panel${index + 1}-header`}
                            >
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            color="initial"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            {data?.approving_authority_designation}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            color="initial"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            |
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                px: 2,
                                                borderRadius: "4px",
                                                backgroundColor:
                                                    data.status === "Approved"
                                                        ? theme.palette.primary[200]
                                                        : data.status === "Pending"
                                                            ? theme.palette.warning[300]
                                                            : data.status === "Rejected"
                                                                ? theme.palette.error[300]
                                                                : "black",
                                                color:
                                                    data.status === "Approved"
                                                        ? theme.palette.primary.main
                                                        : data.status === "Pending"
                                                            ? theme.palette.warning.main
                                                            : data.status === "Rejected"
                                                                ? theme.palette.error[600]
                                                                : "black",
                                            }}
                                        >
                                            {data?.status}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "50%",
                                            display: "flex",
                                            justifyContent: "end",
                                            mr: 2,
                                        }}
                                    >
                                        Approval Date: &nbsp; <b>{data?.status_date || ""} </b>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={0}>
                                    <Grid
                                        item
                                        xs={3}
                                        sx={{
                                            border: "1px solid #E4E4E4",
                                            p: 1,
                                            borderBottom: "none",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                color="initial"
                                                fontWeight={600}
                                                sx={{ width: "150px" }}
                                            >
                                                Officer Name:
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={9}
                                        sx={{
                                            border: "1px solid #E4E4E4",
                                            p: 1,
                                            borderBottom: "none",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <Typography variant="subtitle1" color="initial">
                                                {" "}
                                                {data?.approving_authority?.first_name +
                                                    " " +
                                                    data?.approving_authority?.last_name}{" "}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {data?.approving_authority_designation === "HR USER" && (
                                    <Grid container spacing={0}>
                                        <Grid
                                            item
                                            xs={3}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                                borderBottom: "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                {" "}
                                                <Typography
                                                    variant="subtitle1"
                                                    color="initial"
                                                    fontWeight={600}
                                                    sx={{ width: "200px" }}
                                                >
                                                    effective date:
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={9}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                                borderBottom: "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography variant="subtitle1" color="initial">
                                                    {" "}
                                                    {data?.termination_effective_date}{" "}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                                {data?.approving_authority_designation === "HR DIRECTOR" && (
                                    <Grid container spacing={0}>
                                        <Grid
                                            item
                                            xs={3}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                                borderBottom: "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                {" "}
                                                <Typography
                                                    variant="subtitle1"
                                                    color="initial"
                                                    fontWeight={600}
                                                    sx={{ width: "200px" }}
                                                >
                                                    Effective date:
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={9}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                                borderBottom: "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography variant="subtitle1" color="initial">
                                                    {" "}
                                                    {data?.resignation_effective_date}{" "}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}


                                <Grid container spacing={0}>
                                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                color="initial"
                                                fontWeight={600}
                                                sx={{ width: "150px" }}
                                            >
                                                Comments:
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "start",
                                            }}
                                        >
                                            <Typography variant="subtitle1" color="initial">
                                                {" "}
                                                {data?.comments}{" "}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </div>
    );
};

export default TerminationDialog;
