import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { Btn, Loader, ErrorHandler } from '../../Components';
import { useGetAllEmployeeQuery } from '../../Features/API/API';
import { MyTableContainer } from '../../Components';
import { Box } from "@mui/material";
import { Link } from 'react-router-dom';
import '../Styles.css'

const renderNullInRed = (params) => {
  const value = params.value;
  if (value === null) <span style={{ color: 'red' }}>Null</span>
  return value;
};


const Employee = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeQuery();

  useEffect(() => {
    refetch();
  }, []);
  const columns = [
    {
      field: "employee_no",
      headerName: "Employee ID",
      minWidth: 120,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#000" }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 230,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#000" }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "father_name",
      headerName: "Father Name",
      minWidth: 230,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#000" }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "cnic",
      headerName: "CNIC",
      minWidth: 140,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#000" }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      minWidth: 140,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#000" }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "position",
      headerName: "Position",
      minWidth: 200,
      valueGetter: (params) => `${params?.row?.position?.position_desc || ""}`,
    },
    {
      field: "center_name",
      headerName: "Center",
      minWidth: 140,
      valueGetter: (params) => `${params?.row?.center?.center_name || ""}`,
    },
    {
      field: "wing",
      headerName: "Wing",
      minWidth: 70,
      valueGetter: (params) => `${params?.row?.position?.wing?.wing_id || ""}`,
    },
    {
      field: "subwing",
      headerName: "Sub Wing",
      minWidth: 70,
      valueGetter: (params) => `${params?.row?.position?.sub_wing?.sub_wind_id || ""}`,
    },
    {
      field: "is_active",
      headerName: "Status",
      minWidth: 80,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      ),
    },
  ];


  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Breadcrumb title="Employee" breadcrumbItem="Employee / Employee List" />
        <Link to='/add_new_employee'><Btn type="add" /></Link>
      </Box>
      {Employeeloading ? (
        <Loader />
      ) : (
        <>
          {EmployeerefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              EmployeeData && EmployeeData?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={EmployeeData.results}
                  tableHeading="Employee"
                  isAddNewButton={true}
                  customPageSize={16}
                  route={"/employee/basic_information/AddEmployee"}
                  RowFilterWith="id"
                  minHeight={"calc(100vh - 218px)"}
                />
              ) : null
            )}
        </>
      )}
    </div>
  )
}

export default Employee