import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from "@emotion/react";
import { Btn, InputField, Multi_Dropdown, MyTableContainer, Loader, ErrorHandler, DialogBox } from "../../../Components/index";
import { PpgLevelHeader } from "../../../Data/Setup_Data/Setup_Data";
import {
  useGetJobQuery, useGetPpgLevelQuery, usePostJobMutation,
  useUpdateJobMutation, useDeleteJobMutation
} from "../../../Features/API/API";
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const Job = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // States
  const [formData, setFormData] = useState({ job_title: '', job_abbrivation: '', no_of_seniority_level: '', ppg_level: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [ppgLevelDialog, setPpgLevelDialog] = useState(false);
  const [ppgLevelData, setppgLevelData] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data: jobData, isLoading: jobLoading, isError: jobRefreshError, error: jobQueryError, refetch: refetchJob, } = useGetJobQuery();
  const { data: ppgdata, isLoading: ppgloading, isError: ppgrefreshError, error: ppgqueryError, } = useGetPpgLevelQuery();
  const [postJob] = usePostJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsRowSelected(false);
    setFormData({ job_title: '', job_abbrivation: '', no_of_seniority_level: '', ppg_level: '' });
    setppgLevelData("");
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      job_title: event.row.job_title,
      job_abbrivation: event.row.job_abbrivation,
      no_of_seniority_level: event.row.no_of_seniority_level,
      ppg_level: event.row.ppg_level.ppg_rec_id,
    });
    setppgLevelData(event.row.ppg_level.ppg_level);
    setSelectedRowID(event.row.j_rec_id);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  const ppgLevelClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, ppg_level: selectedRow.ppg_rec_id });
    setppgLevelData(selectedRow.ppg_level);
    setPpgLevelDialog(false);
  }, [formData]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    try {
      const res = await postJob(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record created Successfully`, "success");
      resetForm();
      refetchJob();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }, [formData, postJob, resetForm, refetchJob]);

  const handleDeleteData = useCallback(async () => {
    try {
      // Call API
      const res = await deleteJob({ selectRowID });
      // Error handling 
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record Deleted Successfully`, "success");
      resetForm();
      refetchJob();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }, [deleteJob, selectRowID, resetForm, refetchJob]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateJob({ selectRowID, updateJobData: formData });
      // Error handling
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record updated Successfully`, "success");
      resetForm();
      refetchJob();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }, [updateJob, selectRowID, formData, resetForm, refetchJob]);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'job_title', headerName: 'Job Title', minWidth: 250, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'job_abbrivation', headerName: 'Job Alias', minWidth: 150, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'ppg_level', headerName: 'PPG', minWidth: 150,
      valueGetter: (params) => params.row?.ppg_level?.ppg_level || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'no_of_seniority_level', headerName: 'Number of Job Level', minWidth: 220, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], [handleRowClick]);

  return (
    <div>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, alignItems: 'center' }} gap={2} >
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job</Typography>
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
          <Grid container columnSpacing={8} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              <InputField name="job_title" label="Job Title" placeholder="Enter Job Title" type="text" value={formData.job_title} onChange={handleChange} mandatory error={formErrors?.data?.job_title} />
              <InputField name="job_abbrivation" label="Job Alias" placeholder="Enter Job Alias" type="text" value={formData.job_abbrivation} onChange={handleChange} mandatory error={formErrors?.data?.job_abbrivation} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {ppgdata && ppgdata.results ?
                <div>
                  <InputField name="ppg_level" label="PPG" placeholder="Select PpgLevel" value={ppgLevelData} isShowIcon={true} onClick={() => setPpgLevelDialog(true)} error={formErrors?.data?.ppg_level} />
                  <Multi_Dropdown isOpen={ppgLevelDialog} onClose={() => setPpgLevelDialog(false)} tableRows={ppgdata.results} tableHeader={PpgLevelHeader} onSelect={ppgLevelClickHandler} RowFilterWith={"ppg_rec_id"} MinimumWidth={'350px'} />
                </div>
                :
                <InputField name="ppg_level" label="Ppg Level" placeholder="Select PpgLevel" value={formData.ppg_level || ""} isShowIcon={true} onClick={() => setPpgLevelDialog(true)} error={formErrors?.data?.ppg_level} />
              }
              <InputField name="no_of_seniority_level" label="Number of Job Level" placeholder="Enter Job Level Seniority" type="text" value={formData.no_of_seniority_level} onChange={handleChange} mandatory error={formErrors?.data?.no_of_seniority_level} />
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </form>

        {jobLoading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {jobRefreshError ? (<ErrorHandler online={navigator.onLine} />)
              : (
                jobData && jobData?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={jobData.results}
                    isAddNewButton={true}
                    RowFilterWith="j_rec_id"
                    onRowClick={handleRowClick}
                    customPageSize={9}
                    minHeight={"calc(100vh - 384px)"}
                  />
                ) : null
              )}
          </>
        )}
      </Fragment>
    </div >
  );
}

export default Job;
