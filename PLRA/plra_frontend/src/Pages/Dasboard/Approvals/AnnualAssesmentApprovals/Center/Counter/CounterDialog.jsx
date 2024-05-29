import React from 'react';
import {
    useTheme,
    Typography,
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { Outlined_eye } from '../../../../../../Assets/Icons/index.jsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApprovalsByIdQuery } from '../../../../../../Features/API/SetupApi.js';
import useDateFormat from '../../../../../../hooks/useDateFormat.js';

const CounterDialog = ({ leaveData, leave_approval_id }) => {
    const leave_request_id = leave_approval_id;
    const { data: leave_id_data } = useApprovalsByIdQuery(leave_request_id);

    const formatDate = useDateFormat();
    const theme = useTheme();

//Function
const formattedDate = leave_id_data?.results?.[0]?.apply_date
? new Date(leave_id_data?.results?.[0]?.apply_date).toISOString().split('T')[0]
: '';

const formattedApplyDate = formatDate(leave_id_data?.results?.[0]?.apply_date)



    //function

    const rawDate = leaveData?.apply_date;
    const openPdfInNewTab = () => { const pdfUrl = 'path/to/your/pdf/file.pdf'; window.open(pdfUrl, '_blank'); };

    return (
        <div>
            {leave_approval_id ? (
                <Box sx={{ p: 1 }}>
                    <Grid container spacing={0} sx={{ border: '1px solid #E4E4E4', m: -0.7 }}>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave ID:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leave_id_data?.results?.[0]?.leave_request_id}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Type:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leave_id_data?.results?.[0]?.leave_type?.leave_type}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Attachment:</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center' }}>
                                    <Box sx={{
                                        fontWeight: 600,
                                        px: 2, pt: 0.4,
                                        borderRadius: "4px",
                                        backgroundColor: theme.palette.success[300],
                                        color: theme.palette.success[600],
                                        mr: 2,
                                        cursor: 'pointer'
                                    }}
                                        onClick={openPdfInNewTab}
                                    >
                                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                                    </Box>

                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Apply Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{formattedApplyDate}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Period:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leave_id_data?.results?.[0]?.from_date}<span style={{ fontWeight: 600 }}> TO</span> {leave_id_data?.results?.[0]?.to_date}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Count of Leaves:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leave_id_data?.results?.[0]?.days_count}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Reason:</Typography>
                                <Typography variant="subtitle1" color="initial" >
                                    {leave_id_data?.results?.[0]?.notes}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box>
                        <Typography variant="h6" color="initial" sx={{ mt: 2 }}>Status:</Typography>
                        {leave_id_data?.results?.[0]?.approvals.map((data, index) => (
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
                                                {data?.status}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>
                                            Approval Date: {leaveData?.approved_date}
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, pt: 1 }}>Reason:</Typography>
                                    <Typography variant="body2">  {data?.comments}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ p: 1 }}>
                    <Grid container spacing={0} sx={{ border: '1px solid #E4E4E4', m: -0.7 }}>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave ID:</Typography>
                                <Typography variant="subtitle1" color="initial" >#01120</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Type:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leaveData?.leave_type?.leave_type}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Attachment:</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center' }}>
                                    <Box sx={{
                                        fontWeight: 600,
                                        px: 2, pt: 0.4,
                                        borderRadius: "4px",
                                        backgroundColor: theme.palette.success[300],
                                        color: theme.palette.success[600],
                                        mr: 2,
                                        cursor: 'pointer'
                                    }}
                                        onClick={openPdfInNewTab}
                                    >
                                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                                    </Box>

                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Apply Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{formattedDate}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Period:</Typography>
                                <Typography variant="subtitle1" color="initial" >{new Date(leaveData?.from_date).toLocaleDateString('en-GB')}<span style={{ fontWeight: 600 }}> TO</span> {leaveData?.to_date}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Count of Leaves:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leaveData?.days_count}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px', pt: 1 }}>Leave Reason:</Typography>
                                <Typography variant="subtitle1" color="initial" >
                                    {leaveData?.notes}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box>
                        <Typography variant="h6" color="initial" sx={{ mt: 2 }}>Status:</Typography>
                        {leaveData?.approvals.map((data, index) => (
                            <Accordion key={index}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                {data?.leave_approval?.approving_authority}
                                            </Typography>
                                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                            <Typography variant="subtitle1" sx={{
                                                fontWeight: 1600,
                                                px: 2,
                                                borderRadius: "4px",
                                                backgroundColor: 
                                                    data?.status === "Approved" ? theme.palette.primary[200] :
                                                        data?.status === "Pending" ? theme.palette.warning[300] :
                                                            data?.status === "Rejected" ? theme.palette.error[300] : "black",
                                                color: 
                                                    data?.status === "Approved" ? theme.palette.primary.main :
                                                        data?.status === "Pending" ? theme.palette.warning.main :
                                                            data?.status === "Rejected" ? theme.palette.error[600] : "green"
                                            }}>
                                                {data?.status}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>
                                            Approval Date: {leaveData?.approved_date}
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Officer Name:
                                        </Typography>
                                        <Typography variant="body2"> {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name} </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Reason:</Typography>
                                    <Typography variant="body2">  {data?.comments} </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default CounterDialog;
