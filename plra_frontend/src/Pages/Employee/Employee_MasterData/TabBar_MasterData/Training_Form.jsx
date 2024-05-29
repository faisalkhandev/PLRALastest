import React, { Fragment, useState, useEffect } from 'react'
import { Box, Grid, Typography, Dialog } from '@mui/material'
import { Btn, InputField, HeadingBar } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import { useGetEmployeeTrainingQuery, usePostEmployeeTrainingMutation, useUpdateEmployeeTrainingMutation, useDeleteEmployeeTrainingMutation } from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'
import { Warning } from '../../../../Assets/Icons/index.jsx'


const Training_Form = () => {
    const theme = useTheme();
    const { id } = useParams()

    const goBack = () => {
        window.history.go(-1);
    };

    //States
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [formData, setFormData] = useState({
        training_topic: '', training_nature: '', training_start_date: '', training_end_date: '', status: '', score_required_to_pass: '',
        obtained_score: '', remarks: '', employee: id
    });
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)


    //Queries:
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEmployeeTrainingQuery(id);
    const [postEmployeeTraining] = usePostEmployeeTrainingMutation();
    const [updateEmployeeTraining] = useUpdateEmployeeTrainingMutation();
    const [deleteEmployeeTraining] = useDeleteEmployeeTrainingMutation();
    //Functions
    const handleUpdateData = async (e) => {
        e.preventDefault();

        try {
            const res = await updateEmployeeTraining({ selectRowID, updateEmployeeTrainingData: formData });
            if (res.error.status === 400) {
                toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
            }
            else {
                refetch();
                toast.success("Employee Training Updated successfully.", { position: "top-center", autoClose: 3000 });
            }
        } catch (err) {
            console.error('Error updating Employee Training:', err);
        }
    };

    const handleAddNewTraining = async (e) => {


        if (isRowSelected) {
            try {
                const res = await updateEmployeeTraining({ selectRowID, updateEmployeeTrainingData: formData });
                if (res.error.status === 400) {
                    toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
                }
                else {
                    refetch();
                    toast.success("Employee Training Updated successfully.", { position: "top-center", autoClose: 3000 });
                    resetForm()
                }
            } catch (err) {
                console.error('Error updating Employee Training:', err);
            }
        }
        else {


            if (!formData.training_topic || !formData.status) {
                return toast.error("Mandatory fields should not be empty.", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
            try {
                const res = await postEmployeeTraining(formData);
                if (res.error.status === 400) {
                    toast.error("ID already exists.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                } else {
                    toast.success("Employee Training created successfully.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                    resetForm();
                    refetch();
                }
            } catch (err) {
                console.error('Error creating Employee Training', err);
            }
        }
    };

    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmployeeTraining({ selectRowID });
            // error handling 
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }

                else if (res.error.status >= 400 || res.error.status <= 500) { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            // success call 
            toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
            setFormData({
                training_topic: '', training_nature: '', training_start_date: '', training_end_date: '', status: '', score_required_to_pass: '',
                obtained_score: '', remarks: '', employee: id
            })
            refetch();
            setIsRowSelected(false)

        } catch (err) {
            console.error('Error Deleting Record:', err);
            toast.error(err.message, { position: "top-center", autoClose: 3000 });
        }
    }

    const resetForm = () => {
        setFormData({
            training_topic: '', training_nature: '', training_start_date: '', training_end_date: '', status: '', score_required_to_pass: '',
            obtained_score: '', remarks: '', employee: id
        });
    };

    const handleBoxClick = (record) => {
        setActiveTab(true);
        setIsRowSelected(true);
        setfieldsDisable(true)
        setSelectedRowID(record.training_rec_id);
        setIsRowSelected(true)
        setfieldsDisable(true)
        setActiveBoxIndex(record);
        console.log(record);

        setFormData({
            ...formData,
            training_topic: record.training_topic,
            training_nature: record.training_nature,
            training_start_date: record.training_start_date,
            training_end_date: record.training_end_date,
            status: record.status,
            score_required_to_pass: record.score_required_to_pass,
            obtained_score: record.obtained_score,
            remarks: record.remarks,
            employee: record.employee
        });
    };

    const handleInputChange = (event, fieldName) => {
        setFormData({
            ...formData,
            [fieldName]: event.target.value,
        });
    }


    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="Training" breadcrumbItem="Employee / Training" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={resetForm} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handleAddNewTraining} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}

                </Box >
            </Box >
            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {data && data.results && data.results.length > 0 ? (
                            data.results.map((record) => (
                                <Box key={record.training_rec_id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === record ? 'Box_Class' : ''} onClick={() => handleBoxClick(record)}>
                                    <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.training_topic}</Typography>
                                    <Typography variant="body2" color="initial">{record.status}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Training</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2, }} >
                            <HeadingBar title="Training Information" />
                        </Grid>
                        <form action='' onSubmit={handleUpdateData}>
                            <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="training_topic" label="Topic" disabled={disableFields} placeholder="Enter Training Topic" type="text" value={formData.training_topic} onChange={(e) => handleInputChange(e, "training_topic")} mandatory fullWidth />
                                    <InputField name="training_nature" label="Training Nature" disabled={disableFields} placeholder="Enter Training Nature" type="text" value={formData.training_nature} onChange={(e) => handleInputChange(e, "training_nature")} mandatory fullWidth />
                                    <InputField name="training_start_date" label="Start Date" disabled={disableFields} placeholder="Enter Training Start Date" type="date" value={formData.training_start_date} onChange={(e) => handleInputChange(e, "training_start_date")} mandatory fullWidth />
                                    <InputField name="training_end_date" label="End Date" disabled={disableFields} placeholder="Enter Training End Date" type="date" value={formData.training_end_date} onChange={(e) => handleInputChange(e, "training_end_date")} mandatory fullWidth />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="status" label=" Status " disabled={disableFields} placeholder="Enter Status " type="text" value={formData.status} onChange={(e) => handleInputChange(e, "status")} mandatory fullWidth />
                                    <InputField name="score_required_to_pass" disabled={disableFields} label="Passing Score" placeholder="Enter Score Required to Pass" type="text" value={formData.score_required_to_pass} onChange={(e) => handleInputChange(e, "score_required_to_pass")} mandatory fullWidth />
                                    <InputField name="obtained_score " disabled={disableFields} label="Obtained Score " placeholder="Enter Obtained Score " type="text" value={formData.obtained_score} onChange={(e) => handleInputChange(e, "obtained_score")} mandatory={true} fullWidth />
                                    <InputField name="remarks" disabled={disableFields} label="Remarks" placeholder="Enter Remarks..." type="text" value={formData.remarks} onChange={(e) => handleInputChange(e, "remarks")} mandatory fullWidth />
                                </Grid>
                            </Grid>
                        </form>
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
    );
};

export default Training_Form