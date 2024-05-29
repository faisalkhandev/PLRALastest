import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GoBack, Warning } from "../../../../../Assets/Icons/index.jsx";
import { Breadcrumb, Btn, ErrorHandler, InputField, Loader, MyTableContainer, } from "../../../../../Components/index.js";
import { useDisciplinaryProceedingApiQuery, useProbeOfficerApprovalsPutMutation } from "../../../../../Features/API/DisciplinaryProceedings.js";
import { showToast } from "../../../../../Components/shared/Toast_Card.jsx";
import { approvalcellStyle, gridCellStyle } from "../../../../../Utils/cellstyle.js";
import useDateFormat from "../../../../../hooks/useDateFormat.js";
import { useGethrdirectorapprovalbyidQuery } from "../../../../../Features/API/Transfer.js";
import axios from "axios";

const HRApprovalDetails = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [dataOject, setDataObject] = useState({});
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const formatDate = useDateFormat();

    const [dateData, setdateData] = useState({
        form_date: '',
    })
    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);


    const { data: DisciplineProceedingsData, isLoading: DisciplineProceedingsLoading, isError: DisciplineProceedingsisError, error: DisciplineProceedingsError, refetch, } = useGethrdirectorapprovalbyidQuery(id);
    console.log(DisciplineProceedingsData);


    const [ApprovalsPut] = useProbeOfficerApprovalsPutMutation();
    useEffect(() => { refetch(); }, []);

    const allETransferRecord = DisciplineProceedingsData?.e_transfer_process?.map((data) => ({
        id: data?.e_transfer_rec_id,
        emp_name: data?.employee?.first_name + " " + data?.employee?.last_name,
        e_transfer_apply_date: data?.e_transfer_apply_date,
        transfer_category: data?.transfer_category,
        status: data?.status,
        positionid: data?.transfer_position?.p_rec_id,
        job: data?.transfer_position?.job?.job_title,
        ppg_level: data?.transfer_position?.job?.ppg_level?.ppg_level,
        center: data?.transfer_position?.location?.center_name,
        district: data?.transfer_position?.location?.district?.district_name,
        division: data?.transfer_position?.location?.division?.division_name,
        region: data?.transfer_position?.location?.region?.region_name,
        tehsil: data?.transfer_position?.location?.tehsil?.t_name,
        description: data?.transfer_position?.position_desc,
        position_type: data?.transfer_position?.position_type?.position_type_name,
        sub_wing: data?.transfer_position?.sub_wing?.sub_wing_name,
        wing: data?.transfer_position?.wing?.wing_name,
    })) || [];

    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleRowClick = async (params) => {
        // const data = await axios.get(`http://127.0.0.1:8000/E_transfer/ratingmatrix/?e_transfer_process=${params?.row?.id}`);
        // setSelectedHistory(data?.data);
        // setDialogOpen(true);
        // setRequest_id(params?.row?.id);
    };
    const handleProcessClick = async() => {
        if (!selectedId) {
            toast.error("Please select a row before proceeding.", { position: "top-center", autoClose: 3000 });
            return;
        }
        if (!dateData.form_date) {
            toast.error("Please select an effective date before proceeding.", { position: "top-center", autoClose: 3000 });
            return;
        }
        try{
            await axios.get(`http://127.0.0.1:8000/E_transfer/processFinalApproval/${id}/${dateData.form_date}/${selectedId}/`)
            showToast("Approval Successfully created","success");
        }catch(e){
            showToast("Error in approving","error")
        }
        console.log(`Selected ID: ${selectedId} with Effective Date: ${dateData.form_date}`);
        navigate("/approval/hrdirtransferapproval");
    };

    const columns = [
        {
            field: "id", headerName: "ID", minWidth: 50, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <>
                    <input
                        type="radio"
                        checked={selectedId === params.row.id}
                        onChange={() => { setSelectedId(params.row.id); }}
                        style={{ marginRight: "10px" }}
                    />
                    <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.id}</span>
                </>
            },
        },
        {
            field: "emp_name", headerName: "Name", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.emp_name}</span>
            },
        },
        {
            field: "e_transfer_apply_date", headerName: "Apply Date", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.e_transfer_apply_date}</span>
            },
        },
        {
            field: "transfer_category", headerName: "Category", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.transfer_category}</span>
            },
        },
        {
            field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                const cellStyle = gridCellStyle(theme, params?.row?.status);
                return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column" onClick={onView}>
                    {params?.row?.status}
                </span>
            },
        },
        {
            field: "positionid", headerName: "Position ID", minWidth: 50, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.positionid}</span>
            },
        },
        {
            field: "job", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.job}</span>
            },
        },
        {
            field: "description", headerName: "Description", minWidth: 450, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.description}</span>
            },
        },
        {
            field: "position_type", headerName: "Position Type", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.position_type}</span>
            },
        },
        {
            field: "ppg_level", headerName: "PPG level", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.ppg_level}</span>
            },
        },
        {
            field: "center", headerName: "Center", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.center}</span>
            },
        },
        {
            field: "district", headerName: "District", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.district}</span>
            },
        },
        {
            field: "division", headerName: "Division", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.division}</span>
            },
        },
        {
            field: "region", headerName: "Region", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.region}</span>
            },
        },
        {
            field: "tehsil", headerName: "Tehsil", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.tehsil}</span>
            },
        },
        {
            field: "sub_wing", headerName: "Sub Wing", minWidth: 300, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.sub_wing}</span>
            },
        },
        {
            field: "wing", headerName: "Wing", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.wing}</span>
            },
        },
    ];

    const status = DisciplineProceedingsData?.inquiry_status;
    const { backgroundColor, color } = approvalcellStyle(status, theme);

    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

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

    const handleButtonClick = () => {
        setReasonDialogOpen(true);
    };

    const handleSubmit = async () => {
        let formD = new FormData();
        if (
            formData.attachment === null
        ) {
            toast.error("Fields should not be empty! ", {
                position: "top-center",
                autoClose: "30000",
            });
        } else {
            if (
                typeof formData.attachment !== "string" &&
                formData.attachment != null
            ) {
                formD.append("attachment_of_probe_report", formData.attachment);
            }
            formD.append("status", actionPerformed);
            formD.append("disciplinary_proceeding_request", approvalID);
            formD.append("approving_authority", user_id);
            console.log(Object.fromEntries(formD.entries()));
        }
        try {
            const res = await ApprovalsPut({ formData: formD, id });
            if (res?.data?.id) {
                if (res?.error?.status === 422 && res?.error?.data?.code) {
                    return (showToast(`${res?.error?.data?.detail}`, "error"));
                }
                if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                    return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                }
                toast.success("Approval Updated Successfully", { position: "top-center", autoClose: 1000, });
                setTimeout(() => { navigate("/approval/disciplinaryprocedingapproval/probofficerapproval"); }, 3000);
            }
        } catch (error) {
            toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
        }
        setReasonDialogOpen(false);
    };

    return (
        <Box sx={{}}>
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Box sx={{ width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}` }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                <Breadcrumb title="HR Director Approvals" breadcrumbItem="Approvals / HR Director Approvals" />
            </Box>
            {DisciplineProceedingsLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
                <Loader />
            </Box>
                : DisciplineProceedingsisError ? <ErrorHandler online={navigator.onLine} /> :
                    <Box sx={{ pl: 0.7, pt: 0.7 }}>
                        <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "190px" }}>
                                        ID:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {id}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                                        Position Id:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.p_rec_id}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                        width
                                            : "100px"
                                    }}>
                                        Job:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.job?.job_title}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                        width
                                            : "100px"
                                    }}>
                                        PPG level:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.job?.ppg_level?.ppg_level}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Center:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.location?.center_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        District:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.location?.district?.district_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Division:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.location?.division?.division_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Region:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.location?.region?.region_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Tehsil:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.location?.tehsil?.t_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Position Type:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.position_type?.position_type_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Sub Wing:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.sub_wing?.sub_wing_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Wing:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.wing?.wing_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                        Description:
                                    </Typography>
                                    <Typography variant="subtitle1" color="initial">
                                        {DisciplineProceedingsData?.position?.position_desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
            }

            <Box sx={{ m: 0.7 }}>
                <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}>
                    Approvals :
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ width: '350px', p: 1, }}>

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
                    <Btn type="Process" onClick={handleProcessClick} />
                </Box>


                {DisciplineProceedingsLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
                    <>
                        {DisciplineProceedingsisError ? <ErrorHandler online={navigator.onLine} /> :
                            DisciplineProceedingsData ?
                                <MyTableContainer columns={columns} data={allETransferRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
                        }
                    </>
                }
            </Box>

            {/* Dialog  */}
            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                <Box sx={{ width: "350px" }}>
                    <DialogContent>
                        <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
                            <Warning color={`${theme.palette.warning[600]}`} /> Do you want to refer to DG?
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
    );
};

export default HRApprovalDetails;