import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from "@emotion/react";
import { Btn, InputField, Multi_Dropdown, MyTableContainer, Loader, ErrorHandler } from "../../../Components/index";
import { PpgLevelHeader } from "../../../Data/Setup_Data/Setup_Data";
import {
  useGetJobQuery, useGetPpgLevelQuery, usePostJobMutation,
  useUpdateJobMutation, useDeleteJobMutation
} from "../../../Features/API/API";
import { toast } from 'react-toastify';
import { Warning } from '../../../Assets/Icons';

const Job = () => {
  const theme = useTheme();

  // States
  const [formData, setFormData] = useState({ job_title: '', job_abbrivation: '', no_of_seniority_level: '', ppg_level: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [ppgLevelDialog, setPpgLevelDialog] = useState(false);
  const [ppgLevelData, setppgLevelData] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const {
    data: jobData,
    isLoading: jobLoading,
    isError: jobRefreshError,
    error: jobQueryError,
    refetch: refetchJob,
  } = useGetJobQuery();

  const {
    data: ppgdata,
    isLoading: ppgloading,
    isError: ppgrefreshError,
    error: ppgqueryError,
  } = useGetPpgLevelQuery();

  const [postJob] = usePostJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  // Callbacks
  const resetForm = useCallback(() => {
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
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const ppgLevelClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, ppg_level: selectedRow.ppg_rec_id });
    setppgLevelData(selectedRow.ppg_level);
    setPpgLevelDialog(false);
  }, [formData]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.job_title === '' || formData.job_abbrivation === '' || formData.no_of_seniority_level === '' || formData.ppg_level === '') {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await postJob(formData);
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
          } else {
            toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
          }
        } else {
          toast.success("Job created successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ job_title: '', job_abbrivation: '', no_of_seniority_level: '', ppg_level: '' });
          setppgLevelData("");
          resetForm();
          refetchJob();
        }
      } catch (err) {
        console.error("Error creating Job:", err);
      }
    }
  }, [formData, postJob, resetForm, refetchJob]);

  const handleDeleteData = useCallback(async () => {
    try {
      // Call API
      const res = await deleteJob({ selectRowID });
      // Error handling 
      if (res.error) {
        if (res.error.status === 500) {
          return toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 409) {
          return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 });
        } else {
          return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
        }
      }
      // Success case 
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ job_title: '', job_abbrivation: '', no_of_seniority_level: '', ppg_level: '' });
      resetForm();
      setppgLevelData("");
      setIsRowSelected(false);
      refetchJob();
    } catch (err) {
      console.error('Error Deleting Job', err);
    }
  }, [deleteJob, selectRowID, resetForm, refetchJob]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateJob({ selectRowID, updateJobData: formData });
      // Error handling
      if (res.error) {
        if (res.error.status === 400) {
          return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 500) {
          return toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 409) {
          return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 });
        } else {
          return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
        }
      }
      // Success case
      toast.success("Job Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ job_abbrivation: '', no_of_seniority_level: '', ppg_level: '', job_title: '' });
      resetForm();
      setppgLevelData("");
      refetchJob();
    } catch (err) {
      console.error("Error updating Job:", err);
    }
  }, [updateJob, selectRowID, formData, resetForm, refetchJob]);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'job_title', headerName: 'Job Title', minWidth: 250, renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>
        );
      },
    },
    { field: 'job_abbrivation', headerName: 'Job Alias', minWidth: 150 },
    { field: 'ppg_level', headerName: 'PPG', minWidth: 150, renderCell: (params) => { return (<span>{params.row.ppg_level.ppg_level}</span>) } },
    { field: 'no_of_seniority_level', headerName: 'Number of Job Level', minWidth: 220 },
  ], [handleRowClick]);

  return (
    <div>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, alignItems: 'center' }} gap={2} >
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
          <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
          <Btn type='delete' onClick={handleDeleteDialog} />
          <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
            <Box sx={{ minWidth: '400px', p: 2 }}>
              <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
              </Box>
            </Box>
          </Dialog>
        </Box>

        <form action="">
          <Grid container columnSpacing={8} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              <InputField name="job_title" label="Job Title" placeholder="Enter Job Title" type="text" value={formData.job_title} onChange={handleChange} mandatory />
              <InputField name="job_abbrivation" label="Job Alias" placeholder="Enter Job Alias" type="text" value={formData.job_abbrivation} onChange={handleChange} mandatory />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {ppgdata && ppgdata.results ?
                <div>
                  <InputField name="ppg_level" label="PPG" placeholder="Select PpgLevel" value={ppgLevelData} isShowIcon={true} onClick={() => setPpgLevelDialog(true)} mandatory />
                  <Multi_Dropdown isOpen={ppgLevelDialog} onClose={() => setPpgLevelDialog(false)} tableRows={ppgdata.results} tableHeader={PpgLevelHeader} onSelect={ppgLevelClickHandler} RowFilterWith={"ppg_rec_id"} MinimumWidth={'350px'} />
                </div>
                :
                <InputField name="ppg_level" label="Ppg Level" placeholder="Select PpgLevel" value={formData.ppg_level || ""} isShowIcon={true} onClick={() => setPpgLevelDialog(true)} />
              }
              <InputField name="no_of_seniority_level" label="Number of Job Level" placeholder="Enter Job Level Seniority" type="text" value={formData.no_of_seniority_level} onChange={handleChange} mandatory />
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
                    minHeight={"calc(100vh - 400px)"}
                  />
                ) : null
              )}
          </>
        )}



        <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '350px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to update your data.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Fragment>
    </div >
  );
}

export default Job;
