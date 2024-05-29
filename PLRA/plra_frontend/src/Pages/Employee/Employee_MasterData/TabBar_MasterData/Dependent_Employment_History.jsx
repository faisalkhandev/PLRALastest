import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, HeadingBar, DialogBox } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import { JobDistrictHeader } from "../../../../Data/Setup_Data/Setup_Data";
import { RelationHeader } from '../../../../Data/Setup_Data/Setup_Data'
import {
    useGetRelationQuery, useUpdateDependentEmployementHistoryMutation,
    useGetDependentEmployementHistoryQuery, usePostDependentEmployementHistoryMutation,
    useGetJobDistrictQuery, useDeleteDependentEmployementHistoryMutation
} from '../../../../Features/API/API'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'



const Dependent_Employment_History = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams();
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [formData, setFormData] = useState({
        organization_name: null, position_held: null, employment_start_date: null,
        government_job: false, noc_from_previous_employment: null, organization_contact_number: null,
        organization_address: null, job_district: null, employee: id, spouse_dependent: null
    });
    const [selectRowID, setSelectedRowID] = useState(null);
    const [districtName, setdistrictName] = useState("");
    const [relation, setRelation] = useState("");
    const [districtDialog, setDistrictDialog] = useState(false);
    const [relationDialog, setRelationDialog] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)
    const [editDialog, setEditDialog] = useState(false);
    const [checkbox, setCheckBox] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);



    //Queries
    const { data: spousedependent, isLoading: spousedependent_loading, isError: spousedependent_refreshError, error: spousedependent_queryError, refetch: spousedependent_refetch } = useGetRelationQuery(id);
    const { data: employeeJobDistrict, isLoading: employee_loading, isError: employee_refreshError, error: employee_queryError, refetch: employee_refetch } = useGetJobDistrictQuery();
    const { data: spousedependenthistory, isLoading: spousedependenthistoryloading, isError: spousedependenthistoryrefreshError, error: spousedependenthistoryqueryError, refetch: spousedependentHistoryrefetch } = useGetDependentEmployementHistoryQuery(id);
    const [updateDependentHistoryData] = useUpdateDependentEmployementHistoryMutation();
    const [postDependentHistory] = usePostDependentEmployementHistoryMutation();
    const [deleteDependentEmploymentHistory] = useDeleteDependentEmployementHistoryMutation();

    //Functions
    useEffect(() => {
        spousedependent_refetch();
        employee_refetch();
        spousedependentHistoryrefetch();
    }, [])


    //Employee Dialog Click Listeners
    const jobDistrictClickHandler = (selectedRow) => {
        setdistrictName(selectedRow.district_name)
        setFormData({ ...formData, job_district: selectedRow.id, });
        console.log(formData.job_district);
        setDistrictDialog(false);
    };

    const RelationClickHandler = (selectedRow) => {
        console.log("rowsl", selectedRow);
        setRelation(selectedRow.full_name)
        setFormData({ ...formData, spouse_dependent: selectedRow.fimaly_rec_id, });
        setRelationDialog(false);
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
        console.log("iops", record.spouse_dependent.fimaly_rec_id);
        setIsRowSelected(true)
        setActiveBoxIndex(index);
        setSelectedRowID(record.d_e_h_rec_id)
        setFormData({
            organization_name: record.organization_name, position_held: record.position_held, employment_start_date: record.employment_start_date, employment_end_date: record.employment_end_date,
            government_job: record.government_job, leaving_reason: record.leaving_reason, noc_from_previous_employment: record.noc_from_previous_employment, organization_contact_number: record.organization_contact_number,
            organization_address: record.organization_address, job_district: record.job_district.id, employee: record.employee, spouse_dependent: record.spouse_dependent.fimaly_rec_id
        })
        setdistrictName(record.job_district.district_name);
        setRelation(record.spouse_dependent.full_name)
        setCheckBox(formData.government_job)
        setfieldsDisable(true)
    };

    const resetForm = () => {
        setFormErrors({});
        setSelectedRowID(null);
        setIsRowSelected(false);
        setRelation("")
        setActiveBoxIndex(null);
        setdistrictName("");
        setfieldsDisable(false);
        setFormData({
            organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
            government_job: false, leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
            organization_address: '', job_district: '', employee: id, spouse_dependent: ''
        })
    };

    const handlePostData = async (e) => {
        if (isRowSelected) {
            try {
                const res = await updateDependentHistoryData({ selectRowID, updateDependentEmployeeHistory: formData });
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                } else {
                    showToast(`Record updated Successfully`, "success");
                    spousedependentHistoryrefetch();
                    resetForm();
                }
            }
            catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
        else {
            try {

                const res = await postDependentHistory(formData);
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    // Handle API errors here
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                } else {
                    spousedependentHistoryrefetch();
                    showToast(`Record created Successfully`, "success");
                    resetForm();
                }
            }
            catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
    }


    const handleDeleteData = async (e) => {
        try {
            // call api
            console.log("jhgsd", selectRowID);
            const res = await deleteDependentEmploymentHistory(selectRowID);
            // error handling 
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            // success call 
            showToast(`Record Deleted Successfully`, "success");
            setFormData({
                organization_name: '', position_held: '', employment_start_date: '', employment_end_date: '',
                government_job: '', leaving_reason: '', noc_from_previous_employment: '', organization_contact_number: '',
                organization_address: '', job_district: '', employee: id, spouse_dependent: null
            })
            resetForm();
            spousedependentHistoryrefetch();
            setIsRowSelected(false)
            setRelation("")
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    }


    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="Dependent Employment History" breadcrumbItem="Employee / Dependent Employment History" />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={(e) => (resetForm())} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
                    {
                        deleteDialog ?
                            <DialogBox
                                open={deleteDialog}
                                onClose={() => setDeleteDialog(false)}
                                closeClick={() => setDeleteDialog(false)}
                                sureClick={() => { handleDeleteData(); setDeleteDialog(false); }}
                                title={"Are you sure you want to delete the record?"}
                            /> : ''
                    }

                </Box>
            </Box>

            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {spousedependenthistory && spousedependenthistory.results && spousedependenthistory.results.length > 0 ? (spousedependenthistory.results.map((record, index) => (
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
                                <InputField name="organization_name" mandatory={true} label=" Name" disabled={disableFields} placeholder="Enter Organization Name" type="text" value={formData.organization_name} onChange={handleChange} fullWidth error={formErrors?.data?.organization_name} />
                                <InputField name="position_held" label="Position Held" disabled={disableFields} mandatory={true} placeholder="Enter Position Held" type="text" value={formData.position_held} onChange={handleChange} fullWidth error={formErrors?.data?.position_held} />
                                <InputField name="organization_contact_number" disabled={disableFields} label="Contact" mandatory={true} placeholder="Enter Organization Contact Number" type="text" value={formData.organization_contact_number} onChange={handleChange} fullWidth error={formErrors?.data?.organization_contact_number} />
                                <InputField name="organization_address" disabled={disableFields} label=" Address" mandatory={true} placeholder="Enter Organization Address" type="text" value={formData.organization_address} onChange={handleChange} fullWidth error={formErrors?.data?.organization_address} />
                                {spousedependent && spousedependent.results ?
                                    <div>
                                        <InputField name="Relation " label="Relation" mandatory={true} disabled={disableFields} placeholder="Enter Relationss " type="text" value={relation} isShowIcon={true} onChange={handleChange} fullWidth onClick={() => { setRelationDialog(true) }} error={formErrors?.data?.spouse_dependent} />
                                        <Multi_Dropdown isOpen={relationDialog} onClose={() => setRelationDialog(false)} MinimumWidth={'600px'} tableRows={spousedependent.results} tableHeader={RelationHeader} onSelect={RelationClickHandler} RowFilterWith='fimaly_rec_id' />
                                    </div> :
                                    <InputField name="Relation " label="Relation " disabled={disableFields} placeholder="Enter Relation" type="text" value={formData?.spouse_dependent?.full_name} isShowIcon={true} onChange={handleChange} fullWidth error={formErrors?.data?.spouse_dependent} />}
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                {employeeJobDistrict && employeeJobDistrict.results ?
                                    <div>
                                        <InputField name="job_district " label="Job District " mandatory={true} disabled={disableFields} placeholder="Enter Job District " type="text" value={districtName} isShowIcon={true} onChange={handleChange} fullWidth onClick={() => { setDistrictDialog(true) }} error={formErrors?.data?.job_district} />
                                        <Multi_Dropdown isOpen={districtDialog} onClose={() => setDistrictDialog(false)} MinimumWidth={'600px'} tableRows={employeeJobDistrict.results} tableHeader={JobDistrictHeader} onSelect={jobDistrictClickHandler} RowFilterWith='id' />
                                    </div> :
                                    <InputField name="job_district " label="Job District" disabled={disableFields} placeholder="Enter Job District " type="text" value={formData.job_district?.district_name} isShowIcon={true} onChange={handleChange} fullWidth error={formErrors?.data?.job_district} />}
                                <InputField name="employment_start_date" label=" Start Date" disabled={disableFields} mandatory={true} placeholder="Enter Employment Start Date" type="date" value={formData.employment_start_date} onChange={handleChange} fullWidth error={formErrors?.data?.employment_start_date} />
                                <InputField name="employment_end_date" label="End Date" disabled={disableFields} mandatory={false} placeholder="Enter Employment End Date" type="date" value={formData.employment_end_date} onChange={handleChange} fullWidth error={formErrors?.data?.employment_end_date} />

                                <InputField name="leaving_reason" label="Leaving Reason" disabled={disableFields} mandatory={false} placeholder="Enter Leaving Reason" type="text" value={formData.leaving_reason} onChange={handleChange} fullWidth error={formErrors?.data?.leaving_reason} />
                                <Grid container columnSpacing={2}>
                                    <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }} >
                                        <Box className="inputBox" >
                                            <Typography sx={{ display: 'flex', marginTop: "3.3px", mr: "11px" }} >Government Job:</Typography>
                                            <Switch sx={{ ml: 3.7 }} size="small" disabled={disableFields} checked={formData.government_job} onClick={(e) => { setFormData((prevData) => ({ ...prevData, government_job: !formData.government_job })); }} name='active' />
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>

                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard userId={id} title="Processess" />

                </Grid>
            </Grid>
        </div >
    )
}
export default Dependent_Employment_History
