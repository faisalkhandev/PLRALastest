import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Btn, InputField, HeadingBar, DialogBox } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import {
    useGetEmployeeTrainingQuery,
    usePostEmployeeTrainingMutation,
    useUpdateEmployeeTrainingMutation, useDeleteEmployeeTrainingMutation
} from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'


const TraningForm = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams()

    const goBack = () => {
        window.history.go(-1);
    };

    //States
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [formData, setFormData] = useState({
        training_topic: null, training_nature: null, training_start_date: null, training_end_date: null, status: null, score_required_to_pass: null,
        obtained_score: null, remarks: null, employee: parseInt(id)
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
    useEffect(() => {
        refetch();
    }, [])

    const handleUpdateData = async (e) => {
        e.preventDefault();
        try {
            const res = await updateEmployeeTraining({ selectRowID, updateEmployeeTrainingData: formData });
            if (res?.error && res.error.status) {
                if (res?.error?.status === 422 && res?.error?.data?.code) {
                    return (showToast(`${res?.error?.data?.detail}`, "error"));
                }
                if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                    return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                }
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            else {
                refetch();
                showToast(`Record updated Successfully`, "success");
            }
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    };

    const handleAddNewTraining = async (e) => {
        if (isRowSelected) {
            try {
                const res = await updateEmployeeTraining({ selectRowID, updateEmployeeTrainingData: formData });
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                }
                else {
                    refetch();
                    showToast(`Record updated Successfully`, "success");
                    resetForm()
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
        else {


            try {
                const res = await postEmployeeTraining(formData);
                if (res?.error && res.error.status) {
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    // Handle API errors here
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                } else {
                    showToast(`Record created Successfully`, "success");
                    resetForm();
                    refetch();
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
    };

    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmployeeTraining({ selectRowID });
            // error handling
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            // success call
            showToast(`Record Deleted Successfully`, "success");
            setFormData({
                training_topic: '', training_nature: '', training_start_date: '', training_end_date: '', status: '', score_required_to_pass: '',
                obtained_score: '', remarks: '', employee: id
            })
            refetch();
            setIsRowSelected(false)

        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    }

    const resetForm = () => {
        setFormErrors({});
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
                    {/* <Btn type={'save'} onClick={handleAddNewTraining} /> */}

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
                            <p>No data available.</p>
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
                                    <InputField name="training_topic" label="Topic" disabled={disableFields} placeholder="Enter Training Topic" type="text" value={formData.training_topic} onChange={(e) => handleInputChange(e, "training_topic")} mandatory fullWidth error={formErrors?.data?.training_topic} />
                                    <InputField name="training_nature" label="Training Nature" disabled={disableFields} placeholder="Enter Training Nature" type="text" value={formData.training_nature} onChange={(e) => handleInputChange(e, "training_nature")} mandatory fullWidth error={formErrors?.data?.training_nature} />
                                    <InputField name="training_start_date" label="Start Date" disabled={disableFields} placeholder="Enter Training Start Date" type="date" value={formData.training_start_date} onChange={(e) => handleInputChange(e, "training_start_date")} mandatory fullWidth error={formErrors?.data?.training_start_date} />
                                    <InputField name="training_end_date" label="End Date" disabled={disableFields} placeholder="Enter Training End Date" type="date" value={formData.training_end_date} onChange={(e) => handleInputChange(e, "training_end_date")} mandatory fullWidth error={formErrors?.data?.training_end_date} />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="status" label=" Status" disabled={disableFields} placeholder="Enter Status " type="text" value={formData.status} onChange={(e) => handleInputChange(e, "status")} mandatory fullWidth error={formErrors?.data?.status} />
                                    <InputField name="score_required_to_pass" disabled={disableFields} label="Passing Score" placeholder="Enter Score Required to Pass" type="text" value={formData.score_required_to_pass} onChange={(e) => handleInputChange(e, "score_required_to_pass")} mandatory fullWidth error={formErrors?.data?.score_required_to_pass} />
                                    <InputField name="obtained_score" disabled={disableFields} label="Obtained Score " placeholder="Enter Obtained Score " type="text" value={formData.obtained_score} onChange={(e) => handleInputChange(e, "obtained_score")} mandatory={true} fullWidth error={formErrors?.data?.obtained_score} />
                                    <InputField name="remarks" disabled={disableFields} label="Remarks" placeholder="Enter Remarks..." type="text" value={formData.remarks} onChange={(e) => handleInputChange(e, "remarks")} mandatory fullWidth error={formErrors?.data?.remarks} />
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard userId={id} title="Processess" />

                </Grid>
            </Grid>
        </div>
    );
};

export default TraningForm