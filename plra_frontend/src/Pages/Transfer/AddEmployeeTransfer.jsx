import React, { useState, useEffect } from "react";
import { Box, Grid, } from "@mui/material";
import { Btn, InputField, Multi_Dropdown, Breadcrumb, HeadingBar } from "../../Components";
import { PositionHeader } from '../../Data/Setup_Data/Setup_Data.jsx'
import { useGetAllPositionQuery, useGetEmployeeByIDQuery, usePostTransferMutation, } from '../../Features/API/Transfer.js'
import SimpleDropdown from "../../Components/Common/SimpleDropDown.jsx";
import { TextArea } from "../../Components"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import "../Styles.css";
import { showToast } from "../../Components/shared/Toast_Card";
import StatusCodeHandler from "../../Components/Common/StatusCodeHandler";
import { GoBack } from "../../Assets/Icons/index.jsx";
import { useTheme } from "@emotion/react";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx";



const AddEmployeeTransfer = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});

    const [empId, setEmpId] = useState(null);
    const navigate = useNavigate()
    const currentURL = window.location.href;
    const urlParts = currentURL.split('/');
    const id = urlParts[urlParts.length - 1];
    //States
    const [categoryState, setCategoryState] = useState("")
    const [isPositionDialog, setIsPositionDialog] = useState(false);
    const [formData, setFormData] = useState({
        employee: id, transfer_apply_date: null, transfer_position: null, remarks: null, transfer_approval_date: null,
        transfer_category: null, attachments: null, status: null
    });
    const [positionStates, setpositionStates] = useState({
        transfer_position: "",
        Transfer_district: "", Transfer_division: "", Transfer_tehsil: "",
        Transfer_center: ""
    });
    useEffect(() => {
        setEmpId(Cookies.get("user_id"));
    }, [empId]);

    //Queries
    const { data: PositionData, isLoading: Positionloading, isError: PositionrefreshError, error: PositionqueryError, refetch: Positionrefetch } = useGetAllPositionQuery(true);
    const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError } = useGetEmployeeByIDQuery(id);
    const [postAdministrativeData] = usePostTransferMutation();

    const Category = [
        {
            id: '1',
            value: 'Inquiry',
            label: 'Inquiry'
        },
        {
            id: '2',
            value: 'Administrative',
            label: 'Administrative'
        },
        {
            id: '3',
            value: 'Wedlock',
            label: 'Wedlock'
        },
        {
            id: '4',
            value: 'Disability/Medical',
            label: 'Disability/Medical'
        },
    ]
   

    // functions


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                attachments: file,
            }));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value)
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCategoryChange = (event) => {
        const { name, value } = event.target;
        setCategoryState(value);
        setFormData({
            ...formData,
            transfer_category: value,
        })
    };

  
    const PositionClickhandler = (selectedRow) => {
        setFormData({
            ...formData, transfer_position: selectedRow.p_rec_id,
        })
        setpositionStates({
            ...positionStates,
            transfer_position: selectedRow.position_desc,
            Transfer_center: selectedRow.location.center_name, Transfer_district:
                selectedRow.location.district.district_name, Transfer_division: selectedRow.location.division.division_name, Transfer_tehsil:
                selectedRow.location.tehsil.t_name,

        })
        setIsPositionDialog(false)
    };

    const handleSaveData = async (e) => {
        e.preventDefault();
        try {
            let formD = new FormData();

            formD.append("employee", id);
            formD.append('transfer_apply_date', formData.transfer_apply_date);
            formD.append('remarks', formData.remarks);
            // formD.append('transfer_approval_date', formData.transfer_approval_date);
            formD.append('transfer_position', formData.transfer_position);
            formD.append('transfer_category', formData.transfer_category);
            if (
                typeof formData.attachments !== "string" &&
                formData.attachments != null
            ) {
                formD.append("attachments", formData.attachments);
            }
            console.log(formD)
            const res = await postAdministrativeData(formD);
            console.log("responseabc: ", formD);

            if (res?.error && res.error.status) {
                if (res.error?.status == 400 && res.error?.data?.non_field_errors) {
                    return showToast(`${res.error?.data?.non_field_errors}`, "error");
                }
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            } else {
                showToast(`Transfer Applied Successfully`, "success");


                setFormData({
                    transfer_apply_date: "", transfer_position: "", remarks: "", transfer_approval_date: "",
                    transfer_category: "", attachments: null, status: " "
                });
                setFormErrors({});
                setTimeout(() => {
                    navigate("/Transfer");
                }, 2000);
            }
        } catch (error) {
            return showToast(`${error.message}`, 'error');
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
                                <Breadcrumb title="Administrative Transfer"
                                    breadcrumbItem="Employee / Transfer" />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                                <Btn type="apply" onClick={handleSaveData} />
                            </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ display: "flex", }}  >
                            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                                <InputField name="employee" type="text" placeholder="Employee Name" mandatory={true} label="Employee Name" disabled value={EmployeeData?.first_name + ' ' + EmployeeData?.last_name} error={formErrors?.data?.employee} />
                                <InputField name="transfer_apply_date" label="Transfer Apply Date " value={formData.transfer_apply_date} onChange={handleChange} type="date" fullWidth error={formErrors?.data?.transfer_apply_date} />
                                {PositionData && PositionData.results ?
                                    <div>
                                        <InputField name="transfer_position" mandatory={true} label="Transfer Position" required={true} type="text" isShowIcon={true} value={positionStates.transfer_position || ""} onClick={() => { setIsPositionDialog(true); }} error={formErrors?.data?.transfer_position} />
                                        <Multi_Dropdown
                                            isOpen={isPositionDialog}
                                            onClose={() => setIsPositionDialog(false)}
                                            MinimumWidth={'600px'}
                                            tableRows={PositionData.results}
                                            tableHeader={PositionHeader}
                                            onSelect={PositionClickhandler}
                                            RowFilterWith='p_rec_id'
                                        />
                                    </div> : <InputField name="Transfer_position" mandatory={true} label="Transfer Position " type="text" isShowIcon={true} value={positionStates.Transfer_position} error={formErrors?.data?.Transfer_position} />
                                }
                                
                                <SimpleDropdown name="transfer_category" label="Transfer Category" mandatory={true} value={formData.transfer_category || ""} options={Category ? Category : ""} onChange={handleCategoryChange} type="text" fullWidth error={formErrors?.data?.transfer_category} helperText={formErrors?.data?.transfer_category} />
                                
                                <TextArea Rows={8} name="remarks" label="Remarks" placeholder="Write Remarks...." onChange={handleChange} error={formErrors?.data?.remarks} helperText={formErrors?.data?.remarks} />
                               
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                                <InputField name="Transfer_division" label="Transfer Division" disabled={true} value={positionStates.Transfer_division} onChange={handleChange} type="text" fullWidth error={formErrors?.data?.Transfer_division} />
                                
                                <InputField name="Transfer_district" onChange={handleChange} disabled={true} value={positionStates.Transfer_district} label=" Transfer District " type="text" fullWidth error={formErrors?.data?.Transfer_district} />
                                <InputField name="Transfer_tehsil" label="Transfer Tehsil" disabled={true} value={positionStates.Transfer_tehsil} onChange={handleChange} type="text" fullWidth error={formErrors?.data?.Transfer_tehsil} />
                                <InputField name="Transfer_center" label="Transfer Center" disabled={true} value={positionStates.Transfer_center} onChange={handleChange} type="text" fullWidth error={formErrors?.data?.Transfer_center} />
                                {
                                    categoryState === '' ? (
                                        <></>
                                    ) : (

                                        <Box sx={{ display: "flex", flexDirection: "column" }}>

                                           
                                            {categoryState === 'Wedlock' && (
                                                <InputField name="attachments" label="Wedlock Attachment" onChange={handleFileChange} type="file" fullWidth />
                                            )}
                                            {categoryState === 'Disability/Medical' && (
                                                <InputField name="attachments" label="Disability/Medical " onChange={handleFileChange} type="file" fullWidth />
                                            )}
                                        </Box>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <EmployeeFormDashboard userId={id} title="Processess" processName="Administrative Transfer" height="calc(100vh - 150px)" />
                </Grid>
            </Grid>
        </div>
    );
};

export default AddEmployeeTransfer;