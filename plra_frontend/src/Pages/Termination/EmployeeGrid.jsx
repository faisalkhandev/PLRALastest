import React, { useCallback, useEffect, useState } from 'react';
import CheckBoxDataGrid from '../../Components/Common/CheckBoxDataGrid.jsx';
import { ErrorHandler, Btn } from '../../Components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveData, removeData } from '../../Features/Counter/CounterSlice.js';
import { Box } from "@mui/material";
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { useLazyUpdateElevationQuery, useLazyGenerateElevationQuery } from '../../Features/API/ElevationApi.js';
import { useGetAllEmployeeQuery } from '../../Features/API/API.js';

const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};


const EmployeeGrid = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedRowData, setSelectedRowData] = useState(null);
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




    return (
        <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Breadcrumb title="Termination" breadcrumbItem="Termination / All Employee" />
                <Link to={`/Termination/applytermination/${selectedEmployeeIds.join(',')}`}>
                    <Btn type="Apply" disable={ selectedEmployeeIds?true:false }  />
                </Link>
            </Box>
            {EmployeerefreshError ? (<ErrorHandler online={navigator.onLine} />)
                : (
                    EmployeeData && EmployeeData?.results ? (
                        <CheckBoxDataGrid
                            columns={columns}
                            data={EmployeeData?.results}
                            tableHeading="Employee"
                            isAddNewButton={true}
                            customPageSize={20}
                            RowFilterWith="id"
                            minHeight={'calc(100vh - 200px)'}
                            onSelectionModelChange={handleSelectionModelChange}
                        />
                    ) : null
                )}
        </div>
    );
};
export default EmployeeGrid;
