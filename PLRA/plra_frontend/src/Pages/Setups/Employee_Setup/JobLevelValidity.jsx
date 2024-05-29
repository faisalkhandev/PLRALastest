import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import {
  Typography, Box, Grid, Dialog,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import {
  useGetJobLevelValidityQuery, usePostJobLevelValidityMutation,
  useUpdateJobLevelValidityMutation, useDeleteJobLevelValidityMutation, useGetJobQuery,
  useGetJobLevelIDQuery,
} from '../../../Features/API/API';
import { toast } from 'react-toastify';
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
import { JobHeader, JobLevelHeader } from '../../../Data/Setup_Data/Setup_Data';
import { Warning } from '../../../Assets/Icons';

const JobLevelValidity = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

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
  } = useGetJobLevelIDQuery(selectedJob);


  const [updateJobLevelValidity] = useUpdateJobLevelValidityMutation();
  const [postJobLevelValidity] = usePostJobLevelValidityMutation();
  const [deleteJobLevelValidity] = useDeleteJobLevelValidityMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setFormErrors({});
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

  const jobClickHandler = (selectedRow) => {
    setFormData({ ...formData, job: selectedRow.j_rec_id });
    setJobName(selectedRow.job_title);
    setSelectedJob(selectedRow?.j_rec_id);
    setJobDialogOpen(false);
    setJobLevelDisable(false);
    setJobLevel('');
  };

  const jobLevelClickHandler = (selectedRow) => {
    setFormData({ ...formData, job_level: selectedRow.j_l_rec_id });
    setJobLevel(`${selectedRow.job_abbrivation}-${selectedRow.job_abbrivation_seniority}`);
    setIsJobLevelOpen(false);
  };

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
      return showToast('Record not Selected', 'error');
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
      valueGetter: (params) => params.row?.job_level?.job?.job_title || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'job_level',
      headerName: 'Job Level',
      minWidth: 250,
      valueGetter: (params) => { `${params.row?.job_level?.job_abbrivation}-${params.row?.job_level?.job_abbrivation_seniority}` },
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params?.row?.job_level?.job_abbrivation + "-" + params?.row?.job_level?.job_abbrivation_seniority}</span>
        );
      },
    },
    {
      field: 'validity',
      headerName: 'Duration In Months',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
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

    try {
      const res = await postJobLevelValidity(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record created Successfully`, "success");
        setFormData({ job_level: '', validity: '' });
        setJobLevel('');
        resetForm();
        refetch();
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  const handleUpdateData = async () => {
    try {
      const res = await updateJobLevelValidity({ selectRowID, updateJobLevelValidityData: formData });
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
      showToast(`Record updated Successfully`, "success");
      setFormData({ job_level: '', validity: '' });
      setJobLevel('');
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteJobLevelValidity({ selectRowID });
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record Deleted Successfully`, "success");
      setFormData({ job_level: '', validity: '' });
      setJobLevel('');
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  return (
    <>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 1, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job Level Validity</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
          <Btn onClick={isRowSelected ? () => setJobValidityDialog(true) : handleSaveData} type="save" />
          {
            setJobValidityDialog ?
              <DialogBox
                open={jobvaliditydialog}
                onClose={() => setJobValidityDialog(false)}
                closeClick={() => setJobValidityDialog(false)}
                sureClick={() => { handleUpdateData(); setJobValidityDialog(false); }}
                title={"Are you sure you want to update the record?"}
              /> : ''
          }
          <Btn type="delete" onClick={handleDeleteDialog} />
          {
            deleteDialog ?
              <DialogBox
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                closeClick={() => setDeleteDialog(false)}
                sureClick={() => { handleDelete(); setDeleteDialog(false); }}
                title={"Are you sure you want to delete the record?"}
              /> : ''
          }
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {Jobdata && Jobdata.results ?
                <div>
                  <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} error={formErrors?.data?.job} />
                  <Multi_Dropdown isOpen={jobDialogOpen} onClose={() => setJobDialogOpen(false)} tableRows={Jobdata.results} tableHeader={JobHeader} onSelect={jobClickHandler} RowFilterWith={"j_rec_id"} MinimumWidth={'500px'} />
                </div>
                : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} error={formErrors?.data?.job} />
              }
              {jobleveldata && jobleveldata.results ?
                <div>
                  <InputField name="job_level" label="Job Level " placeholder="Enter job level" value={joblevel || ''} type="text" isShowIcon={true} onClick={() => setIsJobLevelOpen(true)} disabled={jobLevelDisable} error={formErrors?.data?.job_level} />
                  <Multi_Dropdown RowFilterWith={"j_l_rec_id"} isOpen={isJoblevelOpen} onClose={() => setIsJobLevelOpen(false)} MinimumWidth={'600px'} tableHeader={jobValidityHeader} tableRows={jobleveldata.results} onSelect={jobLevelClickHandler} />
                </div>
                :
                <InputField name="job_level" label="Job Level " placeholder="Enter job level" value={joblevel || ''} type="text" isShowIcon={true} onClick={() => setIsJobLevelOpen(true)} disabled={jobLevelDisable} error={formErrors?.data?.job_level} />
              }
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              <InputField name="Validity" label="Duration In Months" placeholder="Enter Duration" type="number" value={formData.validity || ''} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} error={formErrors?.data?.validity} />
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
                    minHeight={'calc(100vh - 384px) '}
                  />
                ) : null
              )}
          </>
        )}
      </Fragment>
    </>
  )
}
export default JobLevelValidity