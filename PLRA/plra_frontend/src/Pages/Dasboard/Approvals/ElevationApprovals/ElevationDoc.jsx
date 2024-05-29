import { useTheme } from '@emotion/react';
import { Box, Grid } from "@mui/material";
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GoBack } from '../../../../Assets/Icons/index.jsx';
import { Btn, ErrorHandler, InputField, Loader } from '../../../../Components';
import Breadcrumb from '../../../../Components/Common/BreadCrumb';
import CheckBoxDataGrid from '../../../../Components/Common/CheckBoxDataGrid.jsx';
import SimpleDropdown from "../../../../Components/Common/SimpleDropDown.jsx";
import {
  useElevationDocQuery, usePostEmployeeApprovalDateMutation,
  usePostEmployeeStatusMutation, usePostPromoteElevationMutation
} from '../../../../Features/API/ElevationApi.js';



function ElevationDoc() {
  const theme = useTheme();
  const id = useParams()
  const [approvalDate, setApprovalDate] = useState("")
  const [effectiveDate, setEffectiveDate] = useState("")
  const [status, setStatus] = useState("Select Status")
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [updateApprovalDate] = usePostEmployeeApprovalDateMutation()
  const [updateStatus] = usePostEmployeeStatusMutation()
  const [promoteElevation] = usePostPromoteElevationMutation()
  const navigate = useNavigate()
  const statusArray = [
    {
      id: 1,
      value: 'Approved',
      label: 'Approve',
    },
    {
      id: 2,
      value: 'Reject',
      label: 'Reject',
    },
  ]
  const columns = [
    {
      field: "check",
      headerName: '',
      width: 17,
      renderCell: (params) => (
        <input
          type="checkbox"
          onChange={(e) => handleCheckboxChange(params.row.id, e)}
        />
      ),
    },
    {
      field: 'id',
      headerName: 'Line ID',
      width: 70,
      minWidth: 70,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 70,
      minWidth: 70,
    },
    {
      field: 'employee_no',
      headerName: 'Employee ID',
      renderCell: (params) => {
        const onView = () => {
          setSelectedRowData(params.row);
        };
        return (<Link style={{ color: '#379237', textDecoration: 'underline' }} onClick={onView}>{' '}{params.row.employee.employee_no}{' '}</Link>);
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      renderCell: (params) => (
        <span> {params?.row?.employee?.first_name + ' ' + params?.row?.employee?.last_name} </span>
      ),
    },
    {
      field: 'job_title',
      headerName: 'Job',
      renderCell: (params) => <span> {params?.row?.employee?.position?.job?.job_title} </span>,
    },
    {
      field: 'position_desc',
      headerName: 'Position',
      renderCell: (params) => <span> {params?.row?.employee?.position?.position_desc} </span>,
    },
    {
      field: 'center_name',
      headerName: 'Center',
      renderCell: (params) => <span> {params?.row?.employee?.position?.location?.center_name} </span>,
    },
    {
      field: 'wing_name',
      headerName: 'Wing',
      renderCell: (params) => <span> {params?.row?.employee?.position?.wing?.wing_name} </span>,
    },
    {
      field: 'current_level',
      headerName: 'Current Job Level',
      minWidth:180,
      renderCell: (params) => <span> {`L${params?.row?.promote_to_level - 1}`} </span>,
    },
    {
      headerName: 'Elevation Job Level',
      minWidth:180,
      renderCell: (params) => <span> {`L${params?.row?.promote_to_level}`} </span>,
    },
    {
      field: 'elevation_approval_date',
      minWidth:180,
      headerName: 'Elevation Approval Date'
    },
    {
      field: 'elevation_effective_date',
      minWidth:180,
      headerName: 'Elevation Effective Date'
    }
  ];
  const handleCheckboxChange = (rowId, e) => {
    if (e.target.checked) {
      setSelectedEmployees((prev) => [...prev, rowId])
    }
    else if (!e.target.checked) {
      setSelectedEmployees((prev) => prev.filter(item => item !== rowId))
    }
  }
  const {
    data: ElevationDoc,
    isLoading: Elevationloading,
    isError: ElevationrefreshError,
    refetch: ElevationDocrefetch,
  } = useElevationDocQuery(id.id);
  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
              transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
              boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
            }} onClick={() => window.history.go(-1)}><GoBack /></Box>
          <Breadcrumb title="Elevation" breadcrumbItem="Elevation / Elevation Document" />
        </Box>
        <div style={{ display: 'flex', gap: 10 }} >
          <Btn type="Process" onClick={() => {

            promoteElevation({
              "elevtion_to_l2_doc_rec_id": id.id,
              "elevation_effective_date": effectiveDate
            })
            navigate("/ElevationProcess")
          }} />
          <Btn type="Print" />
        </div>
      </Box>
      <Grid item xs={12}>
        <Grid container columnSpacing={6} sx={{ px: 2 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
            <Grid container xs={12} md={12} columnSpacing={{ xs: 0, md: 6 }}>
              <Grid item xs={11} md={10} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <InputField label='Approval Date' type='date' value={approvalDate} onChange={(e) => setApprovalDate(e.target.value)} mandatory />
                <SimpleDropdown name="status" label="Status" value={status} options={statusArray} onChange={(e) => setStatus(e.target.value)} type="text" fullWidth />

              </Grid>
              <Grid item xs={1} md={2} sx={{ display: "flex", flexDirection: "column", gap: 2,marginBottom:"10px" }} >
                <Btn type="Apply" onClick={() => {
                  selectedEmployees?.map((i) => {
                    updateApprovalDate({
                      "id": i,
                      "approval_date": approvalDate
                    })
                    setApprovalDate("")
                    ElevationDocrefetch()
                  })
                }} />
                <Btn type="Apply" onClick={() => {
                  selectedEmployees?.map((i) => {
                    updateStatus({
                      "id": i,
                      "status": status
                    })
                    setStatus("")
                    ElevationDocrefetch()
                  })
                }} />
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {Elevationloading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {ElevationrefreshError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : (
            ElevationDoc ? (
              <CheckBoxDataGrid
                columns={columns}
                data={ElevationDoc}
                tableHeading="Employee"
                isAddNewButton={true}
                customPageSize={20}
                RowFilterWith="id"
                minHeight={'calc(100vh - 200px)'}
              />
            ) : null
          )}
        </>
      )}
    </div>
  )
}

export default ElevationDoc