import React, { Fragment, useState } from 'react';
import { Typography, Grid, Box, Switch } from '@mui/material';
import { Btn, InputField, MyTableContainer, Multi_Dropdown } from '../../../Components/index';
import { useTheme } from '@emotion/react';
import { yearHeader, EmployeeHeader } from "../../../Data/Setup_Data/Setup_Data";


import { useGetLeaveDeductionBucketQuery, useGetLeaveDependableDetailQuery, useGetLeaveRequestQuery, useGetLeaveTypeQuery, usePostLeaveDependableDetailMutation, useUpdateLeaveDependableDetailMutation } from '../../../Features/API/LeavesAPI';
import { useGetEmployeeQuery } from '../../../Features/API/API';

const renderNullInRed = (params) => {
  const value = params.value;
  if (value === null) {
    return <span style={{ color: 'red' }}>Null</span>;
  }
  return value;
};
function LeaveDependableDetail() {
  const theme = useTheme();
  //states
  const [formData, setFormData] = useState({
    leave_request: "", employee: "", hr_year_id: "", apply_date: "",
    attendence_validation: "", leave_type: "", leave_deduction_bucket: "", leave_date: ""
  });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [EmployeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [LeaveTypeDialogOpen, setLeaveTypeDialogOpen] = useState(false);
  const [LeaveRequestDialogOpen, setLeaveRequestDialogOpen] = useState(false);
  const [employee, setEmployeeName] = useState("");
  const [isReport, setIsReport] = useState(false);
  const [LeaveType, setLeaveType] = useState("");
  const [LeaveRequst, setLeaveRequest] = useState("");
  const [LeaveDeduction, setLeaveDeduction] = useState("");
  const [LeaveDeductionDialog, setLeaveDeductionDialog] = useState(false);
  //Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch, } = useGetLeaveDependableDetailQuery();
  const { data: LeaveRequestQuery, Loading: LeaveRequestQueryLoading, isError: LeaveRequestQueryRefreshError, error: LeaveRequestQueryQueryError, } = useGetLeaveRequestQuery();
  const { data: LeaveDeductionBucketQuery, Loading: LeaveDeductionBucketQueryLoading, isError: LeaveDeductionBucketQueryError, error: LeaveDeductionBucketQueryError1, } = useGetLeaveDeductionBucketQuery();
  const { data: LeaveTypeQueryData, Loading: LeaveTypeQueryLoading, isError: LeaveTypeQueryRefreshError, error: LeaveTypeQueryError, } = useGetLeaveTypeQuery();
  const { data: EmployeeQuery, sLoading: EmployeeQueryLoading, isError: EmployeeQueryRefreshError, error: EmployeeQueryError, } = useGetEmployeeQuery();
  const [postLeaveDependableDetail] = usePostLeaveDependableDetailMutation();
  const [updateLeaveDependableDetail] = useUpdateLeaveDependableDetailMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const LeaveRequestHandler = (selectedRow) => {
    setLeaveRequest(selectedRow.leave_request_id)
    setFormData({ ...formData, leave_request: selectedRow.leave_request_id, });
    setLeaveRequestDialogOpen(false);
  };
  const employeeHandler = (selectedRow) => {
    setFormData({ ...formData, employee: selectedRow.id, });
    setEmployeeName(selectedRow.first_name);
    setEmployeeDialogOpen(false);
  };

  const leaveTypeHandler = (selectedRow) => {
    setLeaveType(selectedRow.leave_type)
    setFormData({ ...formData, leave_type: selectedRow.leave_id, });
    setLeaveTypeDialogOpen(false);
  };

  // const LeaveRequestHandler = (selectedRow) => {
  //   setLeaveRequest(selectedRow.sub_wing_name)
  //   setFormData({ ...formData, sub_wing: selectedRow.sw_rec_id, });
  //   setSubWingDialogOpen(false);
  // };
  const yearHandler = () => {

  }
  const handleRowClick = () => {

  }
  const handleSaveData = () => {

  }
  const LeaveDependeableColumns = [
    {
      field: "employee",
      headerName: "Employee ID",
      type: "string",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.employee.first_name ? params.row.employee.first_name : ""} ${params.row.employee.last_name ? params.row.employee.last_name : ""}`,
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      type: "number",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.leave_type.leave_type || ""}`,
    },
    {
      field: "leave_request",
      headerName: "Leave Request",
      type: "string",
      flex: true,
      renderCell: (params) => {
        const filteredLeaveType = LeaveTypeQueryData.results.filter((leave) => leave.leave_id === params.row.leave_request.leave_type);
        if (filteredLeaveType.length > 0) {
          return <span>{filteredLeaveType[0].leave_type}</span>;
        } else {
          return <span>No Leave Type Found</span>;
        }
      },
    },

    {
      field: "apply_date",
      headerName: "Apply Date",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.apply_date || ""}`,
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.status || ""}`,
    },
    {
      field: "attendance_validation",
      headerName: "Attendence Validation ",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.attendance_validation || ""}`,
    }
  ];
  const LeaveApplycolumns = [
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
  const LeaveTypecolumns = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.id || ""}`,
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      type: "string",
      flex: true,
      align: "left",
      headerAlign: "left",
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.leave_type || ""}`,
    },
    {
      field: "leave_description",
      headerName: "Leave Description",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.leave_description || ""}`,
    },
    {
      field: "earning_code",
      headerName: "Earning Code",
      type: "string",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.earning_code || ""}`,
    },
    {
      field: "accrue_annual_limit",
      headerName: "Accrue Annual Limit",
      type: "number",
      align: "left",
      headerAlign: "left",
      flex: true,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.accrue_annual_limit || ""}`,
    },
  ];

  return (
    <Fragment>
      <Typography variant="h4" sx={{ width: 1, display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }} >  Leave Dependent Detail </Typography>
      <Btn type="save" onClick={handleSaveData} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
      <Box sx={{ margin: '10px 0' }}>
        <form action="">
          <Grid container spacing={{ xs: 1, md: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              {LeaveRequestQuery && LeaveRequestQuery.results ?
                <div>
                  <InputField name="leave_request" label="Leave Request" placeholder="Enter Leave Request" type="text" value={formData.leave_request} onClick={() => { setLeaveRequestDialogOpen(true) }} isShowIcon={true} />
                  <Multi_Dropdown isOpen={LeaveRequestDialogOpen} onClose={() => setLeaveRequestDialogOpen(false)} MinimumWidth={'1200px'} tableRows={LeaveRequestQuery.results} tableHeader={LeaveApplycolumns} onSelect={LeaveRequestHandler} RowFilterWith={"leave_request_id"}
                  /></div> : <InputField name="leave_request" label="Leave Request" placeholder="Enter Leave Request" type="text" value={formData.leave_request} onChange={handleChange} isShowIcon={true} />}
              {EmployeeQuery && EmployeeQuery.results ?
                <div>
                  <InputField name="employee" label="Employee " placeholder="Select Employee" type="text" value={employee || ""} onClick={() => { setEmployeeDialogOpen(true) }} isShowIcon={true} />
                  <Multi_Dropdown isOpen={EmployeeDialogOpen} onClose={() => setEmployeeDialogOpen(false)} MinimumWidth={'500px'} tableRows={EmployeeQuery.results} tableHeader={EmployeeHeader} onSelect={employeeHandler} RowFilterWith={"id"}
                  /></div> :
                <InputField name="employee" label="Employee " placeholder="Select Employee" type="text" value={formData.employee} onChange={handleChange} isShowIcon={true} />}
              <InputField name="hr_year_id" label="HR Year ID" placeholder="Enter HR Year ID" type="number" value={formData.hr_year_id} onChange={handleChange} />
              <InputField name="apply_date" label="Apply Date" placeholder="Enter Apply Date" type="date" value={formData.apply_date} onChange={handleChange} />
              <Box sx={{ display: 'flex', flexDirection: 'row' }} >
                <label>Attendence Validation:</label>
                <Switch size="small" checked={isReport} sx={{ ml: 7 }} onClick={(e) => { const handleReport = !isReport; setIsReport(handleReport); setFormData((prevData) => ({ ...prevData, attendence_validation: handleReport })); }} name='active' />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>

              {LeaveTypeQueryData && LeaveTypeQueryData.results ?
                <div>
                  <InputField name="leave_type" label="Leave Type" placeholder="Enter Leave Type" type="text" isShowIcon={true} value={formData.leave_type} onClick={() => { setLeaveTypeDialogOpen(true) }} />

                  <Multi_Dropdown isOpen={LeaveTypeDialogOpen} onClose={() => setLeaveTypeDialogOpen(false)} MinimumWidth={'500px'} tableRows={LeaveTypeQueryData.results} tableHeader={LeaveTypecolumns} RowFilterWith={"leave_id"} onSelect={leaveTypeHandler}
                  /></div> :
                <InputField name="leave_type" label="Leave Type" placeholder="Enter Leave Type" isShowIcon={true} type="text" value={formData.leave_type} onChange={handleChange} />}
              {LeaveDeductionBucketQuery && LeaveDeductionBucketQuery.results ?
                <div>
                  <InputField name="leave_deduction_bucket" label="Deduction Bucket " isShowIcon={true} placeholder="Enter Deduction Bucket" type="text" value={formData.leave_deduction_bucket} onClick={() => { setLeaveDeductionDialog(true) }} />
                  <Multi_Dropdown isOpen={LeaveDeductionDialog} onClose={() => setLeaveDeductionDialog(false)} MinimumWidth={'500px'} tableRows={LeaveDeductionBucketQuery.results} tableHeader={LeaveTypecolumns} RowFilterWith={"l_d_b_rec_id"}
                  />  </div> :
                <InputField name="leave_deduction_bucket" label="Deduction Bucket " isShowIcon={true} placeholder="Enter Deduction Bucket" type="text" value={formData.leave_deduction_bucket} onChange={handleChange} />
              }
              <InputField name="leave_date" label="Leave Date" placeholder="Enter Approval Date" type="date" value={formData.leave_date} onChange={handleChange} />
              <InputField name="status" label="Status" placeholder="Enter Status " type="text" value={formData.status} onChange={handleChange} />
            </Grid>
          </Grid>
        </form>
      </Box>

      {loading && <p>Loading...</p>}
      {refreshError && <p>Error while refreshing: {refreshError.message}</p>}
      {queryError && <p>Error while querying: {queryError.message}</p>}
      {data && (
        <MyTableContainer
          columns={LeaveDependeableColumns}
          data={data.results}
          isAddNewButton={true}
          customPageSize={10}
          RowFilterWith="l_d_d_rec_id"
          onRowClick={handleRowClick}
          outerCSS={{ mt: 4 }}
        />
      )}
    </Fragment>
  )

}


export default LeaveDependableDetail

