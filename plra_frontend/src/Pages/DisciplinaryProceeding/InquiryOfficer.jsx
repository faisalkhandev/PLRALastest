import React, { useCallback, useState } from 'react'
import { CheckBoxDataGrid, ErrorHandler, Loader } from '../../Components';
import { useGetAllEmployeeQuery } from '../../Features/API/API';
import { useDispatch } from 'react-redux';
import { saveData } from '../../Features/Counter/CounterSlice';

const InquiryOfficer = () => {


    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState({})



    const dispatch = useDispatch();

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

    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: 'red' }}>Null</span>;
        return value;
    };

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
            console.log("dispatch::", dispatch(saveData(rowId)))
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

    return (
        <>

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
                                    customPageSize={20}
                                    RowFilterWith="id"
                                    minHeight={'calc(100vh - 330px)'}
                                    onSelectionModelChange={handleSelectionModelChange}
                                />
                            ) : null
                        )}
                </>
            )}

        </>
    )
}

export default InquiryOfficer
