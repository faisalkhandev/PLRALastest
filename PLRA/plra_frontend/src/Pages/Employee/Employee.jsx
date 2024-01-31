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
      headerName: "Employee Number",
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
        return (
          <Link to={`/employee/${params.id}`} style={{ color: "#379237", textDecoration: 'underline' }} onClick={onView}> {params.value} </Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      renderCell: renderNullInRed,
      valueGetter: (params) =>
        `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "father_name",
      headerName: "Father Name",
      minWidth: 200,
    },
    {
      field: "cnic",
      headerName: "CNIC",
      minWidth: 200,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      minWidth: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      minWidth: 200,
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
        <Link to='/Basic_Info'><Btn type="add" /></Link>
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
                  customPageSize={20}
                  route={"/employee/basic_information/AddEmployee"}
                  RowFilterWith="id"
                  minHeight={"calc(100vh - 200px)"}
                />
              ) : null
            )}
        </>
      )}
    </div>
  )
}

export default Employee