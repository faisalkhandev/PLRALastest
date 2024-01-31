import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Box, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler } from "../../../Components/index";
import {
  useGetPpgLevelQuery, usePostPpgLevelMutation, useUpdatePpgLevelMutation,
  useDeletePpgLevelMutation,
} from '../../../Features/API/API';
import "../../Styles.css"
import { toast } from 'react-toastify'
import { Warning } from '../../../Assets/Icons';



const PPGLevel = () => {
  const theme = useTheme();

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
    if (formData.ppg_level === '' || formData.ppg_level_seniority === '') {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 })
    } else {
      try {
        const res = await postPpgLevel(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exists."); }
        } else {
          toast.success("Record created successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ ppg_level: '', ppg_level_seniority: '' });
          refetch();
        }
      } catch (err) {
        console.error('Error creating PPG LEVEL:', err, { position: "top-center", autoClose: 3000 });
      }
    }
  }, [formData, postPpgLevel, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) { setDeleteDialog(true) }
    else { toast.error("Record not selected.", { position: "top-center", autoClose: 3000 }) }
  }, [isRowSelected]);

  const handleDeleteData = useCallback(async () => {
    try {
      // call api
      const res = await deletePpgLevel({ selectRowID });
      // error handling 
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // success call 
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ ppg_level: '', ppg_level_seniority: '' });
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      console.error('Error Deleting Record:', err);
    }
  }, [deletePpgLevel, selectRowID, setIsRowSelected, setFormData, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      // Call the API to update the record
      const res = await updatePpgLevel({ selectRowID, updatePpgData: formData });
      // Error handling
      if (res.error) {
        if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // Success case
      toast.success("PPG Level Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ ppg_level: '', ppg_level_seniority: '' });
      setIsRowSelected(false);
      refetch();
    } catch (err) {
      console.error('Error creating PPG Level:', err, { position: "top-center", autoClose: 3000 });
    }
  }, [updatePpgLevel, selectRowID, setIsRowSelected, setFormData, refetch, formData]);

  const columns = useMemo(() => [
    {
      field: 'ppg_level_seniority',
      headerName: 'Pay Grade ID',
      minWidth: 140,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>{params.value}</span>
        );
      },
    },
    {
      field: 'ppg_level',
      headerName: 'PPG',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], []);



  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Pay Grade</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn onClick={handleDeleteDialog} type="delete" />
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '400px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Box>


      <form action="">
        <Grid container columnSpacing={8} spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <InputField name="ppg_level_seniority" label="Pay Grade ID" placeholder="Enter PPG Seniority Level" type="number" value={formData.ppg_level_seniority} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField name="ppg_level" label="PPG" placeholder="Enter PPG Level" type="text" value={formData.ppg_level} onChange={handleChange} mandatory />
          </Grid>
        </Grid>
      </form>

      {/* Remove the console.log(formData) from here as it's not needed in the final code */}
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
                  minHeight={'calc(100vh - 350px)'}
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

    </Fragment>
  )
}

export default PPGLevel
