import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Typography, Grid, Dialog, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler } from '../../../Components/index';
import { toast } from 'react-toastify';
import { Warning } from '../../../Assets/Icons';
import { useGetRegionQuery, usePostRegionMutation, useDeleteRegionMutation, useUpdateRegionMutation, } from '../../../Features/API/API';
import "../../Styles.css"

const Region = () => {
  const theme = useTheme();

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
      if (res.error) {
        // ... (error handling)
      } else {
        // Batch state updates
        setFormData((prevData) => ({ ...prevData, region_name: '', region_id: '' }));
        setIsRowSelected(false);
        refetch();
        toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      }
    } catch (err) {
      console.error('Error Deleting Sub Wing:', err);
    }
  }, [deleteRegion, selectRowID, setFormData, setIsRowSelected, refetch]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.region_id === '' || formData.region_name === '') {
      toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await postRegion(formData);
        if (res.error) {
          // ... (error handling)
        } else {
          refetch();
          toast.success("Data create successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ region_id: '', region_name: '' });
        }
      } catch (err) {
        console.error('Error creating Region:', err);
      }
    }
  }, [formData, postRegion, refetch, setFormData]);

  const handleUpdateData = useCallback(async (e) => {
    try {
      const res = await updateRegion({ selectRowID, updateRegionData: formData });
      if (res.error) {
        // ... (error handling)
      } else {
        toast.success("Region Updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({ region_id: '', region_name: '' });
        setIsRowSelected(false);
        refetch();
      }
    } catch (err) {
      console.error('Error updating Region:', err);
    }
  }, [updateRegion, selectRowID, formData, setFormData, setIsRowSelected, refetch]);

  // Columns
  const columns = useMemo(() => [
    {
      field: 'region_id', headerName: 'Region ID', minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>
        );
      },
    },
    { field: 'region_name', headerName: 'Region', minWidth: 200 }
  ], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Region</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type='delete' onClick={handleDeleteDialog} />
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="region_id" label="Region ID" placeholder="Enter Region ID" type="text" value={formData.region_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="region_name" label="Region" placeholder="Enter Region Name" type="text" value={formData.region_name} onChange={handleChange} mandatory />
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
                  minHeight={'calc(100vh - 350px)'}
                />
              ) : null
            )}
        </>
      )}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" ><Warning /> Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: "flex", justifyContent: 'start', alignContent: "center" }}><Warning />  Are you sure to delete record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default Region;