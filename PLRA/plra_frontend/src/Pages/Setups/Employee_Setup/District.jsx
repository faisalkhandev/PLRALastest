import React, { useState, useCallback, Fragment, useMemo } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField } from "../../../Components/index";
import {
  useGetDistrictQuery, usePostDistrictMutation, useUpdateDistrictMutation,
  useGetDivisionQuery, useDeleteDistrictMutation
} from '../../../Features/API/API'
import { MyTableContainer, Multi_Dropdown, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import "../../Styles.css"
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler";

const District = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});


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
    setFormErrors({});
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
  }, [deleteDistrict, selectRowID, resetForm, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
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
    try {
      const res = await postDistrict(formData);
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
  }, [formData, postDistrict, resetForm, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateDistrict({ selectRowID, updateDistrictData: formData });
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
  }, [updateDistrict, selectRowID, formData, resetForm, refetch]);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'district_id',
      headerName: 'District ID',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'district_name', headerName: 'District', minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'division',
      headerName: 'Division',
      minWidth: 200,
      valueGetter: (params) => params.row?.division?.division_name || '',
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
      valueGetter: (params) => params.row?.division?.region?.region_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>District</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
        <Btn onClick={isRowSelected ? () => setDistrictDialog(true) : handleSaveData} type="save" />
        {
          districtDialog ?
            <DialogBox
              open={districtDialog}
              onClose={() => setDistrictDialog(false)}
              closeClick={() => setDistrictDialog(false)}
              sureClick={() => { handleUpdateData(); setDistrictDialog(false); }}
              title={"Are you sure you want to update the record?"}
            /> : ''
        }
        <Btn type="delete" onClick={handleDeleteDialog} />
        {
          deleteDialog ?
            <DialogBox
              open={deleteDialog}
              onClose={() => setDeleteDialog(false)}
              closeClick={() => setDeleteDialog(false)}
              sureClick={() => { handleDelete(); setDeleteDialog(false); }}
              title={"Are you sure you want to delete the record?"}
            /> : ''
        }
      </Box>

      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 1 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="district_id" label="District ID" placeholder="Enter District ID" value={formData.district_id} type="text" onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.district_id} />
            {divisionDataApi && divisionDataApi.results ?
              <div>
                <InputField name="division" label="Division " placeholder="Select Division" value={divisionData || ''} type="text" isShowIcon={true} onClick={() => setDivisionDialog(true)} mandatory error={formErrors?.data?.division} />
                <Multi_Dropdown RowFilterWith={"d_rec_id"} onClose={() => setDivisionDialog(false)} isOpen={divisionDialog} tableHeader={divisionHeader} tableRows={divisionDataApi.results} onSelect={divisionClickHandler} MinimumWidth={"500px"} />
              </div>
              :
              <InputField name="division" label="Division " placeholder="Select Division" value={divisionData || ''} type="text" isShowIcon={true} onClick={() => setDivisionDialog(true)} error={formErrors?.data?.division} />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="district_name" label="District" placeholder="Enter District Name" type="text" value={formData.district_name} onChange={handleChange} mandatory error={formErrors?.data?.district_name} />
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
                  minHeight={'calc(100vh - 384px)'}
                />
              ) : null
            )}
        </>
      )}
    </Box>
  );
};

export default District;
