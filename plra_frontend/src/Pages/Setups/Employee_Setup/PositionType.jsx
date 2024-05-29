import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Typography, Box, Dialog, Grid } from '@mui/material';
import { Warning } from '../../../Assets/Icons';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import {
  useDeletePositionTypeMutation, useGetPositionTypeQuery, usePostPositionTypeMutation,
  useUpdatePositionTypeMutation
} from '../../../Features/API/API';
import { toast } from 'react-toastify';
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const PositionType = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // States
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ position_type_name: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data, isLoading, isError, error, refetch } = useGetPositionTypeQuery();
  const [postPositionType] = usePostPositionTypeMutation();
  const [updatePositionType] = useUpdatePositionTypeMutation();
  const [deletePositionType] = useDeletePositionTypeMutation();

  // Functions
  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsRowSelected(false);
    setFormData({ position_type_name: '' });
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      position_type_name: event.row.position_type_name
    });
    setSelectedRowID(event.row.p_t_rec_id);
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deletePositionType({ selectRowID });
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
  }, [deletePositionType, selectRowID, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    try {
      const res = await postPositionType(formData);
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
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }, [formData, postPositionType, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updatePositionType({ selectRowID, updatePositionTypeData: formData });
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
  }, [selectRowID, formData, updatePositionType, refetch]);

  // const handleApiError = useCallback((error) => {
  //   if (error.status === 400) {
  //     toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
  //   } else if (error.status === 500) {
  //     toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
  //   } else if (error.status === 409) {
  //     toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 });
  //   } else {
  //     toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
  //   }
  // }, []);

  // Columns
  const columns = useMemo(() => [{
    field: "position_type_name",
    headerName: "Position Type",
    flex: 1,
    renderCell: (params) => {
      const onView = () => { handleRowClick(params) };
      return (
        <span onClick={onView} className='table_first_column'>{params.value}</span>
      );
    },
  }], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Position Type</Typography>
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
        <Grid container columnSpacing={8} spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 4 }}>
            <InputField name="position_type_name" label="Position Type" placeholder="Select Position Type" type="text" value={formData.position_type_name || ""} onChange={handleChange} mandatory error={formErrors?.data?.position_type_name} />
          </Grid>
        </Grid>
      </form>

      {isLoading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {isError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              data && data?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={data.results}
                  customPageSize={10}
                  RowFilterWith="p_t_rec_id"
                  onRowClick={handleRowClick}
                  outerCSS={{ mt: 4 }}
                  minHeight={"calc(100vh - 368px)"}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  );
};

export default PositionType;
