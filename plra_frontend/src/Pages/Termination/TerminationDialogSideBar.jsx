import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Typography,
    useTheme,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import { Outlined_eye } from "../../Assets/Icons/index.jsx";
import { useGetTerminationApprovalQuery } from "../../Features/API/Termination.js";
import { approvalcellStyle } from "../../Utils/cellstyle.js";
import useDateFormat from "../../hooks/useDateFormat.js";
import { Link } from "react-router-dom";



const TerminationDialogSideBar = ({ DialogData }) => {
    const theme = useTheme();
    const data = DialogData;
    const terminationId = data?.id;
    const formatDate = useDateFormat();
    const { data: approvalData } = useGetTerminationApprovalQuery(terminationId);
    console.log(data);


    const formattedDate = data?.case_initiation_date
        ? new Date(data?.case_initiation_date).toISOString().split('T')[0]
        : '';

    const formattedApplyDate = formatDate(data?.case_initiation_date)


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
            {DialogData?.status === "Closed" && DialogData?.approvals[1]?.status === "HR DIRECTOR" && (
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
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "110px" }}
                            >
                                Employee Name:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.employee?.first_name.charAt(0).toUpperCase()}{data?.employee?.first_name.slice(1).toLowerCase()} {data?.employee?.last_name.charAt(0).toUpperCase()}{data?.employee?.last_name.slice(1).toLowerCase()}
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
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography
                                variant="subtitle1"
                                color="initial"
                                fontWeight={600}
                                sx={{ width: "100px" }}
                            >
                                Initiation Date:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.case_initiation_date}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                            >{data?.notice_period} {data?.notice_period > 1 ? "Months" : "Month"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                                        approvalcellStyle(data?.status, theme),
                                    color:
                                        approvalcellStyle(data?.status, theme)
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
                                Termination Category:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {data?.termination_category}
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
                                                    approvalcellStyle(data?.status, theme),
                                                color:
                                                    approvalcellStyle(data?.status, theme)
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
                                    <Grid  item  xs={3}  sx={{    border: "1px solid #E4E4E4",    p: 1,  borderBottom: "none",  }}  >
                                        <Box   sx={{   display: "flex",  alignItems: "center",  justifyContent: "start",  }}   >
                                            <Typography  variant="subtitle1"  color="initial"  fontWeight={600} sx={{ width: "150px" }}  >
                                                Officer Name:
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid   item  xs={9}  sx={{  border: "1px solid #E4E4E4",  p: 1,  borderBottom: "none",  }} >
                                        <Box  sx={{   display: "flex",   alignItems: "center", justifyContent: "start",   }}  >
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
                                                    Effective Date:
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
                                                    Effective Date:
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

export default TerminationDialogSideBar;
