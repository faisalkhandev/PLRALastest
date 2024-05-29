import React, { useEffect, useState } from 'react'
import { GoBack } from '../../../../Assets/Icons'
import { Breadcrumb, MyTableContainer } from '../../../../Components'
import { Box, Dialog, Grid, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'
import { useApprovalsHistoryQuery, useApprovalsQuery, useApprovalsByIdQuery } from '../../../../Features/API/SetupApi'
import Cookies from 'js-cookie';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LeaveDialog from './LeaveDialog'
import axios from 'axios'


const AllLeaveApprovals = () => {

  const theme = useTheme();
  const [user_id, set_user_id] = useState(null)
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [DialogData, setDialogData] = useState(null)
  const [leave_request_id, setRequest_id] = useState(null);




  useEffect(() => {
    const id = Cookies.get('user_id');
    set_user_id(id)
  }, [user_id])

  const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch } = useApprovalsQuery(user_id);
  const { data: approvalHistory ,refetch:historyRefetch} = useApprovalsHistoryQuery(user_id)


  const records = leaveData?.results?.map(approval => {
    const applyDate = new Date(approval.leave.apply_date);
    const formattedApplyDate = `${applyDate.getDate()}-${applyDate.getMonth() + 1}-${applyDate.getFullYear()}`;

    return {
      id: approval.id,
      leaveID: `#00${approval.id}`,
      name: approval?.leave?.employee?.first_name + ' ' + approval?.leave?.employee?.last_name,
      type: approval.leave.leave_type.leave_type,
      duration: approval.leave.days_count,
      aDate: formattedApplyDate,
      sDate: approval.leave.from_date,
      eDate: approval.leave.to_date,
      leave_request_id: approval.leave.leave_request_id
    };
  }) || [];


  const historyRecord = approvalHistory?.results?.map((approval, id) => {
    return {
      id: approval.id,
      leave_request_id: approval.leave.leave_request_id,
      empName: approval?.leave?.employee?.first_name + " " + approval?.leave?.employee?.last_name,
      leaveType: approval?.leave?.leave_type?.leave_type,
      duration: approval?.leave?.days_count,
      approveDate: approval?.leave?.approved_date,
      status: approval?.status,
      allData: approval
    }
  })

  const getCellStyle = (status) => {
    if (status === "Approved") {
      return {
        backgroundColor: theme.palette.primary[200],
        padding: "10px",
        color: theme.palette.primary.main,
        borderRadius: "90px",
      };
    } else if (status === "Rejected") {
      return {
        backgroundColor: theme.palette.error[300],
        padding: "10px",
        color: theme.palette.error[600],
        borderRadius: "90px",
      };
    }
  };



  useEffect(() => {
    refetch();
    historyRefetch()
  }, [leaveData])

  const columns = [
    {
      field: "id",
      headerName: "Approval ID",
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.id}
          </span>
        );
      },
    },
    {
      field: "empName",
      headerName: "Employee Name",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.empName}
          </span>
        );
      },
    },
    {
      field: "leaveType",
      headerName: "Leave Type",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.leaveType}
          </span>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.duration}
          </span>
        );
      },
    },
    {
      field: "approveDate",
      headerName: "Approval Date",
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.approveDate}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = getCellStyle(params?.row?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.status}
          </span>
        );
      },
    },

  ]


  //functions

  const handleRowClick = async (params) => {
    const data = await axios.get(`http://127.0.0.1:8000/leave/LeaveListApi/${params?.row?.leave_request_id}`);
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.leave_request_id)
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => { setDialogOpen(false); };


  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
              transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
              boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
            }} onClick={() => window.history.go(-1)}><GoBack /></Box>
          <Breadcrumb title="Leave Approvals" breadcrumbItem="Approvals / LeaveApprovals" />
        </Box>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending" />
            <Tab label="History" />
          </Tabs>
        </Box>
      </Box>
      {
        value === 0 ? (
          <Box sx={{ width: '100%', mt: 1 }}>
            <Box
              sx={{
                width: "100%", height: "calc(100vh - 200px)",
                backgroundColor: theme.palette.white[800],
                borderRadius: "6px", overflow: 'hidden',
                boxShadow: "0 0 15px 2px #efefef",
              }}>
              {/* Header  */}
              <Box
                sx={{
                  height: '30px', width: "100%",
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.white[800],
                  display: 'flex', alignItems: 'center', px: 1,
                }}>
                <Grid container spacing={0}>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>Approval ID</Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>Name</Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>Leave Type</Grid>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>Duration</Grid>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>Apply Date</Grid>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>Start Date</Grid>
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>End Date</Grid>
                </Grid>
              </Box>
              {/* Body  */}
              <Box sx={{
                height: "calc(100vh - 220px)", width: "100%",
                display: 'flex', alignItems: 'start', overflow: 'scroll',
                justifyContent: 'start', flexDirection: "column",
              }}>
                {records.map(record => (
                  <Link
                    key={record.id}
                    to={`/approval/leaveapproval/${record.id}/approval/${record.leave_request_id}`}
                    style={{
                      padding: "4px 0",
                      width: "100%",
                      color: '#000',
                      borderBottom: `1px solid ${theme.palette.gray[400]}`,
                      '&:hover': { bgcolor: theme.palette.gray[200], cursor: 'pointer' }
                    }}
                  >
                    <Grid container spacing={0} >
                      <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.leaveID}</Grid>
                      <Grid item xs={2} sx={{ textAlign: 'center' }}>{record.name}</Grid>
                      <Grid item xs={2} sx={{ textAlign: 'center' }}>{record.type}</Grid>
                      <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.duration}</Grid>
                      <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.aDate}</Grid>
                      <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.sDate}</Grid>
                      <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.eDate}</Grid>
                    </Grid>
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        )
          :
          (
            <Box sx={{ width: '100%', mt: 1 }}>
              {approvalHistory?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={historyRecord}
                  RowFilterWith="id"
                  customPageSize={25}
                  minHeight={"calc(100vh - 200px)"}
                  onRowClick={handleRowClick}
                />
              ) : (
                <p>Loading </p>
              )}
            </Box>
          )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Leave Detail</Typography>
          <LeaveDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div >
  )
}

export default AllLeaveApprovals
