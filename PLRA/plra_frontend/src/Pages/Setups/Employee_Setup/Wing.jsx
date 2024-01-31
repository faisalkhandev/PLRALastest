import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Loader, ErrorHandler, SimpleDropDown, SimpleDropdown } from '../../../Components/index';
import {
  useGetWingQuery, usePostWingMutation,
  useUpdateWingMutation, useDeleteWingMutation
} from '../../../Features/API/API';
import { MyTableContainer } from '../../../Components/index';
import { toast } from 'react-toastify';
import { Warning } from '../../../Assets/Icons';
import "../../Styles.css"

const Wing = () => {
  const theme = useTheme();
  //States
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    wing_id: '', wing_name: '', director_concern_position: '', adg: ''
  });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetWingQuery();
  console.log('Wingdata:', data)
  const AdgData = data?.results?.map((wing) => ({
    id: wing.w_rec_id,
    label: wing?.adg?.position_id,
    value: wing?.adg?.p_rec_id
  }));
  const directorPosition = data?.results?.map((wing) => ({
    id: wing.w_rec_id,
    label: wing?.director_concern_position?.position_id,
    value: wing?.director_concern_position?.p_rec_id
  }));
  console.log('adg: ', AdgData, 'DirectorPOsition: ', directorPosition)
  const [postWing] = usePostWingMutation();
  const [updateWing] = useUpdateWingMutation();
  const [deleteWing] = useDeleteWingMutation();

  useEffect(() => {
    refetch();
  }, []);

  // function 
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({ wing_id: '', wing_name: '', director_concern_position: '', adg: '' })
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleRowClick = (event) => {
    setIsRowSelected(true)
    setFormData({ wing_id: event.row.wing_id, wing_name: event.row.wing_name })
    setSelectedRowID(event.row.w_rec_id)
  };
  const handleDeleteDialog = (e) => {
    if (isRowSelected) { setDeleteDialog(true) }
    else { toast.error("Record not selected.", { position: "top-center", autoClose: 3000 }) }
  }
  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.wing_id == '' || formData.wing_name == '' || formData.director_concern_position == '' || formData.adg == '') {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      const res = await postWing(formData);
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 400) { return toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      toast.success("Record created successfully.", { position: "top-center", autoClose: 3000 })
      setFormData({ wing_id: '', wing_name: '', adg: '', director_concern_position: '' });
      refetch();
    }
  }
  const handleDeleteData = async (e) => {
    try {
      const res = await deleteWing({ selectRowID });
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // success call 
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ wing_id: '', wing_name: '' });
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      console.error('Error Deleting Record:', err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }
  }
  const handleUpdateData = async (e) => {
    try {
      // Call the API to update the record
      const res = await updateWing({ selectRowID, updateWingData: formData });
      // Error handling
      if (res.error) {
        if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // Success case
      toast.success("Record Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ wing_id: '', wing_name: '' });
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      console.error('Error updating wing:', err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }
  };
  const columns = [
    {
      field: 'wing_id',
      headerName: 'Wing ID',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>
        );
      },
    },

    { field: 'wing_name', headerName: 'Wing Name', minWidth: 200 },
    {
      field: 'adg',
      headerName: 'ADG',
      minWidth: 200,
      valueGetter: (params) => params.row?.adg?.position_id || '',
    },
    {
      field: 'director_concern_position',
      headerName: 'Director Position',
      minWidth: 250,
      valueGetter: (params) => params.row?.director_concern_position?.position_id || '',

    }
  ];



  return (
    <Box sx={{ width: "100%" }} >
      <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Wing</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type='delete' onClick={handleDeleteDialog} />
      </Box>
      <form action="">
        <Grid container spacing={{ xs: 1, md: 4 }} columnSpacing={8} sx={{ mb: 4, py: 2, }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="wing_id" label="Wing ID" placeholder="Enter Wing ID" type="text" value={formData.wing_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
            <SimpleDropDown
              name='adg'
              label='ADG'
              value={formData.adg || ''}
              onChange={handleChange}
              options={AdgData || ''}
              placeholder='Select ADG'
            />

          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1, }}>
            <InputField name="wing_name" label="Wing Name" placeholder="Enter Wing Name" type="text" value={formData.wing_name} onChange={handleChange} mandatory />
            <SimpleDropdown
              name='director_concern_position'
              label='Director Position'
              value={formData.director_concern_position || ''}
              onChange={handleChange}
              options={directorPosition || ''}
              placeholder='Select Director Position'
            />
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
                  RowFilterWith="w_rec_id"
                  onRowClick={handleRowClick}
                  customPageSize={10}
                  minHeight={'calc(100vh - 350px)'}
                />
              ) : null
            )}
        </>
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to update record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>

      {/* ny */}
    </Box>
  );
};

export default Wing;
