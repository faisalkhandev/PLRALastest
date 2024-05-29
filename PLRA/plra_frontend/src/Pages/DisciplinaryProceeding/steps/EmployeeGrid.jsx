import React, { useEffect, useState, useCallback } from 'react';
import { Loader, CheckBoxDataGrid, ErrorHandler } from '../../../Components';
import { useGetAllEmployeeQuery } from '../../../Features/API/API.js';
import '../../Styles.css';




const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};


function EmployeeGrid({ selectedEmployee, setSelectedEmployee,setDisabledNext,selectedEmployeeName,setSelectedEmployeeNames }) {
    const [selected, setSelected] = useState(null);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

    const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllEmployeeQuery();
console.log("employeeDatat",EmployeeData)

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
    const updatedIds = [params.row.id];
    if (e.target.checked) {
        setSelectedEmployeeIds(updatedIds);
        setSelectedEmployee({
            ...selectedEmployee,
            employee: params.row.id // Update the employee ID in the state
        });
        const employeeName = `${params.row.first_name} ${params.row.last_name}`;
        setSelectedEmployeeNames({
            ...selectedEmployeeName,
            employee_name: employeeName // Update the employee ID in the state
        });
  
    } else {
        setSelectedEmployeeIds([]);
        setSelectedEmployee({
            ...selectedEmployee,
            employee: '' // Clear the employee ID when the checkbox is unchecked
        });
    }
}, [selectedEmployee, selectedEmployeeName]);

useEffect(() => {
   
    const isEmployeeSelected = !!selectedEmployee.employee;
    setSelectedEmployeeIds(selectedEmployee.employee ? [selectedEmployee.employee] : []);
    setDisabledNext(!isEmployeeSelected);
}, [selectedEmployee.employee]);

  
   
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

export default EmployeeGrid