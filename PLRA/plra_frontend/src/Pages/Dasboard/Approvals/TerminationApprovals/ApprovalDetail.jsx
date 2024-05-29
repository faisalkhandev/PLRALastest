import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { Download, Outlined_eye, Warning } from '../../../../Assets/Icons/index.jsx';
import { useApprovalsPutMutation } from '../../../../Features/API/SetupApi.js';
import { useGetTerminationApprovalQuery, useApprovalsPutTerminationMutation } from '../../../../Features/API/Termination.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import { Loader, ErrorHandler, InputField } from '../../../../Components/index.js';
import { toast } from 'react-toastify';
import { showToast } from '../../../../Components/shared/Toast_Card.jsx';
import { approvalcellStyle } from '../../../../Utils/cellstyle.js';


const ApprovalDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id, approvalID } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [dataOject, setDataObject] = useState({})
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null)
    const [dateData, setdateData] = useState({
        form_date: '',
    })

    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [user_id])

    const { data: approvalData, isLoading: approvalLoading, isError: approvalRefreshError, error: approvalQueryError, refetch } = useGetTerminationApprovalQuery(approvalID);
    const [ApprovalsPut] = useApprovalsPutTerminationMutation();

    const openPdfInNewTab = (path) => {
        if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
        else window.open(path, "_blank");
    };
    const handleNotesChange = (event) => setReason(event.target.value);
    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const handleButtonClick = (action, data) => {
        setDataObject(data);
        setActionPerformed(action);
        setReasonDialogOpen(true);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "from_date") {
            const currentDate = new Date();
            const selectedDate = new Date(value);

            // Set hours, minutes, seconds, and milliseconds to 0 for both dates
            currentDate.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < currentDate) {
                toast.error("Please select the current date or a future date.", {
                    position: "top-center",
                    autoClose: 3000,
                });
                return;
            }
        }
        setdateData((prevData) => ({ ...prevData, [name]: value }));
    };

    const status = approvalData?.results[0]?.status;
    const { backgroundColor, color } = approvalcellStyle(status, theme);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {

        let date;
        if (dataOject?.approving_authority_designation === "HR DIRECTOR") {
            date = dateData.form_date;
            if (!date) {
                toast.error("Please select an effective date.", {
                    position: "top-center",
                    autoClose: 3000,
                });
                setReasonDialogOpen(false)
                return;
            }
        } else {
            date = null;
        }

        const formData = {
            comments: reason,
            status: actionPerformed,
            approving_authority_designation: dataOject?.approving_authority_designation,
            order: dataOject?.order,
            termination_effective_date: date,
            approving_authority: dataOject?.approving_authority?.id,
            termination_request: dataOject?.termination_request,
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
                navigate('/approval/terminationapproval');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setReasonDialogOpen(false)
    }





    return (
        <Box sx={{}}>
            {approvalLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Loader />
                </Box>
            ) : approvalRefreshError ? (
                <ErrorHandler online={navigator.onLine} />
            ) : (
                <Box sx={{ pl: 0.7, pt: 0.7 }}>
                    <Grid container spacing={0} sx={{ width: "100%", border: '1px solid #E4E4E4', }}>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>ID:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalID}</Typography>
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
                                    {approvalData?.results[0]?.employee?.first_name.charAt(0).toUpperCase()}{approvalData?.results[0]?.employee?.first_name.slice(1).toLowerCase()} {approvalData?.results[0]?.employee?.last_name.charAt(0).toUpperCase()}{approvalData?.results[0]?.employee?.last_name.slice(1).toLowerCase()}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                    Attachment:
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: "pointer", }}>
                                        <div onClick={() => { openPdfInNewTab(approvalData?.results[0]?.attachment); }}>
                                            <Outlined_eye color={`${theme.palette.success[600]}`} />
                                        </div>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.case_initiation_date}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Notice Period:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.notice_period} {approvalData?.results[0]?.notice_period > 1 ? "Months" : "Month"}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Status:</Typography>
                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color, width: "100px" }}>{approvalData?.results[0]?.status} </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Termintaion Category:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.termination_category} </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Reason:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.termination_reason} </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                </Box>
            )
            }


            <Box sx={{ m: 0.7 }}>
                <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 0.6 }}>Approvals Status:</Typography>

                {approvalData?.results[0]?.approvals.map((data, index) => (
                    data?.approving_authority?.id !== user_id && (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                            {data?.approving_authority_designation}
                                        </Typography>
                                        <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 600,
                                            px: 2,
                                            borderRadius: "4px",
                                            backgroundColor:
                                                approvalcellStyle(data?.status, theme),
                                            color:
                                                approvalcellStyle(data?.status, theme)
                                        }}>
                                            {data.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={0}>
                                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                Officer Name:
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                            <Typography variant="subtitle1" color="initial">
                                                {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {data?.approving_authority_designation === "HR DIRECTOR" && data?.status === "Approved" && (
                                    <Grid container spacing={0}>
                                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                    Effective Date:
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                <Typography variant="subtitle1" color="initial">
                                                    {data?.termination_effective_date}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                                {/* <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Reason:</Typography> */}
                                {data?.approving_authority?.id ==
                                    user_id && data?.approving_authority_designation === "HR DIRECTOR" && data?.status === "Pending" && (
                                        <Box sx={{ width: '350px', p: 1 }}>

                                            <InputField
                                                name="form_date"
                                                type="date"
                                                label="Effective Date"
                                                onChange={handleChange}
                                                value={dateData?.form_date}
                                                min={getCurrentDate}
                                                mandatory
                                            />
                                        </Box>
                                    )
                                }

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
                                        {data?.approving_authority_designation === "DG" ?
                                            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                                                <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                                                    onClick={() => handleButtonClick("Approved", data)}>Approve</Button>
                                            </Box> :
                                            <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                                                <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                                                    onClick={() => handleButtonClick("Approved", data)}>Forward</Button>
                                            </Box>}

                                    </>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    )
                ))}

            </Box>


            {/* Dialog  */}
            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                <Box sx={{ width: "350px" }}>
                    <DialogContent>
                        <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
                            <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {approvalData?.results[0]?.approvals[3]?.approving_authority_designation==="DG"?"Approve":"Forward"}?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ mt: 4 }}>
                        <Button onClick={handleSubmit} sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }}>
                            Submit
                        </Button>
                        <Button onClick={() => setReasonDialogOpen(false)} sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2, }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box >
    )
}

export default ApprovalDetail
