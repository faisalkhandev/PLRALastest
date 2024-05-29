import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import {
  useDeleteEmployeeTitleMutation, useGetEmployeeTitleQuery, usePostEmployeeTitleMutation,
  useUpdateEmployeeTitleMutation
} from '../../../Features/API/API';
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const EmployeeTitle = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // States
  const [editDialog, setEditDialog] = useState(false);
  const [formData, setFormData] = useState({ employee_title: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch, } = useGetEmployeeTitleQuery();
  const [postEmployeeTitle] = usePostEmployeeTitleMutation();
  const [updateEmployeeTitle] = useUpdateEmployeeTitleMutation();
  const [deleteEmployeeTitle] = useDeleteEmployeeTitleMutation();

  // Callbacks
  const resetForm = useCallback(() => {
    setFormErrors({});
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
    try {
      const res = await postEmployeeTitle(formData);
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
  }, [formData, postEmployeeTitle, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateEmployeeTitle({ selectRowID, updateEmployeeData: formData });
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
  }, [formData, selectRowID, updateEmployeeTitle, refetch]);

  const handleDelete = useCallback(async () => {
    try {
      const res = await deleteEmployeeTitle({ selectRowID });
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
  }, [deleteEmployeeTitle, selectRowID, refetch]);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
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
          const onView = () => { handleRowClick(params) };
          return (
            <span onClick={onView} className='table_first_column'>{params.value}</span>
          );
        },
      },
    ],
    [handleRowClick]
  );

  return (
    <>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Employee Title</Typography>
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
                onClose={() => setDeleteDialog(false)}
                closeClick={() => setDeleteDialog(false)}
                sureClick={() => { handleDelete(); setDeleteDialog(false); }}
                title={"Are you sure you want to delete the record?"}
              /> : ''
          }
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={4}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 4 }}>
              <InputField name="employee_title" label="Employee Title" value={formData.employee_title || ""} placeholder="Select Title" type="text" onChange={handleChange} error={formErrors?.data?.employee_title} />
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
                    minHeight={"calc(100vh - 368px)"}
                  />
                ) : null
              )}
          </>
        )}
      </Fragment>
    </>
  )
}
export default EmployeeTitle