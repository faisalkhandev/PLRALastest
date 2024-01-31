import React, { useState } from 'react'
import { Box, Typography, Grid, Dialog } from '@mui/material'
import { Btn, InputField, HeadingBar } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import SimpleDropdown from '../../../../Components/Common/SimpleDropDown'
import { useGetEmployeeReferenceQuery, usePostEmployeeReferenceMutation, useDeleteEmployeeReferenceMutation, useUpdateEmployeeReferenceMutation } from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'
import { Warning } from '../../../../Assets/Icons/index.jsx'

const References_Form = () => {

    //States
    const theme = useTheme();
    const { id } = useParams();
    const goBack = () => {
        window.history.go(-1);
    };
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)
    const [selectRowID, setSelectedRowID] = useState(null)
    const [isRowSelected, setIsRowSelected] = useState(false);

    const [formData, setFormData] = useState({
        referance_name: '', relation: '', company_name: '', Designation: '', years_known: '', phoneNumber: '', company_address: '', employee: id,
    });
    const [deleteDialog, setDeleteDialog] = useState(false);

    //Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEmployeeReferenceQuery(id);
    const [postEmployeeReference] = usePostEmployeeReferenceMutation();
    const [updateEmployeeReference] = useUpdateEmployeeReferenceMutation();
    const [deleteEmployeeReference] = useDeleteEmployeeReferenceMutation();

    //Functions
    const handleUpdateData = async (e) => {
        e.preventDefault();

    };
    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmployeeReference({ selectRowID });
            // error handling 
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status >= 400 || res.error.status <= 500) { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            // success call 
            toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
            setFormData({
                referance_name: '', relation: '', company_name: '', Designation: '', years_known: '', phoneNumber: '', company_address: '', employee: id,

            })
            refetch();
            setIsRowSelected(false)

        } catch (err) {
            console.error('Error Deleting Record:', err);
            toast.error(err.message, { position: "top-center", autoClose: 3000 });
        }
    };
    const handleAddNewReference = async (e) => {
        e.preventDefault();
        if (isRowSelected) {
            if (!formData.referance_name || !formData.company_name) {
                return toast.error("Mandatory fields should not be empty.", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
            try {
                const res = await updateEmployeeReference({ selectRowID, updateEmployeeReferenceData: formData });
                if (res.error.status === 400) {
                    toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
                }
                else {
                    refetch();
                    toast.success("Employee Reference Updated successfully.", { position: "top-center", autoClose: 3000 });
                    resetForm();
                }
            } catch (err) {
                console.error('Error updating Employee Reference:', err);
            }
        }
        else {
            if (!formData.referance_name || !formData.company_name) {
                return toast.error("Mandatory fields should not be empty.", { position: "top-center", autoClose: 3000, });
            }
            else {
                try {
                    const res = await postEmployeeReference(formData);
                    if (res.error.status === 400) {
                        toast.error("ID already exists.", {
                            position: "top-center",
                            autoClose: 3000,
                        });
                    } else {
                        refetch();
                        toast.success("Employee Reference created successfully.", {
                            position: "top-center",
                            autoClose: 3000,
                        });
                        resetForm();
                    }
                } catch (err) {
                    console.error('Error creating Employee Reference', err);
                }
            }
        }
    }


    const resetForm = () => {
        setIsRowSelected(false);
        setfieldsDisable(false)
        setActiveTab(false);
        setSelectedRowID("");
        setFormData({
            referance_name: '', relation: '', company_name: '', Designation: '', years_known: '', phoneNumber: '', company_address: '', employee: id,
        });
    };


    const handleBoxClick = (record) => {
        setActiveTab(true);
        setSelectedRowID(record.emp_ref_rec_id);
        setActiveBoxIndex(record);
        setIsRowSelected(true);
        setfieldsDisable(true)
        setFormData({
            ...formData,
            referance_name: record.referance_name,
            relation: record.relation,
            company_name: record.company_name,
            Designation: record.Designation,
            years_known: record.years_known,
            phoneNumber: record.phoneNumber,
            company_address: record.company_address,
        });
    };

    const handleInputChange = (event, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: event.target.value,
        });
    };

    const relations = [
        { value: 'supervisor', label: 'Former or Current Supervisor' },
        { value: 'employer', label: 'Former or Current Employee' },
        { value: 'coworker', label: 'Former or Current Co-Worker' },
        { value: 'professor', label: 'Former or Current Professor' },
    ];

    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="References" breadcrumbItem="Employee / References " />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={resetForm} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handleAddNewReference} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}

                </Box>
            </Box>
            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {data && data?.results && data?.results.length > 0 ? (
                            data.results.map((record) => (
                                <Box key={record.emp_ref_rec_id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === record ? 'Box_Class' : ''} onClick={() => handleBoxClick(record)}>
                                    <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.referance_name}</Typography>
                                    <Typography variant="body2" color="initial">{record.relation}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Reference</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2 }}>
                            <HeadingBar title="Employee Reference" />
                        </Grid>
                        <form action='' >
                            <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="referance_name " disabled={disableFields} label="Reference Name" placeholder="Enter Reference Name" type="text" value={formData.referance_name} onChange={(e) => handleInputChange(e, "referance_name")} mandatory fullWidth />
                                    <SimpleDropdown
                                        label="Relationship" disabled={disableFields}
                                        value={formData.relation}
                                        onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                        options={relations}
                                    />
                                    <InputField name="company_name " disabled={disableFields} label="Company Name" placeholder="Enter Company Name" value={formData.company_name} type="text" onChange={(e) => handleInputChange(e, "company_name")} mandatory fullWidth />
                                    <InputField name="company_address " disabled={disableFields} label="Company Address" placeholder="Enter Company Address" value={formData.company_address} type="text" onChange={(e) => handleInputChange(e, "company_address")} mandatory fullWidth />

                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="Designation" disabled={disableFields} label="Designation" placeholder="Designation" type="text" value={formData.Designation} onChange={(e) => handleInputChange(e, "Designation")} mandatory fullWidth />
                                    <InputField name="years_known " disabled={disableFields} label="Years Known" placeholder="Enter Years Known" type="number" value={formData.years_known} onChange={(e) => handleInputChange(e, "years_known")} mandatory fullWidth />
                                    <InputField name="phoneNumber" disabled={disableFields} label="Telephone" placeholder="Enter Telephone" type="text" value={formData.phoneNumber} onChange={(e) => handleInputChange(e, "phoneNumber")} mandatory fullWidth />
                                </Grid>
                            </Grid>
                        </form >
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

        </div>
    )
};


export default References_Form