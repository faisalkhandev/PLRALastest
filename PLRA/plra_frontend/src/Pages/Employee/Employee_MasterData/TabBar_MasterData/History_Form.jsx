import React, { Fragment, useState } from 'react'
import { Box, Typography, Grid, Switch, Dialog } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, CheckBoxField, HeadingBar, FileInput } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import { JobDistrictHeader } from "../../../../Data/Setup_Data/Setup_Data";
import { useGetJobDistrictQuery, useUpdateEmployementHistoryMutation, useGetEmployementHistoryQuery, useDeleteEmployementHistoryMutation } from '../../../../Features/API/API'
import { toast } from 'react-toastify'
import { usePostEducationMutation, usePostEmployementHistoryMutation } from '../../../../Features/API/API'
import { useParams } from 'react-router-dom'
import { Warning } from '../../../../Assets/Icons/index.jsx'



const History_Form = () => {
    const theme = useTheme();
    const { id } = useParams();
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [formData, setFormData] = useState({
        organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
        government_job: false, leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
        organization_address: '', job_district: '', employee: id
    });
    const [selectRowID, setSelectedRowID] = useState(null);
    const [districtName, setdistrictName] = useState("");
    const [districtDialog, setDistrictDialog] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)
    const [editDialog, setEditDialog] = useState(false);
    const [checkbox, setCheckBox] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);



    //Queries
    const { data: employeeJobDistrict, isLoading: employee_loading, isError: employee_refreshError, error: employee_queryError, employee_refetch } = useGetJobDistrictQuery();
    const { data: employeeHistory, isLoading: employeeHistoryloading, isError: employeeHistoryrefreshError, error: employeeHistoryqueryError, refetch: employeeHistoryrefetch } = useGetEmployementHistoryQuery(id);
    const [updateHistoryData] = useUpdateEmployementHistoryMutation();
    const [postHistory] = usePostEmployementHistoryMutation();
    const [deleteEmploymentHistory] = useDeleteEmployementHistoryMutation();

    //Functions
    //Employee Dialog Click Listeners
    const jobDistrictClickHandler = (selectedRow) => {
        setdistrictName(selectedRow.district_name)
        setFormData({ ...formData, job_district: selectedRow.id, });
        console.log(formData.job_district);
        setDistrictDialog(false);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const UpdateDialogHandler = () => {
        if (isRowSelected) {
            setEditDialog(true)
        }
        else { toast.error("Record not selected", { position: "top-center", autoClose: 3000 }) }
    }

    const handleBoxClick = (record, index) => {
        setIsRowSelected(true)
        setActiveBoxIndex(index);
        setSelectedRowID(record.e_h_rec_id)
        setFormData({
            organization_name: record.organization_name, position_held: record.position_held, employment_start_date: record.employment_start_date, employment_end_date: record.employment_end_date,
            government_job: record.government_job, leaving_reason: record.leaving_reason, noc_from_previous_employment: record.noc_from_previous_employment, organization_contact_number: record.organization_contact_number,
            organization_address: record.organization_address, job_district: record.job_district.id, employee: record.employee
        })
        setdistrictName(record.job_district.district_name);
        setCheckBox(formData.government_job)
        setfieldsDisable(true)
    };

    const resetForm = () => {
        setSelectedRowID(null);
        setIsRowSelected(false);
        setActiveBoxIndex(null);
        setdistrictName("");
        setfieldsDisable(false);
        setFormData({
            organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
            government_job: false, leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
            organization_address: '', job_district: '', employee: id
        })
    };

    const handlePostData = async (e) => {
        if (isRowSelected) {
            try {
                const res = await updateHistoryData({ selectRowID, updateEmployeeHistory: formData });
                if (res.error) {
                    if (res.error.status === 400) { toast.error("Record not updated.", { position: "top-center", autoClose: 3000 }) }
                    else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
                } else {
                    toast.success("Record updated successfully.", { position: "top-center", autoClose: 3000 });


                    employeeHistoryrefetch();
                    resetForm();
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            if (formData.organization_name == '' || formData.position_held == '' || formData.employment_start_date == '' || formData.employment_end_date == '' || formData.education_end_date == '' ||
                formData.leaving_reason == '' || formData.organization_contact_number == '' || formData.organization_address == '' || formData.job_district == ''
            ) {
                toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 })
                console.log("Miss");
            }
            else {
                try {

                    const res = await postHistory(formData);
                    if (res.error) {
                        if (res.error.status === 400) { toast.error("Record not updated.", { position: "top-center", autoClose: 3000 }) }
                        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
                    } else {
                        employeeHistoryrefetch();
                        toast.success("Record created.", { position: "top-center", autoClose: 3000 });
                        resetForm();
                    }
                }




                catch (err) {
                    console.log(err);
                }

            }

        }
    }

    // const handleUpdateData = async (e) => {
    //     try {
    //         if (isRowSelected) {
    //             const res = await updateHistoryData({ selectRowID, updateEmployeeHistory: formData });
    //             if (res.error) {
    //                 if (res.error.status === 400) { toast.error("Record not updated.", { position: "top-center", autoClose: 3000 }) }
    //                 else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
    //             } else {
    //                 toast.success("Record updated successfully.", { position: "top-center", autoClose: 3000 });
    //                 setFormData({
    //                     organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
    //                     government_job: '', leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
    //                     organization_address: '', job_district: '', employee: id
    //                 })
    //                 employeeHistoryrefetch();
    //                 setIsRowSelected(false)
    //             }
    //         }

    //         else {
    //             toast.error("Record not selected", { position: "top-center", autoClose: 3000 })
    //         }

    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }

    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmploymentHistory({ selectRowID });
            // error handling 
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            // success call 
            toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
            setFormData({
                organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
                government_job: '', leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
                organization_address: '', job_district: '', employee: id
            })
            employeeHistoryrefetch();
            setIsRowSelected(false)

        } catch (err) {
            console.error('Error Deleting Record:', err);
            toast.error(err.message, { position: "top-center", autoClose: 3000 });
        }
    }

    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="Employment History" breadcrumbItem="Employee / Employment History" />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={(e) => (resetForm())} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}

                </Box>
            </Box>

            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {employeeHistory && employeeHistory.results && employeeHistory.results.length > 0 ? (employeeHistory.results.map((record, index) => (
                            <Box key={record.id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                                <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.organization_name}</Typography>
                                <Typography variant="body2" color="initial">{record.position_held}</Typography>
                            </Box>
                        ))) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Employee History</Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2, }}>
                            <HeadingBar title="Employment History" />
                        </Grid>
                        <Grid container columnSpacing={6} sx={{ px: 2 }}>


                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                <InputField name="organization_name" mandatory={true} label="Firm Name" disabled={disableFields} placeholder="Enter Organization Name" type="text" value={formData.organization_name} onChange={handleChange} fullWidth />
                                <InputField name="position_held" label="Position Held" disabled={disableFields} mandatory={true} placeholder="Enter Position Held" type="text" value={formData.position_held} onChange={handleChange} fullWidth />
                                <InputField name="organization_contact_number" disabled={disableFields} label="Firm Contact" placeholder="Enter Organization Contact Number" type="text" value={formData.organization_contact_number} onChange={handleChange} fullWidth />
                                <InputField name="organization_address" disabled={disableFields} label="Firm Address" mandatory={true} placeholder="Enter Organization Address" type="text" value={formData.organization_address} onChange={handleChange} fullWidth />
                                <Grid container columnSpacing={2}>
                                    <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }} >
                                        <Box className="inputBox" >
                                            <Typography sx={{ display: 'flex', marginTop: "3.3px", mr: "11px" }} >Government Job:</Typography>
                                            <Switch sx={{ ml: 3.7 }} size="small" disabled={disableFields} checked={formData.government_job} onClick={(e) => { setFormData((prevData) => ({ ...prevData, government_job: !formData.government_job })); }} name='active' />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                {employeeJobDistrict && employeeJobDistrict.results ?
                                    <div>
                                        <InputField name="job_district " label="Job District " mandatory={true} disabled={disableFields} placeholder="Enter Job District " type="text" value={districtName} isShowIcon={true} onChange={handleChange} fullWidth onClick={() => { setDistrictDialog(true) }} />
                                        <Multi_Dropdown isOpen={districtDialog} onClose={() => setDistrictDialog(false)} MinimumWidth={'600px'} tableRows={employeeJobDistrict.results} tableHeader={JobDistrictHeader} onSelect={jobDistrictClickHandler} RowFilterWith='id' />
                                    </div> :
                                    <InputField name="job_district " label="Job District " disabled={disableFields} placeholder="Enter Job District " type="text" value={formData.job_district.district_name} isShowIcon={true} onChange={handleChange} fullWidth />}
                                <InputField name="employment_start_date" label=" Start Date" disabled={disableFields} mandatory={true} placeholder="Enter Employment Start Date" type="date" value={formData.employment_start_date} onChange={handleChange} fullWidth />
                                <InputField name="employment_end_date" label="End Date" disabled={disableFields} mandatory={true} placeholder="Enter Employment End Date" type="date" value={formData.employment_end_date} onChange={handleChange} fullWidth />
                                <InputField name="leaving_reason" label="Leaving Reason" disabled={disableFields} mandatory={true} placeholder="Enter Leaving Reason" type="text" value={formData.leaving_reason} onChange={handleChange} fullWidth />

                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>

                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard />
                </Grid>
            </Grid>
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '400px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: '2px solid ${theme.palette.primary.light}', borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: '2px solid ${theme.palette.error.light}', borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>

        </div >


    )
}

export default History_Form
