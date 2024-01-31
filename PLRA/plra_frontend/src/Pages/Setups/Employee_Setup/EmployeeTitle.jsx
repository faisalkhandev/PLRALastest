import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Warning } from '../../../Assets/Icons';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler } from '../../../Components/index';
import {
  useDeleteEmployeeTitleMutation, useGetEmployeeTitleQuery, usePostEmployeeTitleMutation,
  useUpdateEmployeeTitleMutation
} from '../../../Features/API/API';
import { toast } from 'react-toastify';

const EmployeeTitle = () => {
  const theme = useTheme();

  // States
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ employee_title: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const {
    data,
    isLoading: loading,
    isError: refreshError,
    error: queryError,
    refetch,
  } = useGetEmployeeTitleQuery();
  const [postEmployeeTitle] = usePostEmployeeTitleMutation();
  const [updateEmployeeTitle] = useUpdateEmployeeTitleMutation();
  const [deleteEmployeeTitle] = useDeleteEmployeeTitleMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setIsRowSelected(false);
    setFormData({ employee_title: '' });
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      employee_title: event.row.employee_title,
    });
    setSelectedRowID(event.row.e_t_rec_id);
  }, []);

  const handleSaveData = useCallback(async (e) => {
    e.preventDefault();
    if (formData.employee_title === '') {
      toast.error("Mandatory field's should not be empty.", { position: 'top-center', autoClose: 3000 });
    } else {
      try {
        const res = await postEmployeeTitle(formData);
        if (res.error) {
          if (res.error.status === 400) {
            toast.error('ID already exists.', { position: 'top-center', autoClose: 3000 });
          } else {
            toast.error('Something is wrong!!!', { position: 'top-center', autoClose: 3000 });
          }
        } else {
          toast.success('Employee Title created successfully.', { position: 'top-center', autoClose: 3000 });
          setFormData({ employee_title: '' });
          refetch();
        }
      } catch (err) {
        console.error('Error creating Employee Title:', err);
      }
    }
  }, [formData, postEmployeeTitle, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateEmployeeTitle({ selectRowID, updateEmployeeData: formData });
      if (res.error) {
        toast.error('ID already exists.', { position: 'top-center', autoClose: 3000 });
      } else {
        toast.success('Employee Title Updated successfully.', { position: 'top-center', autoClose: 3000 });
        setFormData({ employee_title: '' });
        setIsRowSelected(false);
        refetch();
      }
    } catch (err) {
      console.error('Error updating Employee Title:', err);
    }
  }, [formData, selectRowID, updateEmployeeTitle, refetch]);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deleteEmployeeTitle({ selectRowID });
      if (res.error) {
        if (res.error.status === 409) {
          toast.error('Record not deleted due to connectivity.', { position: 'top-center', autoClose: 3000 });
        } else {
          toast.error('Something is wrong!!!', { position: 'top-center', autoClose: 3000 });
        }
      } else {
        toast.success('Employee Title deleted.', { position: 'top-center', autoClose: 3000 });
        setFormData({ employee_title: '' });
        setIsRowSelected(false);
        refetch();
      }
    } catch (err) {
      console.error('Error deleting Employee Title:', err);
    }
  }, [deleteEmployeeTitle, selectRowID, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      toast.error('Record not selected.', { position: 'top-center', autoClose: 3000 });
    }
  }, [isRowSelected]);

  // Memoized values
  const columns = useMemo(
    () => [
      {
        field: 'employee_title',
        headerName: 'Employee Title',
        flex: 1,
        renderCell: (params) => {
          const onView = () => {
            handleRowClick(params);
          };
          return (
            <span
              onClick={onView}
              className="table_first_column"
              style={{ color: '#379237', textDecoration: 'underline' }}
            >
              {params.value}
            </span>
          );
        },
      },
    ],
    [handleRowClick]
  );

  // Effects
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Employee Title</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
          <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
          <Btn type="delete" onClick={handleDeleteDialog} />
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={4}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 4 }}>
              <InputField name="employee_title" label="Employee Title" value={formData.employee_title || ""} placeholder="Select Title" type="text" onChange={handleChange} />
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
                    RowFilterWith="e_t_rec_id"
                    onRowClick={handleRowClick}
                    outerCSS={{ mt: 4 }}
                    minHeight={"calc(100vh - 350px)"}
                  />
                ) : null
              )}
          </>
        )}

        <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '350px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} > <Warning />Do you want to update your data.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
        <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '350px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} > <Warning />Do you want to delete your data.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleDelete(); setdeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setdeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Fragment>
    </>
  )
}
export default EmployeeTitle