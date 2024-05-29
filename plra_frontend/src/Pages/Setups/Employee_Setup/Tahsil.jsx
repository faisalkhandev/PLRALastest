import React, { useState, Fragment, useMemo, useCallback } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import {
  useGetTehsilQuery, usePostTehsilMutation, useUpdateTehsilMutation,
  useGetDistrictQuery, useDeleteTehsilMutation
} from '../../../Features/API/API';
import "../../Styles.css"
import { showToast } from '../../../Components/Common/ToastCard'
import { districtHeader } from "../../../Data/Setup_Data/Setup_Data";
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const Tehsil = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

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
    try {
      const res = await postTehsil(formData);
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
  }, [formData, postTehsil, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateTehsil({ selectRowID, updateTehsilData: formData });
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
  }, [updateTehsil, selectRowID, formData, setFormData, setIsRowSelected, refetch]);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setFormData({ t_id: '', t_name: '', district: '' });
    setDistrictData("");
    setIsRowSelected(false);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setdeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deleteTehsil({ selectRowID });
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
  }, [deleteTehsil, selectRowID, refetch]);

  //Columns
  const columns = useMemo(() => [
    {
      field: 't_id',
      headerName: 'Tehsil ID',
      minWidth: 130,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 't_name', headerName: 'Teshil', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'district',
      headerName: 'District',
      minWidth: 200,
      valueGetter: (params) => params.row?.district?.district_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'division_name',
      headerName: 'Division',
      minWidth: 200,
      valueGetter: (params) => params.row?.district?.division?.division_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'region_name',
      headerName: 'Region',
      minWidth: 200,
      valueGetter: (params) => params.row?.district?.division?.region?.region_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ], []);

  return (
    <Fragment>

      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Tehsil</Typography>
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
              onClose={() => setdeleteDialog(false)}
              closeClick={() => setdeleteDialog(false)}
              sureClick={() => { handleDelete(); setdeleteDialog(false); }}
              title={"Are you sure you want to delete the record?"}
            /> : ''
        }
      </Box>

      <form action="" >
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4, }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="t_id" label="Tehsil ID" placeholder="Enter Tehsil ID" type="text" value={formData.t_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.t_id} />
            {d_data && d_data.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="district" label="District " placeholder="Enter District" isShowIcon={true} value={districtData || formData.district || ""} type="text" onClick={() => setDistrictDialog(true)} error={formErrors?.data?.district} />
                <Multi_Dropdown RowFilterWith={"district_rec_id"} isOpen={districtDialog} MinimumWidth={'500px'} tableHeader={districtHeader} tableRows={d_data.results} onSelect={districtClickHandler} onClose={() => setDistrictDialog(false)} onClick={() => setDistrictDialog(true)} />
              </div>
              :
              <InputField name="district" label="District " placeholder="Enter District" isShowIcon={true} value={districtData || formData.district || ""} type="text" onClick={() => setDistrictDialog(true)} error={formErrors?.data?.district} />}
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="t_name" label="Tehsil" placeholder="Enter Tehsil Name" type="text" value={formData.t_name} onChange={handleChange} mandatory error={formErrors?.data?.t_name} />
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
                  minHeight={'calc(100vh - 383px)'}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  );
}
export default Tehsil;