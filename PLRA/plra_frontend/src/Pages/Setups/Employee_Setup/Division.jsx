import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler, DialogBox } from "../../../Components/index";
import { RegionHeader } from "../../../Data/Setup_Data/Setup_Data";
import { showToast } from '../../../Components/Common/ToastCard'
import {
  useGetDivisionQuery, usePostDivisionMutation, useDeleteDivisionMutation,
  useUpdateDivisionMutation, useGetRegionQuery,
} from "../../../Features/API/API";
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler";

const Division = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // States
  const [formData, setFormData] = useState({ division_id: "", division_name: "", region: "" });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [regionDialog, setRegionDialog] = useState(false);
  const [regionData, setRegionData] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data: divisionData, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetDivisionQuery();
  const { data: regionApiData, loading: regionLoading, isError: regionRefreshError, error: regionQueryError } = useGetRegionQuery();
  const [postDivision] = usePostDivisionMutation();
  const [updateDivision] = useUpdateDivisionMutation();
  const [deleteDivision] = useDeleteDivisionMutation();

  // Callbacks
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const regionClickHandler = useCallback((selectedRow) => {
    setRegionData(selectedRow.region_name);
    setFormData({ ...formData, region: selectedRow.r_rec_id });
    setRegionDialog(false);
  }, [formData]);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      division_id: event.row.division_id,
      division_name: event.row.division_name,
      region: event.row.region.r_rec_id,
    });
    setSelectedRowID(event.row.d_rec_id);
    setRegionData(event.row.region.region_name);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  const handleDeleteData = useCallback(async () => {
    try {
      const res = await deleteDivision({ selectRowID, deleteSubWingData: formData });
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
  }, [deleteDivision, selectRowID, formData, refetch]);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    try {
      const res = await postDivision(formData);
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
  }, [formData, postDivision, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateDivision({ selectRowID, updateDivisionData: formData });
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
  }, [updateDivision, selectRowID, formData, refetch]);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsRowSelected(false);
    setFormData({ division_id: "", division_name: "", region: "" });
    setRegionData("");
  }, []);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: "division_id",
      headerName: "Division ID",
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "division_name", headerName: "Division", minWidth: 200, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "region",
      headerName: "Region",
      minWidth: 200,
      valueGetter: (params) => params.row?.region?.region_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    }
  ], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Division</Typography>
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
      {/* Form  */}
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField
              name="division_id"
              label="Division ID"
              placeholder="Enter Division ID"
              type="text"
              value={formData.division_id}
              onChange={handleChange}
              mandatory
              InputState={isRowSelected ? true : false}
              error={formErrors?.data?.division_id}
            />
            {regionApiData && regionApiData.results ?
              <div>
                <InputField name="region" label="Region" placeholder="Select Region" value={regionData || ""} isShowIcon={true} onClick={() => setRegionDialog(true)} mandatory error={formErrors?.data?.region} />
                <Multi_Dropdown isOpen={regionDialog} tableHeader={RegionHeader} tableRows={regionApiData.results} onClose={() => setRegionDialog(false)} onSelect={regionClickHandler} RowFilterWith={"r_rec_id"} MinimumWidth={"400px"} />
              </div>
              :
              <InputField
                name="region" label="Region" placeholder="Select Region" value={regionData || ""} isShowIcon={true} onClick={() => setRegionDialog(true)} rror={formErrors?.data?.region} />
            }
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField name="division_name" label="Division" placeholder="Enter Division" type="text" value={formData.division_name} onChange={handleChange} mandatory error={formErrors?.data?.division_name} />
          </Grid>
        </Grid>
      </form>

      {loading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {refreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              divisionData && divisionData?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={divisionData.results}
                  isAddNewButton={true}
                  customPageSize={10}
                  RowFilterWith="d_rec_id"
                  onRowClick={handleRowClick}
                  minHeight={'calc(100vh - 383px)'}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  );
};
export default Division;
