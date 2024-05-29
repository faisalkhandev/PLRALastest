import { useTheme } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Btn, InputField, Multi_Dropdown, SimpleDropDown } from "../../Components";
import Breadcrumb from "../../Components/Common/BreadCrumb";
import { etransferwindow } from "../../Data/Setup_Data/Setup_Data";
import { useGetUserByIdQuery } from "../../Features/API/AnnualAssessment";
import { useGetapplypositionQuery, usePosttransferprocessMutation } from "../../Features/API/Transfer";
import { GoBack } from "../../Assets/Icons";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";

const ETransferApply = () => {
    //Navigate
    const { id,windowid } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const [name, setname] = useState(null);
    const [user_id, set_user_id] = useState(null);
    const [states, setStates] = useState({ p_rec_id: "", position_desc: "", position_id: "", no_of_position: "" });
    const [centerDialog, setIsCenterDialog] = useState(false);
    const [posttransferprocess] = usePosttransferprocessMutation();
    const { data: transferprocess, isLoading: transferprocessloading, isError: transferprocessisError, error: transferprocessError, refetch: transferprocessrefetch } = useGetapplypositionQuery();
    console.log(transferprocess);
    const [formData, setFormData] = useState({
        attachment: null,
        transfer_position: "",
        transfer_category: "",
        transfer_window: ""
    });


    useEffect(() => { transferprocessrefetch(); }, [transferprocessrefetch]);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    const { data, isLoading, isError, error, refetch } = useGetUserByIdQuery(user_id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetch();
                if (data) {
                    setname(`${data.first_name} ${data.last_name}`);
                }
            } catch (error) {
                toast.error(`Error fetching data: ${error}`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        };

        fetchData();
    }, [data]);

    const PositionTransferhandler = (selectedRow) => {
        setFormData({ ...formData, transfer_position: selectedRow.p_rec_id, transfer_window: selectedRow.e_window_period_id })
        setStates({ ...states, p_rec_id: selectedRow.position_desc })
        setIsCenterDialog(false)
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            attachment: file,
        });
    };

    const handleDropDownChange = (event, field) => {
        setStates((prevStates) => ({ ...prevStates, [field]: event.target.value }));
        setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value }));
    };

    const transfer_category = [
        { value: "Open Merit", label: "Open Merit", },
        { value: "Wedlock", label: "Wedlock", },
        { value: "Disability/Medical", label: "Disability/Medical", },
        { value: "Wedlock-Disability/Medical", label: "Wedlock-Disability/Medical", },
    ];

    //SaveData
    const handleApplyClick = async (e) => {
        e.preventDefault();
        let formD = new FormData();
        if (formData.transfer_category === "Disability/Medical" || formData.transfer_category === "Wedlock-Disability/Medical") {
            if (
                formData.attachment === null
            ) {
                return toast.error("Fields should not be empty! ", {
                    position: "top-center",
                    autoClose: "30000",
                });
            } else {
                if (
                    typeof formData.attachment !== "string" &&
                    formData.attachment != null
                ) {
                    formD.append("attachments", formData.attachment);
                }
            }
        }
        formD.append("status", "In Process");
        formD.append("transfer_category", formData.transfer_category);
        formD.append("transfer_position", id);
        formD.append("transfer_window", windowid);
        formD.append("employee", user_id);
        console.log(Object.fromEntries(formD.entries()));
        const res = await posttransferprocess(formD);

        if (res.error?.status === 400) {
            toast.error("Something Went Wrong.", {
                position: "top-center",
                autoClose: 3000,
            });
        } else if (res.error?.status === 500) {
            toast.error("Server problem", {
                position: "top-center",
                autoClose: 3000,
            });
        } else {
            toast.success("Transfer Process Created", {
                position: "top-center",
                autoClose: 1000,
            });

            setFormData({
                attachment: null,
                transfer_position: "",
                transfer_category: "",
                transfer_window: ""
            });

            setTimeout(() => {
                navigate("/ETransferProcess");
            }, 3000);
        }
    };

    return (
        <div style={{ margin: "14px 30px 0 30px" }} className="EmployeeTableBox">
            <Grid container spacing={2}>
                <Grid item xs={9}>

                    <Box sx={{ p: 2, border: "1px solid #e2e1e0", borderRadius: "4px", height: "calc(100vh - 150px)", }} >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
                            <Box sx={{ display: "flex" }}>
                                <Box
                                    sx={{
                                        width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                                        transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                                        boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
                                    }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                                <Breadcrumb
                                    title="Transfer Process"
                                    breadcrumbItem="E-Transfer / TransferProcess"
                                />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                                <Btn type="apply" onClick={handleApplyClick} />
                            </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}  >
                            <Grid xs={9} item sx={{ display: "flex", flexDirection: "column", gap: 2, m: " auto auto" }} >
                                <InputField name="employee" label="Employee Name" placeholder="Employee Name" type="text" value={name} fullWidth disabled />
                                <SimpleDropDown name="transfer_category" label="Transfer Category" isShowIcon={true} value={formData.transfer_category} options={transfer_category} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "transfer_category")} />
                                {formData.transfer_category === "Disability/Medical" || formData.transfer_category === "Wedlock-Disability/Medical" ? (
                                    <InputField
                                        name="attachment"
                                        label="Attachment"
                                        type="file"
                                        fullWidth
                                        mandatory
                                        onChange={handleFileInputChange}
                                    />
                                ) : null}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <EmployeeFormDashboard userId={user_id} title="Processess" processName="Resignation" height="calc(100vh - 150px)" />
                </Grid>
            </Grid>
        </div>
    );
};

export default ETransferApply;
