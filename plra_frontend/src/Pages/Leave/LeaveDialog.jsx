import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Outlined_eye } from '../../Assets/Icons/index.jsx';
import { useWithdrawleaveMutation } from '../../Features/API/LeavesAPI.js';
import useDateFormat from '../../hooks/useDateFormat.js';




const LeaveDialog = ({ DialogData, closeDialog  }) => {
    const theme = useTheme();
    const formatDate = useDateFormat();

    const [withdrawleaveupdate] = useWithdrawleaveMutation();
    const [dialogOpen, setDialogOpen] = useState(true);


    const getStatusStyle = (status, theme) => {
        let backgroundColor, color;
        
        switch (status) {
            case "Approved":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Proved":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Closed":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to Competent Authority":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to DG":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to Director HR":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Pending":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "In process":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "In Process":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "Rejected":
                backgroundColor = theme.palette.error[300];
                color = theme.palette.error[600];
                break;
            case "Withdraw":
                backgroundColor = theme.palette.error[300];
                color = theme.palette.error[600];
                break;
            case "Unproved":
                backgroundColor = theme.palette.error[300];
                color = theme.palette.error[600];
                break;
            default:
                backgroundColor = "black";
                color = "black";
        }

        return { backgroundColor, color };
    };
    const status = DialogData?.status;
    const { backgroundColor, color } = getStatusStyle(status, theme);
    console.log("DialogData",DialogData);

    const withdrawleave = async () => {
        const formData = {
            status: "Withdraw",
            from_date: DialogData?.from_date,
            notes: DialogData?.notes,
            employee:DialogData?.employee,
            leave_type:DialogData?.leave_type?.leave_id,
            to_date: DialogData?.to_date
        }
        try {
            const res = await withdrawleaveupdate({ formData, id: DialogData?.leave_request_id });
            closeDialog(); 
            // if (res?.data?.id) {
            //     toast.success("Leave WithDraw Successfully", { position: "top-center", autoClose: 1000, });
            // }
        } catch (error) {
            toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
        }
        setDialogOpen(false);
    }

    //function
    const formattedDate = DialogData?.apply_date
        ? new Date(DialogData?.apply_date).toISOString().split('T')[0]
        : '';
    const openPdfInNewTab = (path) => {
        if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
        else window.open(path, "_blank");
    };


    const formattedFromDate = formatDate(DialogData?.from_date);
    const formattedToDate = formatDate(DialogData?.to_date);


    return (
        <div>
            {dialogOpen && (
                <>
                    {DialogData?.status === "In Process" && (
                        <Button sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2,ml:0.3 }} onClick={() => withdrawleave()}>WithDraw</Button>
                    )}
                    <Box sx={{ p: 1 }}> 
                        <Grid container spacing={2} sx={{ border: '1px solid #E4E4E4', m: -0.7, }}>
                            <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave ID:</Typography>
                                    <Typography variant="subtitle1" color="initial" >{DialogData?.leave_request_id}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Type:</Typography>
                                    <Typography variant="subtitle1" color="initial" >{DialogData?.leave_type?.leave_type}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                        Attachment:
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 0, cursor: "pointer", }}>
                                            <div onClick={() => { openPdfInNewTab(DialogData?.attachment); }}>
                                                <Outlined_eye color={`${theme.palette.success[600]}`} />
                                            </div>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Apply Date:</Typography>
                                    <Typography variant="subtitle1" color="initial" >{formattedDate}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Period:</Typography>
                                    <Typography variant="subtitle1" color="initial" >{formattedFromDate}<span style={{ fontWeight: 600 }}> TO</span> {formattedToDate}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Count of Leaves:</Typography>
                                    <Typography variant="subtitle1" color="initial" >{DialogData?.days_count}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                        Status:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                                        {DialogData?.status}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Reason:</Typography>
                                    <Typography variant="subtitle1" color="initial" >
                                        {DialogData?.notes}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box>
                            <Typography variant="h6" color="initial" sx={{ my: 2 }}>Approvals:</Typography>
                            {DialogData?.approvals.map((data, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                    {data?.leave_approval?.approving_authority}
                                                </Typography>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                                <Typography variant="subtitle1" sx={{
                                                    fontWeight: 600,
                                                    px: 2,
                                                    borderRadius: "4px",
                                                    backgroundColor:
                                                        data.status === "Approved" ? theme.palette.primary[200] :
                                                            data.status === "Pending" ? theme.palette.warning[300] :
                                                                data.status === "Rejected" ? theme.palette.error[300] : "black",
                                                    color:
                                                        data.status === "Approved" ? theme.palette.primary.main :
                                                            data.status === "Pending" ? theme.palette.warning.main :
                                                                data.status === "Rejected" ? theme.palette.error[600] :
                                                                    "black"
                                                }}>
                                                    {DialogData?.status === "Withdraw" ? "Withdrawn" : data?.status}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>
                                                Approval Date: {DialogData?.status_date}
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={0}>
                                            <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                        Officer Name:
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 1 }}>Reason:</Typography>
                                        <Typography variant="body2">  {data?.comments}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                        <Box>
                            <Typography variant="h6" color="initial" sx={{ mt: 2, mb:1 }}>Alternate Approval:</Typography>
                            {DialogData?.superapprovals.map((data, index) => (
                                <Accordion key={index} sx={{ width:"101.3%" }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`} >
                                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                    {data?.designation}
                                                </Typography>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                                <Typography variant="subtitle1" sx={{
                                                    fontWeight: 600,
                                                    px: 2,
                                                    borderRadius: "4px",
                                                    backgroundColor:
                                                        data.status === "Approved" ? theme.palette.primary[200] :
                                                            data.status === "Pending" ? theme.palette.warning[300] :
                                                                data.status === "Rejected" ? theme.palette.error[300] : "black",
                                                    color:
                                                        data.status === "Approved" ? theme.palette.primary.main :
                                                            data.status === "Pending" ? theme.palette.warning.main :
                                                                data.status === "Rejected" ? theme.palette.error[600] :
                                                                    "black"
                                                }}>
                                                    {DialogData?.status === "Withdraw" ? "Withdrawn" : data?.status}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>Approval Date: {DialogData?.status_date}</Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={0} sx={{ mb:1 }}>
                                            <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>Officer Name:</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                    <Typography variant="subtitle1" color="initial"> {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 1 }}>Reason:</Typography>
                                        <Typography variant="body2">  {data?.comments}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Box>
                </>
            )}
        </div>
    );
};

export default LeaveDialog;
