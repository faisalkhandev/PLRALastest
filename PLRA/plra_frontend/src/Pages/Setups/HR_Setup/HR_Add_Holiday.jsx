import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
  useGetHrAddHolidayQuery, usePostHrAddHolidayMutation,
  useUpdateHrAddHolidayMutation, useDeleteHrAddHolidayMutation
}
  from '../../../Features/API/SetupApi'
import { useTheme } from '@emotion/react';
import { Box, Grid, Typography } from '@mui/material';
import { Btn, DialogBox, ErrorHandler, InputField, Loader, MyTableContainer, SimpleDropDown } from '../../../Components';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
import { showToast } from '../../../Components/shared/Toast_Card';




const HR_Add_Holiday = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [fieldsDisable, setfieldsDisable] = useState(false);
  const [formData, setFormData] = useState({
    holiday_from_date: "", holiday_to_date: "",
    holiday_type: "", allowed_to: "",
  });

  //Query
  const { data: HrAddHolidayData, isLoading: hrAddHolidayLoading, isError: hrAddHolidayRefreshError, refetch: refetchhrAddHoliday } = useGetHrAddHolidayQuery();
  const [postHrAddHoliday] = usePostHrAddHolidayMutation();
  const [updateHrAddHoliday] = useUpdateHrAddHolidayMutation();
  const [deleteHrAddHoliday] = useDeleteHrAddHolidayMutation();

  //Functions
  const resetForm = () => {
    setFormErrors({});
    setFormData({
      holiday_from_date: "", holiday_to_date: "",
      holiday_type: "", allowed_to: "",
    });
    setIsActive(true);
    setIsRowSelected(false);
    setSelectedRowID("");
  }

  useEffect(() => {
    refetchhrAddHoliday()
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleDeleteDialog = () => {
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
      const res = await postHrAddHoliday(formData);
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
          holiday_from_date: "", holiday_to_date: "",
          holiday_type: "", allowed_to: "",
        });
        setIsRowSelected(false);
        refetchhrAddHoliday();
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }

  const handleUpdateData = async () => {
    try {
      const res = await updateHrAddHoliday({ id: selectRowID, updateData: formData });
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
          holiday_from_date: "", holiday_to_date: "",
          holiday_type: "", allowed_to: "",
        });
        setIsRowSelected(false);
        refetchhrAddHoliday();
      }
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  const handleDeleteData = async () => {
    try {
      const res = await deleteHrAddHoliday({ selectRowID });
      if (res?.error && res?.error?.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record Deleted Successfully`, "success");
        setFormData({
          holiday_from_date: "", holiday_to_date: "",
          holiday_type: "", allowed_to: "",
        });
        setIsRowSelected(false);
        resetForm();
        refetchhrAddHoliday();
        setSelectedRowID(false);
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      holiday_from_date: event?.row?.holiday_from_date,
      holiday_to_date: event?.row?.holiday_to_date,
      holiday_type: event?.row?.holiday_type,
      allowed_to: event?.row?.allowed_to,
    });
    setIsRowSelected(true);
    setSelectedRowID(event?.row?.id);
  }, []);

  const columns = useMemo(() => [
    {
      field: 'holiday_type', headerName: 'Holiday Type', minWidth: 180, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'holiday_from_date', headerName: 'Starting Date', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'holiday_to_date', headerName: 'Ending Date', minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'allowed_to', headerName: 'Allowed To', minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], []);

  const optionsAllowedTo = [
    { value: "Christianity", label: "Christianity" },
    { value: "Islam", label: "Islam" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Buddhism", label: "Buddhism" },
    { value: "Judaism", label: "Judaism" },
    { value: "All", label: "All" }
  ];


  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Add Holidays</Typography>
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
            <InputField name="holiday_from_date" label="Starting Date" onChange={handleChange} placeholder="Enter Starting Date" type="date" value={formData?.holiday_from_date || " "} error={formErrors?.data?.holiday_from_date} />
            <InputField name="holiday_type" label="Holiday Type" onChange={handleChange} placeholder="Enter Holiday Type" type="text" value={formData.holiday_type} mandatory error={formErrors?.data?.holiday_type} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="holiday_to_date" label="Ending Date" onChange={handleChange} placeholder="Enter Ending Date" type="date" value={formData?.holiday_to_date} error={formErrors?.data?.holiday_to_date} />
            {/* <InputField name="allowed_to" label="Allowed " onChange={handleChange} placeholder="Select Allowed " type="text" value={formData?.allowed_to} /> */}

            <SimpleDropDown name="allowed_to" label="Allowed To" isShowIcon={true} value={formData.allowed_to || ""} options={optionsAllowedTo} mandatory onChange={(event) => handleDropDownChange(event, "allowed_to")} error={formErrors?.data?.allowed_to} helperText={formErrors?.data?.allowed_to} />


          </Grid>

        </Grid>
      </form>

      {hrAddHolidayLoading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {hrAddHolidayRefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              HrAddHolidayData && HrAddHolidayData?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={HrAddHolidayData?.results}
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

export default HR_Add_Holiday