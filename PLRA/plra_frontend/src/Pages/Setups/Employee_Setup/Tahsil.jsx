import React, { useState, Fragment,useMemo, useCallback } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from '../../../Components/index';
import {
  useGetTehsilQuery, usePostTehsilMutation, useUpdateTehsilMutation,
  useGetDistrictQuery, useDeleteTehsilMutation
} from '../../../Features/API/API';
import "../../Styles.css"
import { Warning } from '../../../Assets/Icons';
import { toast } from 'react-toastify'
import { districtHeader } from "../../../Data/Setup_Data/Setup_Data";


const Tehsil = () => {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ t_id: '', t_name: '', district: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null)
  const [districtDialog, setDistrictDialog] = useState(false);
  const [districtData, setDistrictData] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);


  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetTehsilQuery();
  const { data: d_data, isLoading: d_loading, isError: d_refreshError, error: d_queryError } = useGetDistrictQuery();
  const [postTehsil] = usePostTehsilMutation();
  const [updateTehsil] = useUpdateTehsilMutation();
  const [deleteTehsil] = useDeleteTehsilMutation();


  // functions
    // Memoized event handlers
    const handleChange = useCallback((event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);
  
    const districtClickHandler = useCallback((selectedRow) => {
      setDistrictData(selectedRow.district_name);
      setFormData({
        ...formData,
        district: selectedRow.district_rec_id,
      });
      setDistrictDialog(false);
    }, [formData]);
  
    const handleRowClick = useCallback((event) => {
      setIsRowSelected(true);
      setFormData({
        t_id: event.row.t_id,
        t_name: event.row.t_name,
        district: event.row.district.district_rec_id,
      });
      setSelectedRowID(event.row.t_rec_id);
      setDistrictData(event.row.district.district_name);
    }, []);
  
    const handleSaveData = useCallback(async (e) => {
      e.preventDefault();
      if (formData.t_id === '' || formData.t_name === '' || formData.district === '') {
        toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 });
      } else {
        try {
          const res = await postTehsil(formData);
          if (res.error) {
            if (res.error.status === 400) { toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }); }
            else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }); }
          } else {
            toast.success("Data create successfully.", { position: "top-center", autoClose: 3000 });
            setFormData({ t_id: '', t_name: '', district: '' });
            setDistrictData("");
            refetch();
          }
        } catch (err) {
          console.error('Error creating Tehsil:', err);
        }
      }
    }, [formData, postTehsil, refetch]);
  
    const handleUpdateData = useCallback(async () => {
      try {
        const res = await updateTehsil({ selectRowID, updateTehsilData: formData });
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }); }
          else if (res.error.status === 500) { toast.error("Server is not working", { position: "top-center", autoClose: 3000 }); }
          else if (res.error.status === 409) { toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }); }
          else { toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }); }
        } else {
          toast.success("Tehsil Updated successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ t_id: '', t_name: '', district: '' });
          setDistrictData("");
          setIsRowSelected(false);
          refetch();
        }
      } catch (err) {
        console.error('Error updating Tehsil:', err);
      }
    }, [updateTehsil, selectRowID, formData, setFormData, setIsRowSelected, refetch]);
  
    const resetForm = useCallback(() => {
      setFormData({ t_id: '', t_name: '', district: '' });
      setDistrictData("");
      setIsRowSelected(false);
    }, []);
  
    const handleDelete = useCallback(async () => {
      try {
        const res = await deleteTehsil({ selectRowID });
        if (res.error) {
          if (res.error.status === 500) { toast.error("Server is not working", { position: "top-center", autoClose: 3000 }); }
          else if (res.error.status === 409) { toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }); }
          else { toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }); }
        } else {
          toast.success("Tehsil deleted.", { position: "top-center", autoClose: 3000 });
          setFormData({ t_id: '', t_name: '', district: '' });
          setIsRowSelected(false);
          setDistrictData("");
          refetch();
        }
      } catch (err) {
        console.error('Error deleting Tehsil:', err);
      }
    }, [deleteTehsil, selectRowID, setFormData, setIsRowSelected, refetch]);
  
    const handleDeleteDialog = useCallback(() => {
      if (isRowSelected) {
        setDeleteDialog(true);
      } else {
        toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
      }
    }, [isRowSelected]);

  //Columns
  const columns = useMemo(() => [
    {
      field: 't_id',
      headerName: 'Tehsil ID',
      minWidth: 130,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>  {params.value} </span>
        );
      },
    },
    { field: 't_name', headerName: 'Teshil', minWidth: 200 },
    {
      field: 'district',
      headerName: 'District',
      minWidth: 200,
      renderCell: (params) => (
        <span > {params.row.district.district_name} </span>
      ),
    },
    {
      field: 'division_name',
      headerName: 'Division',
      minWidth: 200,
      valueGetter: (params) => params.row?.district?.division.division_name || '',
    },
    {
      field: 'region_name',
      headerName: 'Region',
      minWidth: 200,
      valueGetter: (params) => params.row?.district?.division?.region?.region_name || '',
    },
  ], []);

  return (
    <Fragment>

      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Tehsil</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type="delete" onClick={handleDeleteDialog} />

      </Box>
      <form action="" >
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4, }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="t_id" label="Tehsil ID" placeholder="Enter Tehsil ID" type="text" value={formData.t_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />
            {d_data && d_data.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="district" label="District " placeholder="Enter District" isShowIcon={true} value={districtData || formData.district || ""} type="text" onClick={() => setDistrictDialog(true)} />
                <Multi_Dropdown RowFilterWith={"district_rec_id"} isOpen={districtDialog} MinimumWidth={'500px'} tableHeader={districtHeader} tableRows={d_data.results} onSelect={districtClickHandler} onClick={() => setDistrictDialog(true)} />
              </div>
              :
              <InputField name="district" label="District " placeholder="Enter District" isShowIcon={true} value={districtData || formData.district || ""} type="text" onClick={() => setDistrictDialog(true)} />}
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="t_name" label="Tehsil" placeholder="Enter Tehsil Name" type="text" value={formData.t_name} onChange={handleChange} mandatory />
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
                  RowFilterWith="t_rec_id"
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
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center' }}><Warning />Do you want to update your data</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center' }}><Warning />Do you want to delete your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDelete(); setdeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setdeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>

    </Fragment>
  );
}
export default Tehsil;