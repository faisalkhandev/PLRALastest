import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Outlined_eye, Warning } from '../../../../Assets/Icons/index.jsx';
import { useApprovalsByIdQuery, useApprovalsPutMutation, useGetAllEmployeeByCenterIDQuery } from '../../../../Features/API/SetupApi.js';
import { Multi_Dropdown, InputField } from '../../../../Components/index.js'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { showToast } from '../../../../Components/shared/Toast_Card.jsx';
import useDateFormat from '../../../../hooks/useDateFormat.js';
import { useSelector } from 'react-redux';



const SuperApprovalsDetail = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const { id, leave_request_id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [EmployeeName, setEmployeeName] = useState("");
    const [employee_id, set_employee_id] = useState(null)
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [dataOject, setDataObject] = useState({})
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null);
    const formatDate = useDateFormat();


    const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch: approvalRefresh } = useApprovalsByIdQuery(leave_request_id);

    const [newFormData, setNewFormData] = useState({
        start_date: leaveData?.results[0]?.from_date,
        end_date: leaveData?.results[0]?.to_date,
    });

    useEffect(() => {
        if (leaveData && leaveData.results && leaveData.results[0]) {
            const { from_date, to_date } = leaveData.results[0];
            setNewFormData({
                start_date: from_date || '',
                end_date: to_date || '',
            });
        }
    }, [leaveData]);

    const CenterID = leaveData?.results[0]?.employee?.center?.c_rec_id;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewFormData({
            ...newFormData,
            [name]: value,
        });
    };


    const formattedDate = leaveData?.results[0]?.apply_date
        ? new Date(leaveData.results[0].apply_date).toISOString().split('T')[0]
        : '';

    const formattedStartDate = formatDate(leaveData?.results[0]?.from_date)
    const formattedEndDate = formatDate(leaveData?.results[0]?.to_date)


    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [user_id])

    const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeByCenterIDQuery(CenterID);
    const [ApprovalsPut] = useApprovalsPutMutation();

    const openInNewTab = (path) => {
        if (!path) {
            toast.error("No Attachments", {
                position: 'top-center',
                autoClose: 2000
            })
        }
        else {
            window.open(path, '_blank');
        }
    };
    const handleNotesChange = (event) => setReason(event.target.value);
    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const handleButtonClick = (action, data) => {
        setDataObject(data);
        setActionPerformed(action);
        setReasonDialogOpen(true);
    };


    const handleSubmit = async () => {
        const formData = {
            // Assuming these commented fields are intentionally left out for brevity:
            // comments: reason,
            // status: actionPerformed,
            additional_position_assignment: employee_id,
            leave: dataOject?.leave,
            approving_authority: dataOject?.approving_authority?.id,
            start_date: newFormData?.start_date,
            end_date: newFormData?.end_date
        };
    
        try {
            const res = await ApprovalsPut({ formData, id });
    
            if (res?.data?.id) {
                navigate('/approval/superapproval');
            } else if (res?.error) {
                if (res.error.status === 422 && res.error.data?.code) {
                    showToast(`${res.error.data.detail}`, "error");
                } else if (res.error.status === 400 && res.error.data?.non_field_errors) {
                    showToast(`${res.error.data.non_field_errors}`, "error");
                } else {
                    // Handle other errors not specified
                    showToast("An unexpected error occurred", "error");
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast("Error submitting form: " + error.message, "error");
        }
        setReasonDialogOpen(false);
    };
    


    const EmployeeClickHandler = (selectedRow) => {
        setEmployeeName(selectedRow.first_name + " " + selectedRow.last_name);
        set_employee_id(selectedRow.id)
        setEmployeeDialog(false);
    }
    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) <span style={{ color: 'red' }}>Null</span>
        return value;
    };


    const EmployeeHeader = [
        { field: "employee_no", headerName: "Employee Number", minWidth: 200, },
        {
            field: "name", headerName: "Name", minWidth: 200,
            renderCell: renderNullInRed,
            valueGetter: (params) =>
                `${params.row.first_name || ""} ${params.row.last_name || ""}`,
        },
        { field: "father_name", headerName: "Father Name", minWidth: 200, },
        { field: "cnic", headerName: "CNIC", minWidth: 200, },
    ]


    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={0} sx={{ border: '1px solid #E4E4E4' }}>
                <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave ID:</Typography>
                        <Typography variant="subtitle1" color="initial" >#00{leave_request_id}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Type:</Typography>
                        <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.leave_type?.leave_type}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Attachment:</Typography>
                        <Box sx={{ display: "flex", alignItems: 'center' }}>
                            <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: 'pointer' }} >
                                <div onClick={() => openInNewTab(leaveData?.results[0]?.attachment)}>

                                    <Outlined_eye color={`${theme.palette.success[600]}`} />
                                </div>
                            </Box>

                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Apply Date:</Typography>
                        <Typography variant="subtitle1" color="initial" >{formattedDate}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Period:</Typography>
                        <Typography variant="subtitle1" color="initial" >{formattedStartDate} <span style={{ fontWeight: 600 }}>TO</span> {formattedEndDate}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Count of Leaves:</Typography>
                        <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.days_count} </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Leave Reason:</Typography>
                        <Typography variant="subtitle1" color="initial" >{leaveData?.results[0]?.notes} </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box>
                <Typography variant="h6" color="initial" sx={{ my: 2 }}>Approvals :</Typography>

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
                                <Grid container spacing={0}>
                                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
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
                                <Typography variant="body2"> {data?.comments} </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )
                ))}
            </Box>

            {/* super approvals */}
            <>
                <Typography variant="h6" color="initial" sx={{ my: 2 }}>Alternate Approval:</Typography>
                {leaveData?.results[0]?.superapprovals.map((data, index) => (
                    <Accordion key={index} sx={{ p: 1, }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`super-panel${index + 1}-content`} id={`super-panel${index + 1}-header`}>
                            <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>{data?.designation} </Typography>
                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    px: 2,
                                    borderRadius: "4px",
                                    backgroundColor:
                                        data.status === "Pending" ? theme.palette.warning[300] :
                                            "black",
                                    color:
                                        data.status === "Pending" ? theme.palette.warning.main :
                                            "black"
                                }}>
                                    {data.status}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <Grid container spacing={0}>
                            <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
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


                            {/* <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                        Position Start Date:
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                    <Typography variant="subtitle1" color="initial">
                                        {formattedStartDate}
                                    </Typography>
                                </Box>
                            </Grid> */}

                            <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4", p: 1, gap: 1 }}>
                                <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                                    {EmployeeData && EmployeeData.results ?
                                        <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <InputField name="Employee" label="Employee" placeholder="Select Employee" value={EmployeeName || ''} type="text" isShowIcon={true} onClick={() => setEmployeeDialog(true)} mandatory />
                                            <Multi_Dropdown RowFilterWith={"id"} onClose={() => setEmployeeDialog(false)} isOpen={employeeDialog} tableHeader={EmployeeHeader} tableRows={EmployeeData.results} onSelect={EmployeeClickHandler} MinimumWidth={"500px"} />
                                        </div>
                                        :
                                        <InputField name="Employee" label="Employee " placeholder="Select Employee" value={EmployeeName || ''} type="text" isShowIcon={true} onClick={() => setEmployeeDialog(true)} />
                                    }
                                </Grid>
                                <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                                    <InputField name="start_date" type="date" label="Start Date" onChange={handleChange} value={newFormData?.start_date || " "} />
                                </Grid>
                                <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                                    <InputField name="end_date" type="date" label="End Date" value={newFormData?.end_date || " "} disabled />
                                </Grid>
                            </Grid>
                        </Grid>
                        <AccordionDetails><Typography variant="body2"> {data?.comments}</Typography></AccordionDetails>
                        {/* <Box sx={{ display: "flex", alignItems: 'start', flexDirection: "column", px: 1, gap: 1 }}>
                           
                            {EmployeeData && EmployeeData.results ?
                                <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <InputField name="Employee" label="Employee" placeholder="Select Employee" value={EmployeeName || ''} type="text" isShowIcon={true} onClick={() => setEmployeeDialog(true)} mandatory />
                                    <Multi_Dropdown RowFilterWith={"id"} onClose={() => setEmployeeDialog(false)} isOpen={employeeDialog} tableHeader={EmployeeHeader} tableRows={EmployeeData.results} onSelect={EmployeeClickHandler} MinimumWidth={"500px"} />
                                </div>
                                :
                                <InputField name="Employee" label="Employee " placeholder="Select Employee" value={EmployeeName || ''} type="text" isShowIcon={true} onClick={() => setEmployeeDialog(true)} />
                            }

                        </Box> */}
                        <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                            <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                                onClick={() => handleButtonClick("Approved", data)}>Save</Button>

                        </Box>
                    </Accordion>
                ))}
            </>


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
                        <Button onClick={handleSubmit} sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}>Submit</Button>
                        <Button onClick={handleSubmit} sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2 }}>Cancel</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box >
    )
}

export default SuperApprovalsDetail
