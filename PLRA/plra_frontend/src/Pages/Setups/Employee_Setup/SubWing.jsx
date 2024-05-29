import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import { showToast } from '../../../Components/Common/ToastCard'
import { WingHeader } from '../../../Data/Setup_Data/Setup_Data'
import {
  MyTableContainer, Multi_Dropdown, Btn,
  InputField, Loader, ErrorHandler, DialogBox
} from "../../../Components/index.js";
import { useGetWingQuery, useGetSubWingQuery, usePostSubWingMutation, useUpdateSubWingMutation, useDeleteSubWingMutation } from '../../../Features/API/API';
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler.jsx";

const SubWing = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

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

  const resetForm = useCallback(() => {
    setIsRowSelected(false)
    setFormData({ wing: '', sub_wing_name: '', sub_wind_id: '' })
    setWingName(""),
      setFormErrors({});
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      wing: event.row.wing.w_rec_id,
      sub_wind_id: event.row.sub_wind_id,
      sub_wing_name: event.row.sub_wing_name,
    });
    setWingName(event.row.wing.wing_name)
    setSelectedRowID(event.row.sw_rec_id);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) { setDeleteDialog(true) }
    else { return showToast('Record not Selected', 'error'); }
  }, [isRowSelected]);

  const handleSaveData = async (e) => {
    e.preventDefault();

    try {
      const res = await postSubWing(formData);
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
      subwingRefetch();
    }
    catch (err) { showToast(`${err.message}`, "error"); }
  };

  const handleDeleteData = useCallback(async () => {
    try {
      // Call the API to update the record
      const res = await deleteSubWing({ selectRowID, deleteSubWingData: formData });
      // Error handling
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record Deleted Successfully`, "success");
      resetForm();
      subwingRefetch();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }, [deleteSubWing, selectRowID, subwingRefetch]);

  const handleUpdateData = useCallback(async (e) => {
    try {
      const res = await updateSubWing({ selectRowID, updateSubWingData: formData });
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
      subwingRefetch();
    }
    catch (err) {
      showToast(`${err.message}`, "error");
    }
  }, [updateSubWing, selectRowID, formData, subwingRefetch]);

  const wingClickHandler = useCallback((selectedRow) => {
    setWingName(selectedRow.wing_name)
    setFormData((prevData) => ({ ...prevData, wing: selectedRow.w_rec_id }))
    setWingDialogOpen(false);
  }, []);

  const columns = useMemo(() => [
    {
      field: 'sub_wind_id',
      headerName: 'Sub Wing ID',
      type: 'numeric',
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'sub_wing_name', headerName: 'Sub Wing Name', type: 'alphaNumeric', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'wing.wing_name', headerName: 'Wing', type: 'alphaNumeric', minWidth: 200, valueGetter: (params) => params.row.wing ? params.row.wing.wing_name : '', renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 1, mb: 3, alignItems: 'center' }} gap={2}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Sub Wing</Typography>
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
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="sub_wind_id" label="Sub Wing ID" placeholder="Enter Sub Wing ID" type="text" value={formData.sub_wind_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.sub_wind_id} />
            {wingData && wingData.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="wing" label="Wing" placeholder="Select Wing" value={wingName || ""} type="text" isShowIcon={true} onClick={() => setWingDialogOpen(true)} mandatory error={formErrors?.data?.wing} />
                <Multi_Dropdown isOpen={wingDialogOpen} onClose={() => setWingDialogOpen(false)} tableHeader={WingHeader} tableRows={wingData.results} onSelect={wingClickHandler} RowFilterWith="w_rec_id" />
              </div>
              :
              <InputField name="wing" label="Wing" placeholder="Select Wing" value={wingName || ""} type="text" isShowIcon={true} onClick={() => setWingDialogOpen(true)} mandatory error={formErrors?.data?.wing} />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="sub_wing_name" label="Sub Wing Name" placeholder="Enter Sub Wing Name" type="text" value={formData.sub_wing_name} onChange={handleChange} mandatory error={formErrors?.data?.sub_wing_name} />
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
                  minHeight={'calc(100vh - 384px)'}
                  onRowClick={handleRowClick}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  )
}
export default SubWing;
