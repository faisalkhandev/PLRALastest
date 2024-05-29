import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GoBack, Warning } from "../../Assets/Icons/index.jsx";
import { Breadcrumb, ErrorHandler, InputField, Loader, Multi_Dropdown, } from "../../Components/index.js";
import { useGetPositionbyidQuery } from "../../Features/API/API.js";
import { useGetProgressionbyidQuery } from "../../Features/API/ProgressionApi.js";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx";
import axios from "axios";

const ApprovalDetail = () => {
    const theme = useTheme();
    const [position, setposition] = useState("")
    const navigate = useNavigate();
    const { id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [dataOject, setDataObject] = useState({});
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [ispositionOpen, setisPositionOpen] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
    });

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    const {
        data: ProgressionData,
        isLoading: Progressionloading,
        isError: ProgressionrefreshError,
        refetch,
    } = useGetProgressionbyidQuery(id);

    const jobid = ProgressionData?.promote_job?.ppg_level?.ppg_rec_id;
    const centerid = ProgressionData?.employee?.position?.location?.c_rec_id;

    const { data: positionData, isLoading: positionloading, isError: positionrefreshError, error: positionqueryError, positionrefetch } = useGetPositionbyidQuery({ jobid });

    useEffect(() => { refetch(); }, [refetch]);

    const getStatusStyle = (status, theme) => {
        let backgroundColor, color;

        switch (status) {
            case "Approved":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to Competent Authority":
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
            default:
                backgroundColor = "black";
                color = "black";
        }

        return { backgroundColor, color };
    };
    const status = ProgressionData?.status;
    const { backgroundColor, color } = getStatusStyle(status, theme);

    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const positionClickHandler = (selectedRow) => {
        setFormData({ ...formData, position: selectedRow.p_rec_id, });
        setisPositionOpen(false);
        setposition(selectedRow?.position_id)
    };

    const handleButtonClick = () => {
        setReasonDialogOpen(true);
    };

    const position_columns = [

        { field: "position_id", headerName: "Position ID", flex: 1, width: 250 },
        { field: "position_desc", headerName: "Description", flex: 1, width: 180 },
        {
            field: "wing", headerName: "Wing", flex: 1, width: 180, renderCell: (params) => {
                return (<span className="table_first_column"> {params?.row?.wing?.wing_name}</span>)
            }
        },
        {
            field: "sub_wing", headerName: "Sub Wing", flex: 1, width: 180, renderCell: (params) => {
                return (<span className="table_first_column">{params?.row?.sub_wing?.sub_wing_name}</span>);
            }
        },

    ];

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
        setdateData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async () => {
        const positionid = formData.position;
        console.log(positionid);
        if(formData.position===""){
            toast.error("Please select position", { position: "top-center", autoClose: 1000 });
            setReasonDialogOpen(false);
            return;
        }
        
        try {
            const updatePositionResponse = await axios.get(`http://127.0.0.1:8000/progression/updatePosition/${id}/${positionid}/`);
            const generateProgressionResponse = await axios.get(`http://127.0.0.1:8000/progression/generate-progression/${id}/`);
    
            if (updatePositionResponse.status === 201 && generateProgressionResponse.status === 200) {
                toast.success("Elevation Updated Successfully", { position: "top-center", autoClose: 1000 });
                setTimeout(() => { navigate("/ProgressionProcess"); }, 3000);
            } else {
                toast.error("Failed to update progression", { position: "top-center", autoClose: 1000 });
            }
        } catch (error) {
            toast.error("Failed to update progression", { position: "top-center", autoClose: 1000 });
            console.error(error);
        }
    
        setReasonDialogOpen(false);
    };
    

    return (
        <div style={{ padding: "20px" }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}` }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                <Breadcrumb title="Elevation" breadcrumbItem="Elevation / Elevation Pending List" />
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
                                                        {ProgressionData?.employee.id}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "50px" }}>
                                                        Name:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.first_name.charAt(0).toUpperCase()}{ProgressionData?.employee?.first_name.slice(1).toLowerCase()} {ProgressionData?.employee?.last_name.charAt(0).toUpperCase()}{ProgressionData?.employee?.last_name.slice(1).toLowerCase()}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "160px" }}>
                                                        Job Title:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" >
                                                        {ProgressionData?.employee?.position?.job?.job_title}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Center Name:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.position?.location?.center_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        District:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.position?.location?.district?.district_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Division:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.position?.location?.division?.division_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Tehsil:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.position?.location?.tehsil?.t_name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Promoted Job:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" sx={{textAlign:"right"}}>
                                                        {ProgressionData?.promote_job?.job_title}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        PPG Level:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.employee?.position?.job?.ppg_level?.ppg_level}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                        Promoted PPG Level:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial">
                                                        {ProgressionData?.promote_ppg_level?.ppg_level}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Pending Inquiry:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData.pending_inquiry ? "green" : 'red' }}>
                                                        {ProgressionData.pending_inquiry ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Major Penalities:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData.major_penalities ? "green" : 'red' }}>
                                                        {ProgressionData.major_penalities ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Vacant Post:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: ProgressionData.post_vacant ? "green" : 'red' }}>
                                                        {ProgressionData.post_vacant ? <FaCheck /> : <RxCross2 />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                                        Status:
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                                                        {ProgressionData?.status}
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
                                                    HR DIRECTOR
                                                </Typography>
                                                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                    |
                                                </Typography>
                                                {/* <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(data?.status, theme).backgroundColor, color: getStatusStyle(data?.status, theme).color, }}>
                                    {data?.status}
                                </Typography> */}
                                            </Box>
                                            {/* <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                                Approval Date: {data?.status_date}
                            </Box> */}
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {/* <Grid container spacing={0}>
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
                        </Grid> */}

                                        <Box sx={{ display: "flex", alignItems: "start", p: 1, mt: 3 }}>
                                            {positionData && positionData.results ?
                                                <div>
                                                    <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onClick={() => setisPositionOpen(true)} error={formErrors?.data?.position} mandatory />
                                                    <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={ispositionOpen} onClose={() => setisPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results} onSelect={positionClickHandler} />
                                                </div>
                                                :
                                                <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onChange={handleChange} error={formErrors?.data?.position} />
                                            }
                                        </Box>
                                        <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                                            <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick()}>
                                                Send to DG
                                            </Button>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>

                            {/* Dialog  */}
                            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                                <Box sx={{ width: "350px" }}>
                                    <DialogContent>
                                        <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
                                            <Warning color={`${theme.palette.warning[600]}`} /> Do you want to Send to DG?
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
                    <Box sx={{ border: `1px solid ${theme.palette.gray[100]}`, p: 0.5, borderRadius: '4px', maxWidth: '100%', }}>
                        <EmployeeFormDashboard userId={ProgressionData?.employee?.id} title="Processess" height="calc(100vh - 70px)"
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default ApprovalDetail;