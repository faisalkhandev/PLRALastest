import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Typography, Box, Dialog, Grid } from '@mui/material';
import { Warning } from '../../../Assets/Icons';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler } from '../../../Components/index';
import {
  useDeletePositionTypeMutation, useGetPositionTypeQuery, usePostPositionTypeMutation,
  useUpdatePositionTypeMutation
} from '../../../Features/API/API';
import { toast } from 'react-toastify';

const PositionType = () => {
  const theme = useTheme();

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
      if (res.error) {
        handleApiError(res.error);
      } else {
        toast.success("Position Type deleted.", { position: "top-center", autoClose: 3000 });
        setIsRowSelected(false);
        setFormData({ position_type_name: '' });
        refetch();
      }
    } catch (err) {
      console.error('Error deleting Position Type:', err);
    }
  }, [deletePositionType, selectRowID, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.position_type_name === '') {
      toast.error("Mandatory field should not be empty.", { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await postPositionType(formData);
        if (res.error) {
          handleApiError(res.error);
        } else {
          toast.success("Position Type created successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ position_type_name: '' });
          refetch();
        }
      } catch (err) {
        console.error("Error creating Position Type:", err);
      }
    }
  }, [formData, postPositionType, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updatePositionType({ selectRowID, updatePositionTypeData: formData });
      if (res.error) {
        handleApiError(res.error);
      } else {
        toast.success("Position Type updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({ position_type_name: '' });
        setIsRowSelected(false);
        refetch();
      }
    } catch (err) {
      console.error("Error updating Position Type:", err);
    }
  }, [selectRowID, formData, updatePositionType, refetch]);

  const handleApiError = useCallback((error) => {
    if (error.status === 400) {
      toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
    } else if (error.status === 500) {
      toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
    } else if (error.status === 409) {
      toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 });
    } else {
      toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
    }
  }, []);

  // Columns
  const columns = useMemo(() => [{
    field: "position_type_name",
    headerName: "Position Type",
    flex: 1,
    renderCell: (params) => {
      const onView = () => { handleRowClick(params); };
      return (<span onClick={onView} className="table_first_column" style={{ color: "#379237", textDecoration: 'underline' }}>{params.value}</span>);
    },
  }], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Position Type</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type="delete" onClick={handleDeleteDialog} />
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 4 }}>
            <InputField name="position_type_name" label="Position Type" placeholder="Select Position Type" type="text" value={formData.position_type_name || ""} onChange={handleChange} mandatory />
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
                  minHeight={"calc(100vh - 350px)"}
                />
              ) : null
            )}
        </>
      )}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to delete your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDelete(); setDeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default PositionType;
