import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import { toast } from 'react-toastify';
import { showToast } from '../../../Components/Common/ToastCard'
import { useGetRegionQuery, usePostRegionMutation, useDeleteRegionMutation, useUpdateRegionMutation, } from '../../../Features/API/API';
import "../../Styles.css"
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const Region = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  //States
  const [formData, setFormData] = useState({ region_id: '', region_name: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null)
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);


  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetRegionQuery();
  const [postRegion] = usePostRegionMutation();
  const [updateRegion] = useUpdateRegionMutation();
  const [deleteRegion] = useDeleteRegionMutation();


  // function
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setFormData({ region_name: '', region_id: '' });
    setIsRowSelected(false);
  }, [setFormData, setIsRowSelected]);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({ region_id: event.row.region_id, region_name: event.row.region_name });
    setSelectedRowID(event.row.r_rec_id);
  }, [setIsRowSelected, setFormData, setSelectedRowID]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected, setDeleteDialog]);

  const handleDeleteData = useCallback(async () => {
    try {
      const res = await deleteRegion({ selectRowID });
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
  }, [deleteRegion, selectRowID, setFormData, setIsRowSelected, refetch]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    try {
      const res = await postRegion(formData);
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
      refetch();
    } catch (error) {
      showToast(`${err.message}`, "error");
    }
  }, [formData, postRegion, refetch, setFormData]);

  const handleUpdateData = useCallback(async (e) => {
    try {
      const res = await updateRegion({ selectRowID, updateRegionData: formData });
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
  }, [updateRegion, selectRowID, formData, setFormData, setIsRowSelected, refetch]);

  // Columns
  const columns = useMemo(() => [
    {
      field: 'region_id', headerName: 'Region ID', minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'region_name', headerName: 'Region', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    }
  ], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Region</Typography>
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
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="region_id" label="Region ID" placeholder="Enter Region ID" type="text" value={formData.region_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.region_id} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="region_name" label="Region" placeholder="Enter Region Name" type="text" value={formData.region_name} onChange={handleChange} mandatory error={formErrors?.data?.region_name} />
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
                  RowFilterWith="r_rec_id"
                  onRowClick={handleRowClick}
                  customPageSize={10}
                  minHeight={'calc(100vh - 337px)'}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  );
};

export default Region;