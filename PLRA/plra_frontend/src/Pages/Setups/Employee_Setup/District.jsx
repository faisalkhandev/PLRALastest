import React, { useState, useCallback, Fragment, useMemo } from "react";
import { Typography, Box, Grid, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Warning } from '../../../Assets/Icons';
import { Btn, InputField } from "../../../Components/index";
import {
  useGetDistrictQuery, usePostDistrictMutation, useUpdateDistrictMutation,
  useGetDivisionQuery, useDeleteDistrictMutation
} from '../../../Features/API/API'
import { MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from '../../../Components/index';
import "../../Styles.css"
import { toast } from 'react-toastify'

const District = () => {
  const theme = useTheme();

  // States
  const [formData, setFormData] = useState({
    district_id: '', district_name: '', division: ''
  });
  const [districtDialog, setDistrictDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null)
  const [divisionDialog, setDivisionDialog] = useState(false);
  const [divisionData, setDivisionData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetDistrictQuery();
  const { data: divisionDataApi, isLoading: divisionLoading, isError: divisionRefreshError, error: divisionQueryError } = useGetDivisionQuery();
  const [postDistrict] = usePostDistrictMutation();
  const [updateDistrict] = useUpdateDistrictMutation();
  const [deleteDistrict] = useDeleteDistrictMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setFormData({ district_id: '', district_name: '', division: '' });
    setDivisionData('');
    setIsRowSelected(false);
    setSelectedRowID('');
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deleteDistrict({ selectRowID });
      if (res.error) {
        if (res.error.status === 500) {
          return toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 409) {
          return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 });
        } else {
          return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
        }
      }
      toast.success("District deleted.", { position: "top-center", autoClose: 3000 });
      resetForm();
      refetch();
    } catch (err) {
      console.error('Error deleting District:', err);
    }
  }, [deleteDistrict, selectRowID, resetForm, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const divisionClickHandler = useCallback((selectedRow) => {
    setDivisionData(selectedRow.division_name);
    setFormData({
      ...formData,
      division: selectedRow.d_rec_id,
    });
    setDivisionDialog(false);
  }, [formData]);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setDivisionData(event.row.division.division_name);
    setFormData({
      district_id: event.row.district_id,
      district_name: event.row.district_name,
      division: event.row.division.d_rec_id,
    });
    setSelectedRowID(event.row.district_rec_id);
  }, []);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.district_id === '' || formData.district_name === '' || formData.division === '') {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await postDistrict(formData);
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
          } else {
            toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
          }
        } else {
          toast.success("Data created successfully.", { position: "top-center", autoClose: 3000 });
          resetForm();
          refetch();
        }
      } catch (err) {
        console.error('Error creating District:', err);
      }
    }
  }, [formData, postDistrict, resetForm, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateDistrict({ selectRowID, updateDistrictData: formData });
      if (res.error) {
        if (res.error.status === 400) {
          toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 500) {
          toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 409) {
          toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 });
        } else {
          toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
        }
      } else {
        toast.success("Data updated successfully.", { position: "top-center", autoClose: 3000 });
        resetForm();
        refetch();
      }
    } catch (err) {
      console.error('Error updating District:', err);
    }
  }, [updateDistrict, selectRowID, formData, resetForm, refetch]);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'district_id',
      headerName: 'District ID',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>
        );
      },
    },
    { field: 'district_name', headerName: 'District', minWidth: 200 },
    {
      field: 'division',
      headerName: 'Division',
      minWidth: 200,
      renderCell: (params) => <span > {params.row.division.division_name}</span>,
    },
    {
      field: 'region_name',
      headerName: 'Region',
      minWidth: 200,
      valueGetter: (params) => params.row?.division?.region?.region_name || '',
    },
  ], [handleRowClick]);

  // Memoized divisionHeader
  const divisionHeader = useMemo(() => [
    {
      field: "division_id",
      headerName: "Division ID",
      type: "string",
      flex: true,
      align: "left",
    },
    {
      field: "division_name",
      headerName: "Division",
      type: "string",
      flex: true,
      align: "left",
    },
    {
      field: "region",
      headerName: "Region Type",
      type: "string",
      flex: true,
      valueGetter: (params) => params.row?.division_name || '',
    },
  ], []);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>District</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
        <Btn onClick={isRowSelected ? () => setDistrictDialog(true) : handleSaveData} type="save" />
        <Btn type="delete" onClick={handleDeleteDialog} />
      </Box>

      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 1 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="district_id" label="District ID" placeholder="Enter District ID" value={formData.district_id} type="text" onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
            {divisionDataApi && divisionDataApi.results ?
              <div>
                <InputField name="division" label="Division " placeholder="Select Division" value={divisionData || ''} type="text" isShowIcon={true} onClick={() => setDivisionDialog(true)} mandatory />
                <Multi_Dropdown RowFilterWith={"d_rec_id"} onClose={() => setDivisionDialog(false)} isOpen={divisionDialog} tableHeader={divisionHeader} tableRows={divisionDataApi.results} onSelect={divisionClickHandler} MinimumWidth={"500px"} />
              </div>
              :
              <InputField name="division" label="Division " placeholder="Select Division" value={divisionData || ''} type="text" isShowIcon={true} onClick={() => setDivisionDialog(true)} />
            } 
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="district_name" label="District" placeholder="Enter District Name" type="text" value={formData.district_name} onChange={handleChange} mandatory />
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
                  customPageSize={10}
                  RowFilterWith="district_rec_id"
                  onRowClick={handleRowClick}
                  minHeight={'calc(100vh - 370px)'}
                />
              ) : null
            )}
        </>
      )}

      <Dialog open={districtDialog} onClose={() => setDistrictDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center' }}><Warning />Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setDistrictDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDistrictDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center' }}><Warning />Do you want to delete your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDelete(); setDeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  )
}

export default District;
