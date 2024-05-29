
import React, { useCallback, useEffect, useState } from 'react';
import CheckBoxDataGrid from '../../Components/Common/CheckBoxDataGrid.jsx';
import { Loader, ErrorHandler, Btn } from '../../Components/index.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveData, removeData } from '../../Features/Counter/CounterSlice.js';
import { Box } from "@mui/material";
import Breadcrumb from '../../Components/Common/BreadCrumb.jsx';
import { useGetAllEmployeeQuery } from '../../Features/API/API.js';
import { GoBack } from '../../Assets/Icons/index.jsx';
import { useTheme } from '@emotion/react';

const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};

const AllEmployees = () => {
    const dispatch = useDispatch();
    const theme =useTheme();
    //   queries
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeQuery();

    const renderCheckbox = (params) => {
        const rowId = params?.row?.id;
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
            valueGetter: (params) => `${params?.row?.first_name || ""} ${params?.row?.last_name || ""}`,
            renderCell: (params) => {

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
            field: 'wing',
            headerName: 'Wing',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.wing?.wing_name}`,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params.row) };

            },
        },
        {
            field: 'job',
            headerName: 'Job',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.job?.job_title}`,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params?.row?.position?.job?.job_title) };

            },
        },
        {
            field: 'position',
            headerName: 'Position',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.position_desc}`,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params?.row?.position?.position_desc) };

            },
        },
        {
            field: 'district',
            headerName: 'District',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.location?.district?.district_name}`,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params?.row?.position?.location?.district?.district_name) };

            },
        },
        {
            field: 'tehsil',
            headerName: 'Tehsil',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.location?.tehsil?.t_name}`,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params?.row?.position?.location?.tehsil?.t_name) };

            },
        },
        {
            field: 'location',
            headerName: 'Location',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.location?.center_name}`,

            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params?.row?.position?.location?.center_name) };

            },
        },
        {
            field: 'address',
            headerName: 'Address',
            minWidth: 200,
            valueGetter: (params) => `${params?.row?.position?.location?.district?.district_name || ""} ${params?.row?.position?.location?.tehsil?.t_name || ""} `,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(`${params?.row?.position?.location.district?.district_name || ""} ${params?.row?.position?.location?.tehsil?.tehsil_name || ""} `) };

            },
        },
    ];

    return (
        <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{display:"flex"}}>
                <Box
              sx={{
                width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
              }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                       <Breadcrumb title="Administrative Transfer" breadcrumbItem="Administrative / Employee" />

            </Box>
            {selectedEmployeeIds.length > 0 && (
                <Link to={`/applyTransfer/${selectedEmployeeIds.join(',')}`}>
                    <Btn type="Apply" />
                </Link>
            )}
            </Box>

            {Employeeloading ? (
                <Loader placement={{ marginTop: '-100px' }} />
            ) : (
                <>
                    {EmployeerefreshError ? (<ErrorHandler online={navigator.onLine} />)
                        : (
                            EmployeeData && EmployeeData.results ? (
                                <CheckBoxDataGrid
                                    columns={columns}
                                    data={EmployeeData.results}
                                    tableHeading="Employee"
                                    isAddNewButton={true}
                                    customPageSize={20}
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

export default AllEmployees

















