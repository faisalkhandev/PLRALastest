import React, { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { Typography, Box, Grid, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from "../../../Components/index";
import {
  useGetJobLevelQuery, useGetJobQuery, usePostJobLevelMutation,
  useUpdateJobLevelMutation, useDeleteJobLevelMutation
} from "../../../Features/API/API";
import { JobHeader } from "../../../Data/Setup_Data/Setup_Data";
import { toast } from 'react-toastify';

const JobLevel = () => {
  const theme = useTheme();

  // States
  const [formData, setFormData] = useState({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobName, setJobName] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetJobLevelQuery();
  const { data: jobData, isLoading: jobLoading, isError: jobRefreshError, error: jobQueryError } = useGetJobQuery();
  const [postJobLevel] = usePostJobLevelMutation();
  const [updateJobLevel] = useUpdateJobLevelMutation();
  const [deleteJobLevel] = useDeleteJobLevelMutation();

  // Callbacks
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      job_abbrivation: event.row.job_abbrivation,
      job_abbrivation_seniority: event.row.job_abbrivation_seniority,
      job: event.row.job.j_rec_id
    });
    setJobName(event.row.job.job_title);
    setSelectedRowID(event.row.j_l_rec_id);
  }, []);

  const jobClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, job: selectedRow.j_rec_id });
    setJobName(selectedRow.job_title);
    setJobDialogOpen(false);
  }, [formData]);

  const resetForm = useCallback(() => {
    setIsRowSelected(false);
    setFormData({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
    setJobName("");
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.job_abbrivation === '' || formData.job_abbrivation_seniority === '' || formData.job === '') {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await postJobLevel(formData);
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
          } else {
            toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
          }
        } else {
          toast.success("JobLevel created successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
          setJobName("");
          refetch();
        }
      } catch (err) {
        console.error('Error creating JobLevel:', err);
      }
    }
  }, [formData, postJobLevel, refetch]);


  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateJobLevel({ selectRowID, updateJobLevelData: formData });
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
      toast.success("JobLevel Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
      setJobName("");
      refetch();
    } catch (err) {
      console.error('Error creating Job Level:', err);
    }
  }, [updateJobLevel, selectRowID, formData, refetch]);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'job_abbrivation', headerName: 'Job Level', flex: 1, renderCell: (params) => {
        const onView = () => { handleRowClick(params); };
        const concatenatedValue = `${params.value}_${params.row.job_abbrivation_seniority}`;
        return (<span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>{concatenatedValue}</span>);
      },
    },
    {
      field: 'job', headerName: 'Job', flex: 1,
      renderCell: (params) => {
        return (<span>{params.row.job.job_title}</span>)
      }
    },
  ], [handleRowClick]);

  return (
    <div>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job Level</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {jobData && jobData.results ?
                <div>
                  <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} mandatory InputState={true} />
                  <Multi_Dropdown isOpen={jobDialogOpen} onClose={() => setJobDialogOpen(false)} tableRows={jobData.results} tableHeader={JobHeader}
                    onSelect={jobClickHandler}
                    RowFilterWith={"j_rec_id"}
                    MinimumWidth={'500px'}
                  />
                </div>
                : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} InputState={true} />
              }
              <InputField name="job_abbrivation" label="Job Alias" placeholder="Enter Job Alias" type="text" value={formData.job_abbrivation} onChange={handleChange} style={{ textTransform: 'uppercase' }} mandatory InputState={true} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              <InputField name="job_abbrivation_seniority" label="Level" placeholder="Enter Job Level Seniority" type="text" value={formData.job_abbrivation_seniority} onChange={handleChange} mandatory InputState={true} />
              <InputField name="job_abbrivation_seniority" label="Job Level" value={formData.job_abbrivation + "_" + formData.job_abbrivation_seniority} InputState={true} />
            </Grid>
          </Grid>
        </form>

        {loading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {refreshError ? (<ErrorHandler online={navigator.onLine} />)
              : (
                data && data?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={data.results}
                    RowFilterWith="j_l_rec_id"
                    onRowClick={handleRowClick}
                    customPageSize={12}
                    minHeight={'calc(100vh - 400px)'}
                  />
                ) : null
              )}
          </>
        )}

        <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '350px', p: 2 }}>
            <Typography variant="h6" color="initial" >Do you want to update your data.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Fragment>
    </div>
  );
};

export default JobLevel;
