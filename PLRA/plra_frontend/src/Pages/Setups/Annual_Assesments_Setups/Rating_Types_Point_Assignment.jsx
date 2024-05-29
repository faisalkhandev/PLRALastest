import React, { useState, Fragment } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer } from '../../../Components/index';
import {
  useGetRatingTypePointAssignmentQuery, usePostRatingTypePointAssignmentMutation,
  useUpdateRatingTypePointAssignmentMutation, useGetEmployeeQuery
} from '../../../Features/API/API';
import "../../Styles.css"
import { toast } from 'react-toastify'
import { EmployeeHeader } from "../../../Data/Setup_Data/Setup_Data";


const Rating_Types_Point_Assignment = () => {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ employee: '', category: '', max_points: '', point_earned: '' });
  const [editDialog, setEditDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [employeeData, setEmployeeData] = useState("");
  const [ratingTypePointAssignmentDialog, setRatingTypePointAssignmentDialog] = useState(false);


  //Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetRatingTypePointAssignmentQuery();
  const [postRatingTypePointAssignment] = usePostRatingTypePointAssignmentMutation();
  const [updateRatingTypePointAssignment] = useUpdateRatingTypePointAssignmentMutation();
  const { data: employee_data, isLoading: employee_loading, isError: employee_refreshError, error: employee_queryError, employee_refetch } = useGetEmployeeQuery();

  //Functions
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({ employee: '', category: '', max_points: " ", point_earned: " " });
    setEmployeeData("")
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (['max_points', 'point_earned'].includes(name) && parseInt(value) < 1) {
      toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can't be a negative number`, { position: "top-center", autoClose: 3000 })
      return;
    }

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //Employee Dialog Click Listeners
  const employeeClickHandler = (selectedRow) => {
    setEmployeeData(selectedRow.first_name + " " + selectedRow.last_name)
    setFormData({ ...formData, employee: selectedRow.id, });
    setEmployeeDialog(false);
  };

  const handleRowClick = (event) => {
    setIsRowSelected(true)
    console.log("Hello")
    setFormData({
      employee: event.row.employee.id,
      category: event.row.category,
      max_points: event.row.max_points,
      point_earned: event.row.point_earned,
    })
    setSelectedRowID(event.row.id);
    setEmployeeData(event.row.employee.first_name + " " + event.row.employee.last_name)
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.employee == '' || formData.category == '' || formData.max_points == '' || formData.point_earned == '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await postRatingTypePointAssignment(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something went wrong !!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Rating Point Assignment create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({ employee: '', category: '', max_points: '', point_earned: '' });
          setEmployeeData("");
          refetch();
        }
      } catch (err) {
        console.error('Error creating Rating Type Point Assignment:', err, { position: "top-center", autoClose: 3000 });
      }
    };
  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updateRatingTypePointAssignment({ selectRowID, updateRatingTypePointAssignmentData: formData });
      if (res.error) {
        toast.error("ID already exist", { position: "top-center", autoClose: 3000 });
      } else {
        toast.success("Rating Point Assignment Updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({ employee: '', category: '', max_points: '', point_earned: '' });
        setEmployeeData("");
        refetch();
      }
    } catch (err) { console.error('Error creating Rating Point Assignment:', err, { position: "top-center", autoClose: 3000 }); }
  }


  const columns = [
    {
      field: 'id', headerName: 'Employee ID', flex: true,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
      },
    },
    {
      field: 'employee', headerName: 'Employee Name', flex: true,
      renderCell: (params) => { return (<span > {params.row.employee.first_name + ' ' + params.row.employee.last_name} </span>); },
    },
    { field: 'category', headerName: 'Category', flex: true },
    { field: 'max_points', headerName: 'Max Points', flex: true },
    { field: 'point_earned', headerName: 'Point Earned', flex: true },
  ];

  return (
    <Fragment>
      <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}> Rating Type Point Assignment</Typography>
      <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="delete" onClick={() => setRatingTypePointAssignmentDialog(true)} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
      </Box>

      <form action="">
        <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {employee_data && employee_data.results ?
              <div>
                <InputField name="employee" label="Employee" placeholder="Select Employee" value={employeeData} isShowIcon={true} onClick={() => setEmployeeDialog(true)} />
                <Multi_Dropdown RowFilterWith={"id"} isOpen={employeeDialog} tableHeader={EmployeeHeader} tableRows={employee_data.results} onSelect={employeeClickHandler} />
              </div> : <InputField name="employee" label="Employee" placeholder="Select Employee" value={employeeData} isShowIcon={true} onClick={() => setEmployeeDialog(true)} />
            }
            <InputField name="max_points" label="Max Points" placeholder="Enter Max Points" type="number" value={formData.max_points || ""} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="category" label="Category" placeholder="Enter Category" type="text" value={formData.category || ""} onChange={handleChange} />
            <InputField name="point_earned" label="Earned Points" placeholder="Enter Earned Points" type="number" value={formData.point_earned} onChange={handleChange} />
          </Grid>
        </Grid>
      </form>

      {loading && <p>Loading...</p>}
      {refreshError && <p>Error while refreshing: {refreshError.message}</p>}
      {queryError && <p>Error while querying: {queryError.message}</p>}
      {data && (
        <MyTableContainer
          columns={columns}
          data={data.results}
          isAddNewButton={true}
          customPageSize={10}
          RowFilterWith="id"
          onRowClick={handleRowClick}
          outerCSS={{ mt: 4 }}
        />
      )}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" > Do you want to Update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>

      <Dialog open={ratingTypePointAssignmentDialog} onClose={() => setRatingTypePointAssignmentDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to delete this record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setRatingTypePointAssignmentDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setRatingTypePointAssignmentDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>

    </Fragment>
  )
}

export default Rating_Types_Point_Assignment
