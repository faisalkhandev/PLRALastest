import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GoBack, Warning } from "../../../../Assets/Icons/index.jsx";
import { Breadcrumb, ErrorHandler, InputField, Loader } from "../../../../Components/index.js";
import { useGetdocumentbyidQuery, usePostEmployeeApprovalDateMutation, usePostEmployeeStatusMutation } from "../../../../Features/API/ProgressionApi.js";
import EmployeeFormDashboard from "../../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx";
import { approvalcellStyle } from "../../../../Utils/cellstyle.js";

const ApprovalDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [actionPerformed, setActionPerformed] = useState("");
    const [user_id, set_user_id] = useState(null);
    const [formData, setFormData] = useState({
        from_date: '',
    });

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    const { data: ProgressionData, isLoading: Progressionloading, isError: ProgressionrefreshError, refetch, } = useGetdocumentbyidQuery(id);

    console.log(ProgressionData);

    const [approvaldate] = usePostEmployeeApprovalDateMutation();
    const [approvalstatus] = usePostEmployeeStatusMutation();
    useEffect(() => { refetch(); }, [refetch]);
    const status = ProgressionData?.[0]?.status;
    const { backgroundColor, color } = approvalcellStyle(status, theme);

    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
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
                toast.error("You cannot select previous date", { position: "top-center", autoClose: 3000, });
                return;
            }
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.from_date && actionPerformed === 'Approved') {
            toast.error(`Please fill in the Approval Date`, { position: "top-center", autoClose: 3000 });
            return;
        }

        try {
            if (actionPerformed === 'Approved') {
                const approvalDateResponse = await approvaldate({
                    id: ProgressionData?.[0]?.id,
                    approval_date: formData.from_date,
                });
                console.log("response", approvalDateResponse);

                const approvalStatusResponse = await approvalstatus({
                    id: ProgressionData?.[0]?.id,
                    status: "Approved"
                });

              

                if (approvalDateResponse.data === 200 && approvalStatusResponse.data === 200) {
                    toast.success("Approval successful", { position: "top-center", autoClose: 3000 });
                    setTimeout(() => { navigate("/approval/ProgressionProcess"); }, 3000);
                } else {
                    toast.error("Failed to approve", { position: "top-center", autoClose: 3000 });
                }
            } else if (actionPerformed === "Reject") {
                const rejectionResponse = await approvalstatus({
                    id: ProgressionData?.[0]?.id,
                    status: "Reject"
                });
                console.log("response", rejectionResponse);

                if (rejectionResponse.data === 200) {
                    toast.success("Rejection successful", { position: "top-center", autoClose: 3000 });
                    setTimeout(() => { navigate("/approval/ProgressionProcess"); }, 3000);
                } else {
                    toast.error("Failed to reject", { position: "top-center", autoClose: 3000 });
                }
            }
        } catch (error) {
            toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000 });
        }

        setReasonDialogOpen(false);
    };


    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Box sx={{ width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}` }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                <Breadcrumb title="Elevation Approvals" breadcrumbItem="Approvals / Elevation Approvals" />
            </Box>

            <Grid container spacing={3} >
                <Grid item xs={9}>
                    <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll' }}>
                        <Box sx={{}}>
                            {Progressionloading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
                                <Loader />
                            </Box>
                                : ProgressionrefreshError ? <ErrorHandler online={navigator.onLine} /> :
                                    <Box sx={{ pl: 0.7, pt: 0.7 }}>
                                        <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        ID:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        #00{id}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "160px" }}>
                                                        Employee No:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" sx={{ width: "10px" }}>
                                                        {ProgressionData?.[0]?.employee?.id}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "50px" }}>
                                                        Name:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.first_name.charAt(0).toUpperCase()}{ProgressionData?.[0]?.employee?.first_name.slice(1).toLowerCase()} {ProgressionData?.[0]?.employee?.last_name.charAt(0).toUpperCase()}{ProgressionData?.[0]?.employee?.last_name.slice(1).toLowerCase()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "160px" }}>
                                                        Job Title:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.job?.job_title}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Center Name:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.location?.center_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        District:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.location?.district?.district_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Division:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.location?.division?.division_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Tehsil:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.location?.tehsil?.t_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "95px" }}>
                                                        Promoted Job:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" sx={{textAlign:"right"}}>
                                                        {ProgressionData?.[0]?.promote_job?.job_title}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        PPG Level:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.employee?.position?.job?.ppg_level?.ppg_level}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                        Promoted PPG Level:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.[0]?.promote_ppg_level?.ppg_level}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Pending Inquiry:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData?.[0].pending_inquiry ? "green" : 'red' }}>
                                                        {ProgressionData?.[0].pending_inquiry ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Major Penalities:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData?.[0].major_penalities ? "green" : 'red' }}>
                                                        {ProgressionData?.[0].major_penalities ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Vacant Post:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData?.[0].post_vacant ? "green" : 'red' }}>
                                                        {ProgressionData?.[0].post_vacant ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Status:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                                                        {ProgressionData?.[0]?.status}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                            }

                            <Box sx={{ my: 0.7 }}>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                            <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2, }}>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                    Approval
                                                </Typography>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                    |
                                                </Typography>
                                                
                                            </Box>
                                      
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                   
                                        <Box sx={{ width: '100%', display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 2 }}>
                                            <InputField labelWidth="330px" name="from_date" type="date" label="Approval Date" onChange={handleChange} value={formData?.from_date} min={getCurrentDate} />
                                        </Box>
                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                                            {formData.from_date ? (
                                                <Button
                                                    sx={{
                                                        backgroundColor: theme.palette.success[300],
                                                        color: theme.palette.success[600],
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        p: 2,
                                                    }}
                                                    onClick={() => { setActionPerformed("Approved"); setReasonDialogOpen(true) }}
                                                >
                                                    Accept
                                                </Button>
                                            ) : (
                                                <Button
                                                    sx={{
                                                        backgroundColor: theme.palette.error[300],
                                                        color: theme.palette.error[600],
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        p: 2,
                                                    }}
                                                    onClick={() => { setActionPerformed("Reject"); setReasonDialogOpen(true) }}
                                                >
                                                    Reject
                                                </Button>
                                            )}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            {/* Dialog  */}
                            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                                <Box sx={{ width: "350px" }}>
                                    <DialogContent>
                                        <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
                                            <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {actionPerformed === "Reject" ? "Reject" : "Accept"}?
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
                        </Box>
                    </Box>

                </Grid>
                <Grid item xs={3}>
                    <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, p: 0.5, borderRadius: '4px', height: 'calc(100vh - 200px)', maxWidth: '100%', overflow: 'scroll' }}>
                        <EmployeeFormDashboard userId={ProgressionData?.[0]?.employee?.id} title="Processess" height="calc(100vh - 70px)"
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default ApprovalDetail;