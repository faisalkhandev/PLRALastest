import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
  useGetHrCalenderYearQuery, usePostHRCalenderYearMutation,
  useUpdateHRCalenderYearMutation, useDeleteHRCalenderYearMutation
}
  from '../../../Features/API/SetupApi'
import { useTheme } from '@emotion/react';
import { Box, Grid, Switch, Typography } from '@mui/material';
import { Btn, DialogBox, ErrorHandler, InputField, Loader, MyTableContainer } from '../../../Components';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
import { showToast } from '../../../Components/shared/Toast_Card';

const HR_Calender_Year = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});
  const [fieldsDisable, setfieldsDisable] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);



  //Query 
  const { data: hrCalenderYearData, isLoading: hrLoading, isError: hrRefreshError, error: hrQueryError, refetch: refetchHr } = useGetHrCalenderYearQuery();
  const [postHrCalenderYear] = usePostHRCalenderYearMutation();
  const [updateHrCalenderYear] = useUpdateHRCalenderYearMutation();
  const [deleteHrCalenderYear] = useDeleteHRCalenderYearMutation();


  //states

  const [formData, setFormData] = useState({
    hr_celander_starting_date: "", hr_celander_ending_date: "",
    active: true, hr_year: "",
  });

  //Functions
  const resetForm = () => {
    setFormErrors({});
    setFormData({
      hr_celander_starting_date: "", hr_celander_ending_date: "",
      active: true, hr_year: "",
    });
    setIsActive(true);
    setSelectedRowID(false);
  }

  useEffect(() => {
    refetchHr()
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      const res = await postHrCalenderYear(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res?.error?.status} />, 'error');
      } else {
        showToast(`Record created Successfully`, "success");
        resetForm()
        setFormData({
          hr_celander_starting_date: "", hr_celander_ending_date: "",
          active: true, hr_year: "",
        });
        refetchHr();
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updateHrCalenderYear({ id: selectRowID, updateData: formData });
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
        showToast(`Record updated Successfully`, "success");
        setfieldsDisable(false)
        setIsRowSelected(false)
        setFormData({
          hr_celander_starting_date: "", hr_celander_ending_date: "",
          active: true, hr_year: "",
        });
        setIsActive(false);
        refetchHr();

      }
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  const handleDeleteData = async (e) => {
    try {
      const res = await deleteHrCalenderYear({ selectRowID });
      if (res?.error && res?.error?.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record Deleted Successfully`, "success");
        setFormData({
          hr_celander_starting_date: "", hr_celander_ending_date: "",
          active: true, hr_year: "",
        });
        refetchHr();
        setIsActive(false);
        setIsRowSelected(false);
        setSelectedRowID(false);
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      hr_celander_starting_date: event?.row?.hr_celander_starting_date,
      hr_celander_ending_date: event?.row?.hr_celander_ending_date,
      active: event?.row?.active,
      hr_year: event?.row?.hr_year,
    });
    console.log(event.row.id);
    setIsRowSelected(true);
    setIsActive(event?.row?.active);
    setSelectedRowID(event?.row?.id);
  }, []);


  const columns = useMemo(() => [
    {
      field: 'hr_year', headerName: 'HR Year', minWidth: 150, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'hr_celander_starting_date', headerName: 'Starting Date', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'hr_celander_ending_date', headerName: 'Ending Date', minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'active', headerName: 'Active', width: 150,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      )
    },
  ], []);

  return (
    <>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>HR Calender Year</Typography>
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
              <InputField name="hr_celander_starting_date" label="Starting Date" onChange={handleChange} placeholder="Enter Starting Date" type="date" value={formData.hr_celander_starting_date} error={formErrors?.data?.hr_celander_starting_date} />
              <InputField name="hr_year" label="HR Year" onChange={handleChange} placeholder="Enter HR Year" type="number" value={formData.hr_year} mandatory error={formErrors?.data?.hr_year} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              <InputField name="hr_celander_ending_date" label="Ending Date" onChange={handleChange} placeholder="Enter Ending Date" type="date" value={formData.hr_celander_ending_date} error={formErrors?.data?.hr_celander_ending_date} />
              <Box className="inputBox" >
                <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} >Active: </Typography>
                <Switch sx={{ ml: 15 }} size="small" checked={isActive} disabled={fieldsDisable}
                  onClick={(e) => {
                    const handleIsActive = !isActive; setIsActive(handleIsActive);
                    setFormData((prevData) => ({ ...prevData, active: handleIsActive }));
                  }}
                  name='active' />
              </Box>
            </Grid>
          </Grid>
        </form>

        {hrLoading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {hrRefreshError ? (<ErrorHandler online={navigator.onLine} />)
              : (
                hrCalenderYearData && hrCalenderYearData?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={hrCalenderYearData?.results}
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
    </>
  )
}

export default HR_Calender_Year  