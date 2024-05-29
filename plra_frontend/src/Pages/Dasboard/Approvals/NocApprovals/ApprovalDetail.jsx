import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { Download, Outlined_eye, Warning } from '../../../../Assets/Icons/index.jsx';
import { useApprovalsByIdQuery, useApprovalsPutMutation } from '../../../../Features/API/SetupApi.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import { Loader, ErrorHandler } from '../../../../Components/index.js';
import { showToast } from '../../../../Components/shared/Toast_Card.jsx';


const ApprovalDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id, leave_request_id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [dataOject, setDataObject] = useState({})
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null)

    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [user_id])

    const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch } = useApprovalsByIdQuery(leave_request_id);
    console.log("approve data", leaveData);
    const [ApprovalsPut] = useApprovalsPutMutation();

    const openPdfInNewTab = () => { const pdfUrl = 'path/to/your/pdf/file.pdf'; window.open(pdfUrl, '_blank'); };
    const handleNotesChange = (event) => setReason(event.target.value);
    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const handleButtonClick = (action, data) => {
        setDataObject(data);
        setActionPerformed(action);
        setReasonDialogOpen(true);
    };


    const formattedDate = leaveData?.results[0]?.apply_date
        ? new Date(leaveData.results[0].apply_date).toISOString().split('T')[0]
        : '';


    const handleSubmit = async () => {
        const formData = {
            comments: reason,
            status: actionPerformed,
            order: dataOject?.order,
            leave: dataOject?.leave,
            approving_authority: dataOject?.approving_authority?.id,
            leave_approval: dataOject?.leave_approval?.id,
        }

        const res = await ApprovalsPut({ formData, id })
        try {
            const res = await ApprovalsPut({ formData, id });
            if (res?.data?.id) {
                if (res?.error?.status === 422 && res?.error?.data?.code) {
                    return (showToast(`${res?.error?.data?.detail}`, "error"));
                }
                if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                    return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                }
                navigate('/approval/leaveapproval');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setReasonDialogOpen(false)
    }




    return (
        <Box sx={{}}>
            {leaveLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Loader />
                </Box>
            ) : leaveRefreshError ? (
                <ErrorHandler online={navigator.onLine} />
            ) : (
                <Box sx={{ pl: 0.7, pt: 0.7 }}>
                    <Grid container spacing={0} sx={{ width: "100%", border: '1px solid #E4E4E4', }}>
                        <Grid item xs={6} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>NOC ID:</Typography>
                                <Typography variant="subtitle1" color="initial" >#00{leave_request_id}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>NOC Type:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.leave_type?.leave_type}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>Apply Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{formattedDate}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>Status:</Typography>
                                <Typography variant="subtitle1" color="initial" >Approved</Typography>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Effective Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.from_date} <span style={{ fontWeight: 600 }}>TO</span> {leaveData?.results[0]?.to_date}</Typography>
                            </Box>
                        </Grid> */}
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Reason:</Typography>
                                <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.notes} </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}


            <Box sx={{ m: 0.7 }}>
                <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 0.6 }}>Approvals Status:</Typography>

                {leaveData?.results[0]?.approvals.map((data, index) => (
                    data?.approving_authority?.id !== user_id && (
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
                                                        data.status === "Rejected" ? theme.palette.error[300] :
                                                            "black",
                                            color:
                                                data.status === "Approved" ? theme.palette.primary.main :
                                                    data.status === "Pending" ? theme.palette.warning.main :
                                                        data.status === "Rejected" ? theme.palette.error[600] :
                                                            "black"
                                        }}>
                                            {data.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{data?.approving_authority?.first_name} {data?.approving_authority?.last_name}</Typography>
                                {/* <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Reason:</Typography> */}
                                {/* <Typography variant="body2"> {data?.comments} </Typography> */}

                                {data?.approving_authority?.id == user_id && (
                                    <>
                                        <Box sx={{ display: "flex", alignItems: 'start', p: 1, mt: 3 }}>
                                            <Typography variant="body2" color="initial" sx={{ width: '100px' }}>Notes: </Typography>
                                            <textarea
                                                rows={8}
                                                onChange={handleNotesChange}
                                                style={{
                                                    resize: "none",
                                                    width: "100%",
                                                    border: "1px solid black",
                                                    padding: "10px",
                                                    borderRadius: "6px",
                                                }}
                                                placeholder="Write the job description..."
                                            />
                                        </Box>
                                        <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                                            <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                                                onClick={() => handleButtonClick("Approved", data)}>Accept</Button>
                                            <Button sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2 }}
                                                onClick={() => handleButtonClick("Rejected", data)}>Reject</Button>
                                        </Box>
                                    </>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    )
                ))}

            </Box>


            {/* Dialog  */}
            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}  >
                <Box sx={{ width: '600px' }}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', ml: -2 }}>
                        {reason.trim() ? (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Warning color={`${theme.palette.warning[600]}`} />Are you sure you want to {actionPerformed} leave on the based of given reason?
                            </Box>
                        ) :
                            (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Warning color={`${theme.palette.warning[600]}`} />{actionPerformed} without reason.
                                </Box>
                            )}
                    </DialogTitle>
                    <DialogContent>
                        {reason.trim() ? (
                            <Box sx={{ maxHeight: "400px", overflow: 'scroll' }}>
                                <Typography variant="subtitle1" color="initial" sx={{ px: 4 }}>
                                    {reason}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="initial" ml={2}>
                                Are you sure {actionPerformed} application without povide any reason.
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ mt: 4 }}>
                        <Button onClick={handleSubmit} sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2 }}>Cancel</Button>
                        <Button onClick={handleSubmit} sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}>Submit</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    )
}

export default ApprovalDetail
