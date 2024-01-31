import React, { Fragment, useState } from "react";
import { Typography, Box, Grid, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import { toast } from 'react-toastify'
import { Warning } from '../../../Assets/Icons';
import { WingHeader } from '../../../Data/Setup_Data/Setup_Data'
import {
  MyTableContainer, Multi_Dropdown, Btn,
  InputField, Loader, ErrorHandler
} from "../../../Components/index.js";
import { useGetWingQuery, useGetSubWingQuery, usePostSubWingMutation, useUpdateSubWingMutation, useDeleteSubWingMutation } from '../../../Features/API/API';

const SubWing = () => {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ wing: '', sub_wing_name: '', sub_wind_id: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [wingDialogOpen, setWingDialogOpen] = useState(false);
  const [wingName, setWingName] = useState("");
  const [editDialog, setEditDialog] = useState(false);

  //Queries
  const { data: wingData, isLoading: wingloading, isError: wingRefreshError, error: wingQueryError, refetch: wingRefetch } = useGetWingQuery();
  const { data: subwingData, isLoading: subwingLoading, isError: subwingRefreshError, error: subbwingQueryError, refetch: subwingRefetch } = useGetSubWingQuery();
  const [postSubWing] = usePostSubWingMutation();
  const [updateSubWing] = useUpdateSubWingMutation();
  const [deleteSubWing] = useDeleteSubWingMutation();


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({ wing: '', sub_wing_name: '', sub_wind_id: '' })
    setWingName("")
  }

  const handleRowClick = (event) => {
    setIsRowSelected(true);
    setFormData({
      wing: event.row.wing.w_rec_id,
      sub_wind_id: event.row.sub_wind_id,
      sub_wing_name: event.row.sub_wing_name,
    });
    setWingName(event.row.wing.wing_name)
    setSelectedRowID(event.row.sw_rec_id);
  };

  const handleDeleteDialog = () => {
    if (isRowSelected) { setDeleteDialog(true) }
    else { toast.error("Record not selected.", { position: "top-center", autoClose: 3000 }) }
  }

  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.wing == '', formData.sub_wing_name == '', formData.sub_wind_id == '') {
      toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await postSubWing(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
        }
        else {
          toast.success("SubWing create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({ sub_wind_id: '', sub_wing_name: '', wing: "" });
          setWingName("")
          subwingRefetch();
        }
      }
      catch (err) { console.error('Error creating wing:', err); }
    }
  };

  const handleDeleteData = async (e) => {
    try {
      // Call the API to update the record
      const res = await deleteSubWing({ selectRowID, deleteSubWingData: formData });
      // Error handling
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // Success case
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ wing: '', sub_wing_name: '', sub_wind_id: '' });
      setWingName("")
      setIsRowSelected(false)
      subwingRefetch();
    } catch (err) {
      console.error('Error updating wing:', err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }

  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updateSubWing({ selectRowID, updateSubWingData: formData });
      if (res.error) {
        if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      toast.success("Record Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ sub_wind_id: '', sub_wing_name: '', wing: "" });
      setIsRowSelected(false)
      setWingName("")
      subwingRefetch();
    }
    catch (err) { console.error('Error creating wing:', err); }
  }

  const wingClickHandler = (selectedRow) => {
    setWingName(selectedRow.wing_name)
    setFormData((prevData) => ({ ...prevData, wing: selectedRow.w_rec_id }))
    setWingDialogOpen(false);
  }

  const columns = [
    {
      field: 'sub_wind_id',
      headerName: 'Sub Wing ID',
      type: 'numeric',
      minWidth: 200,
      style: { "backgroundColor": "var(--green-main)", "color": "white" }, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (<span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>);
      },
    },
    { field: 'sub_wing_name', headerName: 'Sub Wing Name', type: 'alphaNumeric', minWidth: 200, },
    { field: 'wing.wing_name', headerName: 'Wing', type: 'alphaNumeric', minWidth: 200, valueGetter: (params) => params.row.wing ? params.row.wing.wing_name : '' },
  ];


  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 1, mb: 3, alignItems: 'center' }} gap={2}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Sub Wing</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type='delete' onClick={handleDeleteDialog} />
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
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="sub_wind_id" label="Sub Wing ID" placeholder="Enter Sub Wing ID" type="text" value={formData.sub_wind_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
            {wingData && wingData.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="wing" label="Wing" placeholder="Select Wing" value={wingName || ""} type="text" isShowIcon={true} onClick={() => setWingDialogOpen(true)} mandatory />
                <Multi_Dropdown isOpen={wingDialogOpen} onClose={() => setWingDialogOpen(false)} tableHeader={WingHeader} tableRows={wingData.results} onSelect={wingClickHandler} RowFilterWith="w_rec_id" />
              </div>
              :
              <InputField name="wing" label="Wing" placeholder="Select Wing" value={wingName || ""} type="text" isShowIcon={true} onClick={() => setWingDialogOpen(true)} mandatory />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="sub_wing_name" label="Sub Wing Name" placeholder="Enter Sub Wing Name" type="text" value={formData.sub_wing_name} onChange={handleChange} mandatory />
          </Grid>
        </Grid>
      </form>

      {/* SubWing Table*/}
      {subwingLoading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {subwingRefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              subwingData && subwingData?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={subwingData.results}
                  isAddNewButton={true}
                  customPageSize={10}
                  RowFilterWith="sub_wind_id"
                  minHeight={'calc(100vh - 350px)'}
                  onRowClick={handleRowClick}
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

export default SubWing;
