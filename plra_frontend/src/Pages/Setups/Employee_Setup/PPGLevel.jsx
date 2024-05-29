import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler, DialogBox } from "../../../Components/index";
import {
  useGetPpgLevelQuery, usePostPpgLevelMutation, useUpdatePpgLevelMutation,
  useDeletePpgLevelMutation,
} from '../../../Features/API/API';
import "../../Styles.css"
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const PPGLevel = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  //States
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ ppg_level: '', ppg_level_seniority: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetPpgLevelQuery();
  const [postPpgLevel] = usePostPpgLevelMutation();
  const [updatePpgLevel] = useUpdatePpgLevelMutation();
  const [deletePpgLevel] = useDeletePpgLevelMutation();


  // Callbacks
  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsRowSelected(false)
    setFormData({ ppg_level: '', ppg_level_seniority: '' })
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({ ppg_level: event.row.ppg_level, ppg_level_seniority: event.row.ppg_level_seniority });
    setSelectedRowID(event.row.ppg_rec_id);
  }, []);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.ppg_level_seniority < 0) {
      return showToast('PPG Level cannot be negative', 'error');
    }
    else {
      try {
        const res = await postPpgLevel(formData);
        if (res?.error && res.error.status) {
          if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
            return showToast(`${res?.error?.data?.non_field_errors}`, "error");
          }
          if (res?.error?.status === 422 && res?.error?.data?.code) {
            return (showToast(`${res?.error?.data?.detail}`, "error"));
          }
          setFormErrors(res?.error);
          return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        refetch();
        showToast('Record created Successfully', 'success');
        setFormData({ ppg_level: '', ppg_level_seniority: '' });
      } catch (err) {
        showToast(`${err.message}`, 'error');
      }
    }
  }, [formData]);


  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) { setDeleteDialog(true) }
    else { return showToast('Record not Selected', 'error'); }
  }, [isRowSelected]);

  const handleDeleteData = useCallback(async () => {
    try {
      // call api
      const res = await deletePpgLevel({ selectRowID });
      // error handling
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record Deleted Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }, [deletePpgLevel, selectRowID, setIsRowSelected, setFormData, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      // Call the API to update the record
      const res = await updatePpgLevel({ selectRowID, updatePpgData: formData });
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
      showToast(`Record updated Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }, [updatePpgLevel, selectRowID, setIsRowSelected, setFormData, refetch, formData]);

  const columns = useMemo(() => [
    {
      field: 'ppg_level_seniority',
      headerName: 'Pay Grade ID',
      minWidth: 140,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'ppg_level',
      headerName: 'PPG',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], [handleRowClick]);


  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Pay Grade</Typography>
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
        <Btn onClick={handleDeleteDialog} type="delete" />
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
        <Grid container columnSpacing={8} spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <InputField name="ppg_level_seniority" label="Pay Grade ID" placeholder="Enter PPG Seniority Level" type="number" value={formData.ppg_level_seniority} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.ppg_level_seniority} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField name="ppg_level" label="PPG" placeholder="Enter PPG Level" type="text" value={formData.ppg_level} onChange={handleChange} mandatory error={formErrors?.data?.ppg_level} />
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
                  isAddNewButton={true}
                  RowFilterWith="ppg_rec_id"
                  onRowClick={handleRowClick}
                  customPageSize={10}
                  minHeight={'calc(100vh - 336px)'}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  )
}

export default PPGLevel
