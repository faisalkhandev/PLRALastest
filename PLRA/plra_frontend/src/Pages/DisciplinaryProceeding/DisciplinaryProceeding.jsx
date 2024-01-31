import React, { useState, Fragment } from 'react'
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { Btn } from '../../Components';
import { MyTableContainer } from '../../Components';
import { rows } from '../../Data/Dummy_Data/Dummy__Data';
import { Box } from "@mui/material";
import { Link } from 'react-router-dom';
import '../Styles.css'

const renderNullInRed = (params) => {
  const value = params.value;
  if (value === null) <span style={{ color: 'red' }}>Null</span>
  return value;
};

const columns = [
  {
    field: "employee_no",
    headerName: "Employee Number",
    type: "string",
    flex: true,
    renderCell: renderNullInRed,
    renderCell: (params) => {
      const onView = () => { setSelectedRowData(params.row) };
      return (
        <Link to="/Disciplinary-Proceeding-Form" style={{ color: "#379237", textDecoration: 'underline' }} onClick={true}> {params.value} </Link>
      );
    },
  },
  {
    field: "name",
    headerName: "Employee Name",
    type: "string",
    flex: true,
    renderCell: renderNullInRed,
    valueGetter: (params) =>
      `${params.row.first_name || ""} ${params.row.last_name || ""}`,
  },
  {
    field: "name1",
    headerName: "Complaint ",
    type: "string",
    flex: true,
    renderCell: renderNullInRed,
    valueGetter: (params) =>
      `${params.row.first_name || ""} ${params.row.last_name || ""}`,
  },
  
  {
    field: "name2",
    headerName: "Status ",
    type: "string",
    flex: true,
    renderCell: renderNullInRed,
    valueGetter: (params) =>
      `${params.row.first_name || ""} ${params.row.last_name || ""}`,
  },
];

const DisciplinaryProceeding = () => {
  return (
    <div className="customBox">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",mb:4 }} >
        <Breadcrumb title="Employee" breadcrumbItem="Employee / Disciplinary Proceeding" />
        <Link to="/Disciplinary-Proceeding-Form"><Btn type="new" /> </Link> 
      </Box>

      <MyTableContainer
        columns={columns}
        data={rows}
        tableHeading="Employee"
        isAddNewButton={true}
        customPageSize={20}
        route={"/employee/basic_information/AddEmployee"}
        RowFilterWith="id"
      />
    </div>
  )
}

export default DisciplinaryProceeding
