import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Typography, Grid, Dialog, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from "../../../Components/index";
import { RegionHeader } from "../../../Data/Setup_Data/Setup_Data";
import { Warning } from '../../../Assets/Icons';
import { toast } from 'react-toastify';
import {
  useGetDivisionQuery, usePostDivisionMutation, useDeleteDivisionMutation,
  useUpdateDivisionMutation, useGetRegionQuery,
} from "../../../Features/API/API";

const Division = () => {
  const theme = useTheme();

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
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }, [isRowSelected]);

  const handleDeleteData = useCallback(async () => {
    try {
      const res = await deleteDivision({ selectRowID, deleteSubWingData: formData });
      if (res.error) {
        if (res.error.status === 500) {
          return toast.error("Server is not working", { position: "top-center", autoClose: 3000 });
        } else if (res.error.status === 409) {
          return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 });
        } else {
          return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 });
        }
      }
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setIsRowSelected(false);
      setFormData({ division_id: "", division_name: "" });
      resetForm();
      refetch();
    } catch (err) {
      console.error('Error Deleting Sub Wing:', err);
    }
  }, [deleteDivision, selectRowID, formData, refetch]);

  const handleSaveData = useCallback(async (e) => {
    if (formData.division_id === '' || formData.division_name === '' || formData.region === '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      e.preventDefault();
      try {
        const res = await postDivision(formData);
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
          } else {
            toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
          }
        } else {
          toast.success("Division created successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ division_id: "", division_name: "" });
          resetForm();
          refetch();
        }
      } catch (err) {
        console.error("Error creating Division:", err);
      }
    }
  }, [formData, postDivision, refetch]);

  const handleUpdateData = useCallback(async () => {
    if (formData.division_id === '' || formData.division_name === '' || formData.region === '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      try {
        const res = await updateDivision({ selectRowID, updateDivisionData: formData });
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("ID already exists.", { position: "top-center", autoClose: 3000 });
          } else {
            toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
          }
        } else {
          toast.success("Division Updated successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({ division_id: "", division_name: "", region: "" });
          resetForm();
          refetch();
        }
      } catch (err) {
        console.error("Error updating Division:", err);
      }
    }
  }, [updateDivision, selectRowID, formData, refetch]);

  const resetForm = useCallback(() => {
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
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column" style={{ color: "#379237", textDecoration: 'underline' }}>{params.value}</span>
        );
      },
    },
    { field: "division_name", headerName: "Division", minWidth: 200 },
    {
      field: "region",
      headerName: "Region",
      minWidth: 200,
      renderCell: (params) => <span className='table_first_column'>{params.row.region.region_name}</span>,
    },
  ], [handleRowClick]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Division</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        <Btn type='delete' onClick={handleDeleteDialog} />
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
            />
            {regionApiData && regionApiData.results ?
              <div>
                <InputField
                  name="region"
                  label="Region"
                  placeholder="Select Region"
                  value={regionData || ""}
                  isShowIcon={true}
                  onClick={() => setRegionDialog(true)}
                  mandatory
                />
                <Multi_Dropdown
                  isOpen={regionDialog}
                  onClose={() => setRegionDialog(false)}
                  tableHeader={RegionHeader}
                  tableRows={regionApiData.results}
                  onSelect={regionClickHandler}
                  RowFilterWith={"r_rec_id"}
                  MinimumWidth={"400px"}
                />
              </div>
              :
              <InputField
                name="region"
                label="Region"
                placeholder="Select Region"
                value={regionData || ""}
                isShowIcon={true}
                onClick={() => setRegionDialog(true)}
              />
            }
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="division_name"
              label="Division"
              placeholder="Enter Division"
              type="text"
              value={formData.division_name}
              onChange={handleChange}
              mandatory
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
              divisionData && divisionData?.results ? (
                <MyTableContainer
                columns={columns}
                data={divisionData.results}
                isAddNewButton={true}
                customPageSize={10}
                RowFilterWith="d_rec_id"
                onRowClick={handleRowClick}
                minHeight={'calc(100vh - 360px)'}
              />
              ) : null
            )}
        </>
      )}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} ><Warning />Do you want to update your data.</Typography>
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

export default Division;
