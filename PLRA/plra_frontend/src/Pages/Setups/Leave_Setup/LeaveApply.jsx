import React, { Fragment, useState } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { Btn, InputField, MyTableContainer } from '../../../Components/index';
import { useTheme } from '@emotion/react';
import { toast } from 'react-toastify';
import SimpleDropdown from '../../../Components/Common/SimpleDropDown';
import {
  useGetLeaveRequestQuery, usePostLeaveRequestMutation,
  useUpdateLeaveRequestMutation, useDeleteLeaveRequestMutation,
  useGetLeaveApplyTimeQuery
} from '../../../Features/API/LeavesAPI';


const renderNullInRed = (params) => {
  const value = params.value;
  if (value === null) { return <span style={{ color: 'red' }}>Null</span> }
  return value;
};


function LeaveApply() {
  const theme = useTheme();
  //states
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [leaveapplydeleteialog, setleaveapplydeleteialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [leaveapplydialog, setleaveapplydialog] = useState(false);
  const [formData, setFormData] = useState({
    employee: 1, leave_type: '',
    from_date: '', to_date: '',
    report_back_date: '', notes: '', attachments: ''
  });

  // Queries
  const { data: LeaveApplyData, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetLeaveRequestQuery();
  const [PostLeaveApply] = usePostLeaveRequestMutation();
  const [updateLeaveApply] = useUpdateLeaveRequestMutation();
  const [deleteLeaveApply] = useDeleteLeaveRequestMutation();
  const { data: leavetypeData, isLoading: leavetypeloading, isError: leavetyperefreshError, error: leavetypequeryError, leavetyperefetch } = useGetLeaveApplyTimeQuery();

  //functions
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({
      employee: 1, leave_type: '',
      from_date: '', to_date: '',
      report_back_date: '', notes: '', attachments: ''
    })
  }
  const handleUpdateData = async (e) => {
    try {
      const res = await updateLeaveApply({ selectRowID, updateLeaveApplyData: formData });
      if (res.error) {
        console.log(res)
        toast.error("ID alreay exist.");
      } else {
        toast.success("Leave  Updated successfully.");
        setFormData({
          employee: '1', leave_type: '',
          from_date: '', to_date: '',
          report_back_date: '', notes: '',
        })
        refetch();
      }
    } catch (err) {
      console.error('Error creating Leave:', err);
    }
  }
  const handleDeleteData = async (e) => {
    try {
      const res = await deleteLeaveApply({ selectRowID });
      if (res.error) {
        console.log(res)
        toast.error("ID alreay exist.");
      } else {
        toast.success("Record Deleted successfully.");
        setFormData({
          employee: '1', leave_type: '',
          from_date: '', to_date: '',
          report_back_date: '', notes: '',
        })
        refetch();
      }
    } catch (err) {
      console.error('Error creating Leave :', err);
    }
  }
  const handleRowClick = (event) => {
    setIsRowSelected(true);
    setFormData({
      leave_type: event.row.leave_type.leave_id,
      from_date: event.row.from_date,
      to_date: event.row.to_date,
      report_back_date: event.row.report_back_date,
      notes: event.row.notes,
      attachments: event.row.attachments,
    });
    setSelectedRowID(event.row.leave_request_id);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.employee == '' || formData.to_date == '' || formData.leave_type == '' || formData.from_date == '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await PostLeaveApply(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID alredy exist.") }
          // else if 
          else { toast.error("Something is wrong!!!") }
        } else {
          toast.success("Data create successfully.")
          setFormData({
            employee: '1', leave_type: '',
            from_date: '', to_date: '',
            report_back_date: '', notes: '',
          })
          refetch();
        }
      } catch (err) {
        console.error('Error creating LeaveType:', err);
      }
    }
  }
  //columns
  const LAcolumns = [
    {
      field: "leave_request_id",
      headerName: "Leave ID",
      type: "number",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params.row.leave_request_id}
          </span>

        );
      },
      onRowClick: handleRowClick,
      valueGetter: (params) => `${params.row.leave_request_id || ""}`,
    },
    {
      field: "employee",
      headerName: "Employee ID",
      type: "string",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.employee.first_name || ""} ${params.row.employee.last_name || ""}`,
    },

    {
      field: "leave_type",
      headerName: "Leave Type",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.leave_type.leave_type || ""}`,
    },
    {
      field: "leave_deduction_bucket_id",
      headerName: "Leave Deduction Bucket",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.leave_deduction_bucket_id.leave_type || ""}`,
    },
    {
      field: "hr_year_id",
      headerName: "HR Year",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.hr_year_id || ""}`,
    },
    {
      field: "apply_date",
      headerName: "Apply Date",
      type: "number",
      flex: true,
      align: "left",
      headerAlign: "Left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.apply_date || ""}`,
    },
    {
      field: "from_date",
      headerName: "Starting Date",
      type: "number",
      flex: true,
      align: "left",
      headerAlign: "Left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.from_date || ""}`,
    },

    {
      field: "to_date",
      headerName: "Ending Date",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.to_date || ""}`,
    },
    {
      field: "report_back_date",
      headerName: "Report Back Date",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.report_back_date || ""}`,
    },
    {
      field: "days_count",
      headerName: "Total Days",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.days_count || ""}`,
    },
    {
      field: "notes",
      headerName: "Notes",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.notes || ""}`,
    },
    {
      field: "attachment",
      headerName: "Attachments",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.attachment ? "YES" : "No"}`,
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.status || ""}`,
    }

  ];



  return (
    <Fragment>
      <Typography variant="h4" sx={{ width: '100%', display: "flex", justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>Apply Leave</Typography>
      <Box sx={{ width: "100%", display: "flex", justifyContent: 'end', marginBottom: 2 }}>
        <Btn type="reset" onClick={resetForm} />
        <Btn type="save" onClick={isRowSelected ? () => setleaveapplydialog(true) : handleSaveData} />
        <Btn type="delete" onClick={() => setleaveapplydeleteialog(true)} />
      </Box>

      <Box sx={{ margin: '10px 0' }}>
        <form action="" sx={{ marginTop: '20px' }}>
          <Grid container spacing={{ xs: 1, md: 4 }} >
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              <SimpleDropdown
                label="Leave Type"
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                options={leavetypeData && leavetypeData.results}
              />
              <InputField name="from_date" label="From Date" placeholder="Enter Start Date " type="date" value={formData.from_date} onChange={handleChange} />
              <InputField name="to_date" label="To Date" placeholder="Enter End Date " type="date" value={formData.to_date} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              <InputField name="report_back_date" label="Report Back Date" placeholder="Enter Report Back Date" type="date" value={formData.report_back_date} onChange={handleChange} />
              <InputField name="attachments" label="Attachments" placeholder="Enter Attachments" type="file" value={formData.attachments} onChange={handleChange} />
              {/* <Textarea placeholder="Enter Notes" minRows={2}value={formData.notes} onChange={handleChange} />               */}
              <InputField name="notes" label="Notes" placeholder="Enter Notes" type="file" multiline={true} value={formData.notes} onChange={handleChange} />

            </Grid>
          </Grid>
        </form> </Box>
      <Box sx={{ margin: '20px 0' }}>
        {LeaveApplyData && (
          <MyTableContainer
            columns={LAcolumns} data={LeaveApplyData.results} tableHeading="Salary" customPageSize={17} RowFilterWith="leave_request_id" />
        )}
      </Box>
      <Dialog open={leaveapplydialog} onClose={() => setleaveapplydialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setleaveapplydialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setleaveapplydialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={leaveapplydeleteialog} onClose={() => setleaveapplydeleteialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to delete this record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setleaveapplydeleteialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setleaveapplydeleteialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  )
}

export default LeaveApply
