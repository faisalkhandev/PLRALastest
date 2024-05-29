import React, { useEffect, useState, useCallback } from 'react';
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { Btn, Loader, CheckBoxDataGrid } from '../../Components';
import { Box } from "@mui/material";
import { showToast } from '../../Components/shared/Toast_Card.jsx';
import { useTheme } from '@emotion/react';
import { useGetAllEmployeeQuery } from '../../Features/API/API.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import '../Styles.css';

const renderNullInRed = (params) => {
  const value = params.value;
  if (value === null) return <span style={{ color: 'red' }}>Null</span>;
  return value;
};



const DisciplinaryProceeding = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  let navigate = useNavigate();


  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeQuery();
  const renderCheckbox = (params) => {
    const rowId = params.row.id;
    const isChecked = selectedEmployeeIds.includes(rowId);

    return (
      <input
        type="checkbox"
        onChange={(e) => handleCheckboxChange(rowId, e)}
        checked={isChecked}
      />
    );
  };

  useEffect(() => {
    refetch();
  }, []);

  const handleSelectionModelChange = (selectionModel) => {
    if (selectionModel.length === 1) {
      const selectedId = selectionModel[0];
      setSelectedRowId(selectedId);
      setId(selectedId);
    } else {
      setSelectedRowId(null);
      setId(null);
    }
  };

  const columns = [
    {
      field: "check",
      headerName: '',
      renderCell: renderCheckbox,
      headerClassName: 'checkbox-header'
    },
    {
      field: 'id',
      headerName: 'Employee ID',
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 200,
      renderCell: renderNullInRed,
      valueGetter: (params) => `${params.row.first_name || ""} ${params.row.last_name || ""}`,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
      },
    },
    {
      field: 'father_name',
      headerName: 'Father Name',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };
      },
    },
    {
      field: 'cnic',
      headerName: 'CNIC',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };

      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      minWidth: 200,

      renderCell: (params) => {
        const onView = () => { setSelectedRowData(params.row) };

      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      minWidth: 200,

      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      ),
    },
  ];

  const handleCheckboxChange = useCallback((rowId, e) => {
    if (e.target.checked) {
      const updatedIds = [rowId];
      setSelectedEmployeeIds(updatedIds);
      dispatch(saveData(rowId));
    } else {
      setSelectedEmployeeIds([]);
      dispatch(removeData(rowId));
    }
  }, [dispatch]);

  const navigateHandler = () => {
    if (selectedEmployeeIds.length === 0) {
      showToast("Please select an employee.", "warning");
    } else {
      console.log(selectedEmployeeIds);
      navigate(`/Disciplinary-Proceeding-Form/${selectedEmployeeIds}`);
    }
  };



  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Breadcrumb title="Discplinary Proceeding" breadcrumbItem="Discplinary Proceeding" />
        <Btn type="initiate inquiry" onClick={navigateHandler} />
      </Box>

      {Employeeloading ? (
        <Loader />
      ) : (
        <>
          {EmployeerefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              EmployeeData && EmployeeData?.results ? (
                <CheckBoxDataGrid
                  columns={columns}
                  data={EmployeeData?.results}
                  tableHeading="Employee"
                  isAddNewButton={true}
                  customPageSize={15}
                  RowFilterWith="id"
                  minHeight={'calc(100vh - 200px)'}
                  onSelectionModelChange={handleSelectionModelChange}
                />
              ) : null
            )}
        </>
      )}
    </div>
  );
};

export default DisciplinaryProceeding;

