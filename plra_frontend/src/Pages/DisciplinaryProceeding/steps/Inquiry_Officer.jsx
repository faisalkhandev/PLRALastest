import React, { useEffect, useState, useCallback } from 'react';
import { Loader, CheckBoxDataGrid, ErrorHandler } from '../../../Components';
import { useGetAllEmployeeQuery } from '../../../Features/API/API.js';
import '../../Styles.css';




const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};


function Inquiry_Officer({ selectedEmployee, setSelectedEmployee ,setDisabledNext,selectedEmployeeName,setSelectedEmployeeNames}) {
    const [selected, setSelected] = useState(null);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

    const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeQuery();
    const filteredEmployeeData = EmployeeData?.results.filter(employee => employee.id !== selectedEmployee.employee);


const renderCheckbox = (params) => {
    const rowId = params.row.id;
    const isChecked = selectedEmployeeIds.includes(rowId);

    return (
        <input
            type="checkbox"
            onChange={(e) => handleCheckboxChange(params, e)}
            checked={isChecked}
        />
    );
};


    const handleCheckboxChange = useCallback((params, e) => {
        const updatedIds = [params.row.rowId];
        if (e.target.checked) {
            setSelectedEmployeeIds(updatedIds);
            setSelectedEmployee({
                ...selectedEmployee,
                regular_inquiry_officer: params.row.id // Update the employee ID in the state
            });
            const employeeName = `${params.row.first_name} ${params.row.last_name}`;
            setSelectedEmployeeNames({
                ...selectedEmployeeName,
                regular_inquiry_officer_name: employeeName // Update the employee ID in the state
            });
      

        } else {
            setSelectedEmployeeIds([]);
            setSelectedEmployee({
                ...selectedEmployee,
                regular_inquiry_officer: '' // Clear the employee ID when the checkbox is unchecked
            });
        }
    }, []);

    useEffect(() => {
        const isEmployeeSelected = !!selectedEmployee.regular_inquiry_officer;
        setDisabledNext(!isEmployeeSelected);
        setSelectedEmployeeIds(selectedEmployee.regular_inquiry_officer ? [selectedEmployee.regular_inquiry_officer] : []);
    }, [selectedEmployee.regular_inquiry_officer])
   
        const handleSelectionModelChange = (selectionModel) => {
            if (selectionModel.length === 1) {
                const selectedId = selectionModel[0];
                setSelected(selectedId);
            } else {
                setSelected(null);
            }
        }
        

    const columns = [
        { field: "check", headerName: '', renderCell: renderCheckbox, },
        {
            field: 'id', headerName: 'Employee ID',
            minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => { setSelectedRowData(params.row) };
            },
        },
        {
            field: 'name', headerName: 'Name', minWidth: 200,
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
                                    {EmployeerefreshError ? (<ErrorHandler
                                     online={navigator.onLine} />)
                                        : (
                                            EmployeeData && EmployeeData?.results ? (
                                                <CheckBoxDataGrid
                                                    columns={columns}
                                                    data={filteredEmployeeData}
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

export default Inquiry_Officer