import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
    useGetAarPrescribedFormQuery, usePostAarPrescribedFormMutation,
    useUpdateAarPrescribedFormMutation, useDeleteAarPrescribedFormMutation
}
    from '../../../Features/API/SetupApi'
import { useTheme } from '@emotion/react';
import { Box, Grid, Switch, Typography } from '@mui/material';
import { Btn, DialogBox, ErrorHandler, InputField, Loader, Multi_Dropdown, MyTableContainer } from '../../../Components';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
import { showToast } from '../../../Components/shared/Toast_Card';
import { useGetJobQuery } from '../../../Features/API/API';

const AAR_Prescribed_Form = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
    const [fieldsDisable, setfieldsDisable] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null);
    const [jobName, setJobName] = useState("");
    const [jobTypeDialog, setjobTypeDialog] = useState(false);

    const [formData, setFormData] = useState({
        job: "", head_office: true,
    });


    //Query 
    const { data: AarPrescribedFormData, isLoading: AarPrescribedFormLoading, isError: AarPrescribedFormRefreshError, error: AarPrescribedFormQueryError, refetch: refetchAarPrescribedForm } = useGetAarPrescribedFormQuery();
    const { data: jobData, sLoading: jobLoading, isError: jobRefreshError, error: jobQueryError, refetch: RefetchJob } = useGetJobQuery();
    console.log("AAr DATA ", AarPrescribedFormData);
    const [postAarPrescribedForm] = usePostAarPrescribedFormMutation();
    const [updateAarPrescribedForm] = useUpdateAarPrescribedFormMutation();
    const [deleteAarPrescribedForm] = useDeleteAarPrescribedFormMutation();

    //Functions
    const resetForm = () => {
        setFormErrors({});
        setFormData({
            job: "", head_office: true,
        });
        setIsActive(true);
        setJobName("");
        setIsRowSelected(false);
        setSelectedRowID(false);
    }

    useEffect(() => {
        refetchAarPrescribedForm()
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const jobClickHandler = (selectedRow) => {
        setJobName(selectedRow.job_title)
        setFormData({ ...formData, job: selectedRow.j_rec_id, });
        setjobTypeDialog(false);
    };

    const handleDeleteDialog = (e) => {
        if (isRowSelected) {
            setDeleteDialog(true);
        }
        else {
            return showToast('Record not Selected', 'error');
        }
    }

    const handleSaveData = async (e) => {
        e.preventDefault();
        try {
            const res = await postAarPrescribedForm(formData);
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res?.error?.status} />, 'error');
            } else {
                showToast(`Record created Successfully`, "success");
                resetForm()
                setFormData({
                    job: "", head_office: true,
                });
                setJobName('');
                setIsActive(true);
                refetchAarPrescribedForm();
                setIsRowSelected(false);
            }
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    }

    const handleUpdateData = async (e) => {
        try {
            const res = await updateAarPrescribedForm({ id: selectRowID, updateData: formData });
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            } else {
                showToast(`Record updated Successfully`, "success");
                setfieldsDisable(false)
                setIsRowSelected(false)
                setFormData({
                    job: "", head_office: true,
                });
                setJobName('');
                setIsActive(true);
                refetchAarPrescribedForm();
                setIsRowSelected(false);

            }
        } catch (err) {
            showToast(`${err.message}`, "error");
        }
    };

    const handleDeleteData = async (e) => {
        try {
            const res = await deleteAarPrescribedForm({ selectRowID });
            if (res?.error && res?.error?.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            } else {
                showToast(`Record Deleted Successfully`, "success");
                setFormData({
                    job: "", head_office: true,
                });
                setJobName('');
                setIsActive(true);
                refetchAarPrescribedForm();
                setIsRowSelected(false);
            }
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    };

    const handleRowClick = useCallback((event) => {
        setIsRowSelected(true);
        setFormData({

            head_office: event?.row?.head_office,
            job: event.row.job.j_rec_id,
        });
        setJobName(event.row.job.job_title)
        setIsRowSelected(true);
        setIsActive(event?.row?.head_office);
        setSelectedRowID(event?.row?.id);
    }, []);

    const columns = useMemo(() => [

        {
            field: "job", headerName: "Job", width: 280,
            valueGetter: (params) => params?.row?.job?.job_title || '',
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'head_office', headerName: 'Head Office', width: 150,
            valueGetter: (params) => params?.row?.head_office || '',
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column' style={{ color: params?.value ? 'green' : 'red' }}>
                        {params?.value ? 'Active' : 'In-Active'}
                    </span>
                )
            }
        },
    ], []);

    const JobHeader = [
        { field: 'job_title', headerName: 'Job Title', minWidth: 200 },
        { field: 'ppg_level', headerName: 'PPG', minWidth: 130, renderCell: (params) => { return (<span>{params.row.ppg_level.ppg_level}</span>) } },
        { field: 'no_of_seniority_level', headerName: 'Number of Job Level', minWidth: 200 },
    ];

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>AAR Prescribed Form</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
                {
                    editDialog ?
                        <DialogBox
                            open={editDialog}
                            onClose={() => setEditDialog(false)}
                            closeClick={() => setEditDialog(false)}
                            sureClick={() => { handleUpdateData(); setEditDialog(false); }}
                            title={"Are you sure you want to update the record?"}
                        /> : ''
                }
                <Btn type='delete' onClick={handleDeleteDialog} />
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

            <form action="">
                <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                        {jobData && jobData.results ?
                            <div>
                                <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} disabled={fieldsDisable} onChange={handleChange} mandatory isShowIcon={true} onClick={() => { refetchAarPrescribedForm(), RefetchJob(), setjobTypeDialog(true) }} error={formErrors?.data?.job} />
                                <Multi_Dropdown isOpen={jobTypeDialog} onClose={() => setjobTypeDialog(false)} MinimumWidth={"500px"} tableRows={jobData.results} tableHeader={JobHeader} onSelect={jobClickHandler} RowFilterWith={"j_rec_id"} />
                            </div> : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} onChange={handleChange} isShowIcon={true} onClick={() => setjobTypeDialog(true)} error={formErrors?.data?.job} />
                        }
                        <Box className="inputBox" >
                            <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} >Head Office: </Typography>
                            <Switch sx={{ ml: 10.1 }} size="small" checked={isActive} disabled={fieldsDisable}
                                onClick={(e) => {
                                    const handleIsActive = !isActive; setIsActive(handleIsActive);
                                    setFormData((prevData) => ({ ...prevData, head_office: handleIsActive }));
                                }}
                                name='head_office' />
                        </Box>
                    </Grid>

                </Grid>
            </form>

            {AarPrescribedFormLoading ? (
                <Loader placement={{ marginTop: '-100px' }} />
            ) : (
                <>
                    {AarPrescribedFormRefreshError ? (<ErrorHandler online={navigator.onLine} />)
                        : (
                            AarPrescribedFormData && AarPrescribedFormData?.results ? (
                                <MyTableContainer
                                    columns={columns}
                                    data={AarPrescribedFormData?.results}
                                    isAddNewButton={true}
                                    RowFilterWith="id"
                                    onRowClick={handleRowClick}
                                    customPageSize={9}
                                    minHeight={"calc(100vh - 380px)"}
                                />
                            ) : null
                        )}
                </>
            )}
        </Fragment >
    )
}

export default AAR_Prescribed_Form