import React, { useEffect, useState } from 'react'
import { GoBack } from '../../../../Assets/Icons'
import { Breadcrumb, ErrorHandler, Loader, MyTableContainer } from '../../../../Components'
import { Box, Dialog, Grid, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useGetHistoryTerminationQuery, useGetPendingTerminationQuery } from '../../../../Features/API/Termination'
import TerminationDialog from './TerminationDialog'
import axios from 'axios'
import Cookies from 'js-cookie'
import { gridCellStyle } from '../../../../Utils/cellstyle'
import TerminationDialogSideBar from '../../../Termination/TerminationDialogSideBar'

const AllTerminationApprovals = () => {

  const theme = useTheme();
  const [userID, setUserID] = useState(null)
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [DialogData, setDialogData] = useState(null)
  const [terminationID, setTerminationID] = useState(null);


  useEffect(() => {
    const id = Cookies.get("user_id")
    setUserID(id)
  }, [userID])



  const { data: terminationHistory, isLoading: historyLoading, isError: historyisError, error: historyerror, refetch: historyRefetch, } = useGetHistoryTerminationQuery(userID);
  const { data: pendingTermination, isLoading: pendingLoading, isError: PendingisError, error: Pendingerror, refetch: pendingRefetch, } = useGetPendingTerminationQuery(userID);

  console.log(terminationHistory);






  const historyRecords = terminationHistory?.results?.map(approval => {
    return {
      id: approval.id,
      emp: approval.termination_request.employee.first_name + " " + approval.termination_request.employee.last_name,
      terminationHistoryID: approval?.termination_request.id,
      hDate: approval?.status_date,
      historyStatus: approval?.status,
      effectiveDateHistory: approval?.termination_effective_date,
      comment: approval?.comments,
      authorithy: approval?.approving_authority_designation,
    };
  }) || [];

  const pendingRecord = pendingTermination?.results?.map((approval) => ({
    id: approval?.id,
    emp: approval.termination_request.employee.first_name + " " + approval.termination_request.employee.last_name,
    terminationPendingID: approval?.termination_request.id,
    pendingDate: approval?.status_date || 'null',
    authorithy: approval?.approving_authority_designation,
    pendingStatus: approval?.status,
  })) || [];

  console.log(pendingRecord);

  useEffect(() => { if (userID) { pendingRefetch(); historyRefetch(); } }, [userID, pendingRefetch, historyRefetch]);

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const pendingcolumns = [
    {
      field: "id", headerName: "Termination ID", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/terminationapproval/${params?.row?.id}/terminationapproval/${params?.row?.terminationPendingID}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
            {params?.row?.terminationPendingID}
          </span>
        </Link>
      },
    },
    {
      field: "emp", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.emp}
        </span>
      },
    },
    {
      field: "authority", headerName: "Approving Authority", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.authorithy}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme, params?.row?.pendingStatus);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column">
          {params?.row?.pendingStatus}
        </span>
      },
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "Termination ID",
      minWidth: 250,
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
            {params?.row?.terminationHistoryID}

          </span>
        );
      },
    },
    {
      field: `emp`,
      headerName: "Employee Name",
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
            {params?.row?.emp}

          </span>
        );
      },
    },
    {
      field: `hDate`,
      headerName: "Initiation Date",
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
            {params?.row?.hDate}

          </span>
        );
      },
    },
    {
      field: `effectiveDateHistory`,
      headerName: "Effective Date",
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
            {params?.row?.effectiveDateHistory}
          </span>
        );
      },
    },
    {
      field: `historyStatus`,
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status = params?.row?.historyStatus
        const getStyled = gridCellStyle(theme, status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...getStyled }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.historyStatus}
          </span>
        );
      },
    },


  ]


  //functions

  const handleRowClick = async (params) => {
    const data = await axios.get(
      `http://127.0.0.1:8000/termination/TerminationRequestListAPI/${params?.row?.terminationHistoryID}`
    );
    setSelectedHistory(params?.row);
    setDialogOpen(true);
    setTerminationID(data?.data)
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
          <Breadcrumb title="Termination Approvals" breadcrumbItem="Approvals / Termination Approvals" />
        </Box>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending" />
            <Tab label="History" />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: '100%', mt: 1 }}>
        {pendingLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
          <>
            {PendingisError ? <ErrorHandler online={navigator.onLine} /> :
              pendingTermination && pendingTermination?.results && value === 0 ?
                <MyTableContainer columns={pendingcolumns} data={pendingRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
            }
          </>
        }
        {historyLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
          <>
            {historyisError ? <ErrorHandler online={navigator.onLine} /> :
              terminationHistory && terminationHistory?.results && value === 1 ?
                <MyTableContainer
                  columns={columns}
                  data={historyRecords}
                  RowFilterWith="id"
                  customPageSize={25}
                  minHeight={"calc(100vh - 200px)"}
                  onRowClick={handleRowClick}
                /> : null
            }
          </>
        }
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Termination Detail</Typography>
          <TerminationDialog DialogData={terminationID} />
        </Box>
      </Dialog>
    </div >
  )
}

export default AllTerminationApprovals
