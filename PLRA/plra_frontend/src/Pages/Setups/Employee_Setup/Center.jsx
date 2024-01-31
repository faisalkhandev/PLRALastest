import React, { useState, useCallback, useMemo, useEffect, Fragment } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer, Loader, ErrorHandler } from '../../../Components/index';
import { useGetCenterQuery, usePostCenterMutation, useUpdateCenterMutation, useDeleteCenterMutation, useGetDistrictIDQuery, useGetDivisionIDQuery, useGetTehsilIDQuery, useGetDistrictQuery, useGetRegionQuery, useGetDivisionQuery, useGetTehsilQuery } from '../../../Features/API/API';
import { toast } from 'react-toastify'
import { Warning } from '../../../Assets/Icons';
import { RegionHeader, districtHeader, divisionHeader, tehsilHeader } from "../../../Data/Setup_Data/Setup_Data";

const Center = () => {
  const theme = useTheme();

  // States
  const [formData, setFormData] = useState({ center_id: '', district: '', region: '', center_name: '', division: '', tehsil: '' });
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [regionDialog, setRegionDialog] = useState(false);
  const [divisionDialog, setDivisionDialog] = useState(false);
  const [districtDialog, setDistrictDialog] = useState(false);
  const [tehsilDialog, setTehsilDialog] = useState(false);
  const [regionData, setRegionData] = useState("");
  const [divisionData, setDivisionData] = useState("");
  const [districtData, setDistrictData] = useState("");
  const [tehsilData, setTehsilData] = useState("");
  const [selectRegion, setSelectRegion] = useState("");
  const [selectDivision, setSelectDivision] = useState("");
  const [selectDistrict, setSelectDistrict] = useState("");
  const [divisionDisable, setDivisionDisable] = useState(true);
  const [districtDisable, setDistrictDisable] = useState(true);
  const [tehsilDisable, setTehsilDisable] = useState(true);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetCenterQuery();
  const [postCenter] = usePostCenterMutation();
  const [updateCenter] = useUpdateCenterMutation();
  const [deleteCenter] = useDeleteCenterMutation();
  const { data: region_data, isLoading: region_loading, isError: region_refreshError, error: region_queryError } = useGetRegionQuery();
  const { data: division_data, isLoading: division_loading, isError: division_refreshError, error: division_queryError } = useGetDivisionIDQuery({ selectRegion });
  const { data: district_data, isLoading: district_loading, isError: district_refreshError, error: district_queryError } = useGetDistrictIDQuery({ selectDivision });
  const { data: tehsil_data, isLoading: tehsil_loading, isError: tehsil_refreshError, error: tehsil_queryError } = useGetTehsilIDQuery({ selectDistrict });

  // Functions
  const resetForm = useCallback(() => {
    setIsRowSelected(false)
    setFormData({ center_id: '', district: '', region: '', center_name: '', division: '', tehsil: '' });
    setRegionData(""); setDivisionData(""); setDistrictData(""); setTehsilData(""); setTehsilDisable(true); setDivisionDisable(true); setDistrictDisable(true);
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  // Dialog Click Listeners
  const regionClickHandler = useCallback((selectedRow) => {
    setRegionData(selectedRow.region_name)
    setFormData({ ...formData, region: selectedRow.r_rec_id, });
    setSelectRegion(selectedRow.r_rec_id)
    setRegionDialog(false);
    setDivisionData(''); setDistrictData(''), setTehsilData('')
    setDivisionDisable(false)
    setTehsilDisable(true), setDistrictDisable(true)
  }, [formData]);

  const divisionClickHandler = useCallback((selectedRow) => {
    setDivisionData(selectedRow.division_name)
    setFormData({ ...formData, division: selectedRow.d_rec_id, });
    setSelectDivision(selectedRow.d_rec_id)
    setDivisionDialog(false);
    setDistrictData(''); setTehsilData('')
    setTehsilDisable(true),
      setDistrictDisable(false);
  }, [formData]);

  const districtClickHandler = useCallback((selectedRow) => {
    setDistrictData(selectedRow.district_name)
    setFormData({ ...formData, district: selectedRow.district_rec_id, });
    setSelectDistrict(selectedRow.district_rec_id)
    setTehsilData('')
    setDistrictDialog(false);
    setTehsilDisable(false);
  }, [formData]);

  const tehsilClickHandler = useCallback((selectedRow) => {
    setTehsilData(selectedRow.t_name)
    setFormData({ ...formData, tehsil: selectedRow.t_rec_id, });
    setTehsilDialog(false);
  }, [formData]);

  const handleDeleteData = useCallback(async (e) => {
    try {
      const res = await deleteCenter({ selectRowID, deleteSubWingData: formData });
      if (res.error) {
        if (res.error.status === 409) { toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 }) }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
        setIsRowSelected(false)
        setFormData({ center_id: '', district: '', region: '', center_name: '', division: '', tehsil: '' });
        setRegionData(""); setDivisionData(""); setDistrictData(""); setTehsilData("")
        refetch();
      }
    } catch (err) {
      console.error('Error Deleting Sub Wing:', err);
    }
  }, [deleteCenter, formData, selectRowID]);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true)
    setFormData({
      center_id: event.row.center_id,
      center_name: event.row.center_name,
      region: event.row.region.r_rec_id,
      division: event.row.division.d_rec_id,
      district: event.row.district.district_rec_id,
      tehsil: event.row.tehsil.t_rec_id,
    })
    setSelectedRowID(event.row.c_rec_id);
    setDistrictData(event.row.district.district_name)
    setDivisionData(event.row.division.division_name)
    setRegionData(event.row.region.region_name)
    setTehsilData(event.row.tehsil.t_name)
  }, []);

  const handleDeleteDialog = useCallback((e) => {
    if (isRowSelected) {
      setDeleteDialog(true)
    }
    else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.center_id == '' || formData.center_name == '' || formData.region == '' ||
      formData.division == '' || formData.district == '' || formData.tehsil == '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await postCenter(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something went wrong !!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Data create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({ center_id: '', center_name: '', region: '', division: '', district: '', tehsil: '' });
          setDistrictData(""); setRegionData(""); setDivisionData(""); setTehsilData("")
          refetch();
        }
      } catch (err) {
        console.error('Error creating Center:', err, { position: "top-center", autoClose: 3000 });
      }
    };
  }, [formData, postCenter]);

  const handleDelete = useCallback(async (e) => {
    try {
      // call api
      const res = await deleteCenter({ selectRowID })
      // error handling 
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // success call 
      toast.success("Center deleted.", { position: "top-center", autoClose: 3000 })
      setFormData({ center_id: '', center_name: '', region: '', division: '', district: '', tehsil: '' });
      setDistrictData(""); setRegionData(""); setDivisionData(""); setTehsilData("")
      setIsRowSelected(false)
      refetch()
    }
    catch (err) {
      console.error('Error creating District:', err);
    }
  }, [deleteCenter, formData, selectRowID]);

  const handleUpdateData = useCallback(async (e) => {
    try {
      // Call the API to update the record
      const res = await updateCenter({ selectRowID, updateCenterData: formData });
      // Error handling
      if (res.error) {
        if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // Success case
      toast.success("Center Updated successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({ center_id: '', center_name: '', region: '', division: '', district: '', tehsil: '' });
      setDistrictData(""); setRegionData(""); setDivisionData(""); setTehsilData("")
      refetch();
    } catch (err) { console.error('Error creating Center:', err, { position: "top-center", autoClose: 3000 }); }
  }, [formData, selectRowID, updateCenter]);

  const columns = useMemo(() => [
    {
      field: 'center_id',
      headerName: 'Center ID',
      minWidth: 120,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (<span onClick={onView} className='table_first_column' style={{ color: "#379237", textDecoration: 'underline' }}>{params.value} </span>);
      },
    },
    { field: 'center_name', headerName: 'Center', minWidth: 250 },
    {
      field: 'region_id', headerName: 'Region', minWidth: 170,
      renderCell: (params) => { return (<span > {params.row.region.region_name} </span>); },
    },
    {
      field: 'division_id', headerName: 'Division', flex: true,
      renderCell: (params) => {
        return (<span > {params.row.division.division_name} </span>);
      },
    },
    {
      field: 'district_id', headerName: 'District', flex: true,
      renderCell: (params) => { return (<span > {params.row.district.district_name} </span>); },
    },
    {
      field: 'tehsil_id', headerName: 'Tehsil', flex: true,
      renderCell: (params) => { return (<span > {params.row.tehsil.t_name} </span>); },
    },
  ], [handleRowClick]);

  return (
    <Fragment>

      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Center</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type="delete" onClick={handleDeleteDialog} />
      </Box>

      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4, }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="center_id" label="Center ID " placeholder="Enter Center ID" type="text" value={formData.center_id || ""} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} />

            {region_data && region_data.results ?
              <div>
                <InputField name="region" label="Region" placeholder="Select Region" value={regionData} isShowIcon={true} onClick={() => setRegionDialog(true)} />
                <Multi_Dropdown RowFilterWith={"r_rec_id"} isOpen={regionDialog} onClose={() => setRegionDialog(false)} MinimumWidth={"400px"} tableHeader={RegionHeader} tableRows={region_data.results} onSelect={regionClickHandler} />
              </div> : <InputField name="region" label="Region" placeholder="Select Region" value={regionData} isShowIcon={true} onClick={() => setRegionDialog(true)} />
            }

            {district_data && district_data ?
              <div >
                <InputField name="district_id" label="District " placeholder="Enter District" value={districtData} isShowIcon={true} type="text" onClick={() => setDistrictDialog(true)} disabled={districtDisable} />
                <Multi_Dropdown RowFilterWith={"district_rec_id"} isOpen={districtDialog} onClose={() => setDistrictDialog(false)} MinimumWidth={"400px"} tableHeader={districtHeader} tableRows={district_data.results} onSelect={districtClickHandler} />
              </div> : <InputField name="district_id" label="District " placeholder="Enter District" isShowIcon={true} value={districtData} type="text" onClick={() => setDistrictDialog(true)} />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="center_name" label="Center Name" placeholder="Enter Center Name" type="text" value={formData.center_name || ""} onChange={handleChange} mandatory />

            {division_data && division_data ?
              <div>
                <InputField name="division_id" label="Division" placeholder="Select Division Name " type="text" isShowIcon={true} value={divisionData} onChange={handleChange} onClick={() => setDivisionDialog(true)} disabled={divisionDisable} />
                <Multi_Dropdown RowFilterWith={"d_rec_id"} isOpen={divisionDialog} onClose={() => setDivisionDialog(false)} MinimumWidth={"400px"} tableHeader={divisionHeader} tableRows={division_data.results} onSelect={divisionClickHandler} />
              </div> : <InputField name="division_id" label="Division" placeholder="Select Division Name " type="text" isShowIcon={true} value={divisionData} onChange={handleChange} onClick={() => setDivisionDialog(true)} />
            }
            {tehsil_data && tehsil_data ?
              <div >
                <InputField name="t_id" label="Tehsil" placeholder="Select Tehsil Name " type="text" value={tehsilData} isShowIcon={true} onChange={handleChange} onClick={() => setTehsilDialog(true)} disabled={tehsilDisable} />
                <Multi_Dropdown RowFilterWith={"t_rec_id"} isOpen={tehsilDialog} tableHeader={tehsilHeader} onClose={() => setTehsilDialog(false)} MinimumWidth={"400px"} tableRows={tehsil_data.results} onSelect={tehsilClickHandler} />
              </div> : <InputField name="t_id" label="Tehsil" placeholder="Select Tehsil Name " type="text" isShowIcon={true} value={tehsilData} onChange={handleChange} onClick={() => setTehsilDialog(true)} />
            }
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
                  RowFilterWith="c_rec_id"
                  onRowClick={handleRowClick}
                  outerCSS={{ mt: 4 }}
                  minHeight={'calc(100vh - 390px)'}
                />
              ) : null
            )}
        </>
      )}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Do you want to delete your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDelete(); setDeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>


      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning /> Do you want to Update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
};

export default Center;
