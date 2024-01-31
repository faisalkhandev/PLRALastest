import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Typography, Box, Grid, Dialog,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer, Loader , ErrorHandler } from '../../../Components/index';
import {
  useGetJobLevelValidityQuery, usePostJobLevelValidityMutation,
  useUpdateJobLevelValidityMutation, useDeleteJobLevelValidityMutation, useGetJobQuery,
  useGetJobLevelIDQuery,
} from '../../../Features/API/API';
import { toast } from 'react-toastify';
import { JobHeader } from '../../../Data/Setup_Data/Setup_Data';
import { Warning } from '../../../Assets/Icons';

const JobLevelValidity = () => {
  const theme = useTheme();

  // States
  const [jobvaliditydialog, setJobValidityDialog] = useState(false);
  const [isJoblevelOpen, setIsJobLevelOpen] = useState(false);
  const [jobName, setJobName] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [joblevel, setJobLevel] = useState(null);
  const [formData, setFormData] = useState({ job_level: '', validity: '', job: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [jobLevelDisable, setJobLevelDisable] = useState(true);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const {
    data: joblevelvaliditydata, isLoading: loading, isError: refreshError, error: queryError, refetch,
  } = useGetJobLevelValidityQuery();
  const { data: Jobdata, isLoading: loading1, isError: refreshError1, error: queryError1 } = useGetJobQuery();
  const {
    data: jobleveldata, isLoading: joblevelloading, isError: joblevelrefreshError, error: joblevelqueryError, joblevelrefetch,
  } = useGetJobLevelIDQuery({ selectedJob });
  const [updateJobLevelValidity] = useUpdateJobLevelValidityMutation();
  const [postJobLevelValidity] = usePostJobLevelValidityMutation();
  const [deleteJobLevelValidity] = useDeleteJobLevelValidityMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setIsRowSelected(false);
    setFormData({
      jobName: '',
      job_level: '',
      validity: '',
    });
    setJobLevel('');
    setJobName('');
    setJobLevelDisable(true);
  }, []);

  const jobClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, job: selectedRow.j_rec_id });
    setJobName(selectedRow.job_title);
    setSelectedJob(selectedRow.j_rec_id);
    setJobDialogOpen(false);
    setJobLevelDisable(false);
    setJobLevel('');
  }, [formData]);

  const jobLevelClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, job_level: selectedRow.j_l_rec_id });
    setJobLevel(`${selectedRow.job_abbrivation}_${selectedRow.job_abbrivation_seniority}`);
    setIsJobLevelOpen(false);
  }, [formData]);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      job_level: event.row.job_level.j_l_rec_id,
      validity: event.row.validity,
    });
    setJobLevel(event.row.job_level.job_abbrivation);
    setSelectedRowID(event.row.id);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error('Record not selected.', { position: 'top-center', autoClose: 3000 });
    }
  }, [isRowSelected]);

  // Memoized values
  const jobValidityHeader = useMemo(() => [
    {
      field: 'job_abbrivation',
      headerName: 'Job Level',
      flex: 1,
      renderCell: (params) => {
        const concatenatedValue = `${params.row.job_abbrivation}_${params.row.job_abbrivation_seniority}`;
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {concatenatedValue}
          </span>
        );
      },
    },
    { field: 'job_abbrivation_seniority', headerName: 'Level', flex: 1 },
    {
      field: 'job',
      headerName: 'Job',
      flex: 1,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params); };
        return (
          <span onClick={onView} className="table_first_column">{params.row.job.job_title}</span>
        );
      },
    },
  ], [handleRowClick]);

  const columns = useMemo(() => [
    {
      field: 'job_title',
      headerName: 'Job',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params.row.job_level?.job?.job_title}
          </span>
        );
      },
    },
    {
      field: 'job_level',
      headerName: 'Job Level',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {`${params.row.job_level.job_abbrivation}_${params.row.job_level.job_abbrivation_seniority}`}
          </span>
        );
      },
    },
    {
      field: 'validity',
      headerName: 'Duration In Months',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params.value}
          </span>
        );
      },
    },
  ], [handleRowClick]);

  // Effect to reset form on component mount
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Handlers
  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.job_level === '' || formData.validity === '') {
      toast.error("Mandatory field's should not be empty.", { position: 'top-center', autoClose: 3000 });
    } else {
      try {
        const res = await postJobLevelValidity(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error('ID already exists.'); }
          else { toast.error('Something is wrong!!!'); }
        } else {
          toast.success('Data create successfully.');
          setFormData({ job_level: '', validity: '' });
          setJobLevel('');
          refetch();
        }
      } catch (err) {
        console.error('Error creating Job Validity:', err);
      }
    }
  };

  const handleUpdateData = async () => {
    if (formData.job_level === '' || formData.validity === '') {
      toast.error("Mandatory field's should not be empty.", { position: 'top-center', autoClose: 3000 });
    } else {
      try {
        const res = await updateJobLevelValidity({ selectRowID, updateJobLevelValidityData: formData });
        if (res.error) {
          if (res.error.status === 400) { return toast.error('ID already exists.', { position: 'top-center', autoClose: 3000 }); }
          else if (res.error.status === 500) { return toast.error('Server is not working', { position: 'top-center', autoClose: 3000 }); }
          else if (res.error.status === 409) { return toast.error('Record updation failed due to linking.', { position: 'top-center', autoClose: 3000 }); }
          else { return toast.error('Unexpected Error Occurred', { position: 'top-center', autoClose: 3000 }); }
        }
        toast.success('Job Validity Updated successfully.');
        setFormData({ job_level: '', validity: '' });
        setJobLevel('');
        setIsRowSelected(false);
        refetch();
      } catch (err) {
        console.error('Error updating Job Validity:', err);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteJobLevelValidity({ selectRowID });
      if (res.error) {
        if (res.error.status === 500) { return toast.error('Server is not working', { position: 'top-center', autoClose: 3000 }); }
        else if (res.error.status === 409) { return toast.error('Record deletion failed due to linking.', { position: 'top-center', autoClose: 3000 }); }
        else { return toast.error('Unexpected Error Occurred', { position: 'top-center', autoClose: 3000 }); }
      }
      toast.success('Job Level Validity deleted.', { position: 'top-center', autoClose: 3000 });
      setFormData({ job_level: '', validity: '' });
      setJobLevel('');
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      console.error('Error deleting Job Level Validity:', err);
    }
  };

  return (
    <>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 1, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job Level Duration</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
          <Btn onClick={isRowSelected ? () => setjobvaliditydialog(true) : handleSaveData} type="save" />
          <Btn type="delete" onClick={handleDeleteDialog} />


          <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)} sx={{ m: 'auto' }}>
            <Box sx={{ minWidth: '400px', p: 2 }}>
              <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to delete your data.</Typography>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                <Btn type="sure" onClick={() => { handleDelete(); setdeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                <Btn type="close" onClick={() => setdeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
              </Box>
            </Box>
          </Dialog>
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {Jobdata && Jobdata.results ?
                <div>
                  <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setjobDialogOpen(true)} />
                  <Multi_Dropdown isOpen={jobDialogOpen} onClose={() => setjobDialogOpen(false)} tableRows={Jobdata.results} tableHeader={JobHeader} onSelect={jobClickHandler} RowFilterWith={"j_rec_id"} MinimumWidth={'500px'} />
                </div>
                : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setjobDialogOpen(true)} />
              }
              {jobleveldata && jobleveldata.results ?
                <div>
                  <InputField name="job_level" label="Job Level " placeholder="Enter job level" value={joblevel || ''} type="text" isShowIcon={true} onClick={() => setisJoblevelOpen(true)} disabled={jobLevelDisable} />
                  <Multi_Dropdown RowFilterWith={"j_l_rec_id"} isOpen={isJoblevelOpen} onClose={() => setisJoblevelOpen(false)} MinimumWidth={'600px'} tableHeader={job_validity_header} tableRows={jobleveldata.results} onSelect={jobLevelClickHandler} />
                </div>
                :
                <InputField name="job_level" label="Job Level " placeholder="Enter job level" value={joblevel || ''} type="text" isShowIcon={true} onClick={() => setisJoblevelOpen(true)} disabled={jobLevelDisable} />
              }
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              <InputField name="Validity" label="Duration In Months" placeholder="Enter Duration" type="number" value={formData.validity || ''} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} />
            </Grid>
          </Grid>
        </form>

        {loading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {refreshError ? (<ErrorHandler online={navigator.onLine} />)
              : (
                joblevelvaliditydata && joblevelvaliditydata?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={joblevelvaliditydata.results}
                    isAddNewButton={true}
                    RowFilterWith="id"
                    onRowClick={handleRowClick}
                    customPageSize={15}
                    minHeight={'calc(100vh - 360px) '}
                  />
                ) : null
              )}
          </>
        )}

        <Dialog open={jobvaliditydialog} onClose={() => setjobvaliditydialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '400px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to update your data.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleUpdateData(); setjobvaliditydialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setjobvaliditydialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Fragment>
    </>
  )
}
export default JobLevelValidity