import { useTheme } from "@emotion/react";
import { Box, Dialog, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoBack } from "../../../../Assets/Icons";
import { Breadcrumb, ErrorHandler, Loader, MyTableContainer } from "../../../../Components";
import {
  useResignationHistoryApprovalQuery,
  useResignationPendingApprovalQuery
} from "../../../../Features/API/ResignationApi";
import ResignationDialog from "./ResignationDialog";
import { gridCellStyle } from "../../../../Utils/cellstyle";

const AllResignationApprovals = () => {
  const theme = useTheme();
  const [user_id, set_user_id] = useState(null)
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [DialogData, setDialogData] = useState(null);
  const [approvalId, setRequest_id] = useState(null);

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  //console.log(user_id);
  const { data: pendingData, isLoading: pendingLoading, isError: PendingisError, error: Pendingerror, refetch: pendingRefetch, } = useResignationPendingApprovalQuery(user_id);
  //console.log("pendingData", pendingData);
  const { data: historyData, isLoading: historyLoading, isError: historyisError, error: historyerror, refetch: historyRefetch, } = useResignationHistoryApprovalQuery(user_id);
  console.log("HistoryData", historyData);

  useEffect(() => { if (user_id) { pendingRefetch(); historyRefetch(); } }, [user_id, pendingRefetch, historyRefetch]);


  const pendingRecord = pendingData?.results?.map((approval) => ({
    id: approval.id,
    approving_authority: approval.approving_authority_designation,
    emp:approval.resignation_request.employee.first_name+" "+approval.resignation_request.employee.last_name,
    comments: approval.comments,
    visible: approval.visible,
    status: approval.status,
    regisnation_id: approval.resignation_request.id,
  })) || [];


  const historyRecord = historyData?.results?.map((approval) => ({
    id: approval.id,
    approving_authority: approval.approving_authority_designation,
    emp:approval.resignation_request.employee.first_name+" "+approval.resignation_request.employee.last_name,
    comments: approval.comments,
    visible: approval.visible,
    status: approval.status,
    regisnation_id: approval.resignation_request.id,
  })) || [];


  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const pendingcolumns = [
    {
      field: "regisnation_id", headerName: "Regisnation ID", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/resignationapproval/${params?.row?.id}/resignationapproval/${params?.row?.regisnation_id}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
            {params?.row?.regisnation_id}
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
      field: "approving_authority", headerName: "Approving Authority", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.approving_authority}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme,params?.row?.status);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column">
          {params?.row?.status}
        </span>
      },
    },
  ];

  const historycolumns = [
    {
      field: "regisnation_id", headerName: "Regisnation ID", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.regisnation_id}
        </span>
      },
    },
    {
      field: "emp", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.emp}
        </span>
      },
    },
    {
      field: "approving_authority", headerName: "Approving Authority", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.approving_authority}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        const cellStyle = gridCellStyle(theme,params?.row?.status);
        return <span style={{ whiteSpace: "pre-wrap",...cellStyle }} onClick={onView} className="table_first_column">
          {params?.row?.status}
        </span>
      },
    },
  ];

  //functions
  const handleRowClick = async (params) => {
    const data = await axios.get(`http://127.0.0.1:8000/resignation/ResignationRequestListAPI/${params?.row?.regisnation_id}`);
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.regisnation_id);
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", transform: "rotate(180deg)", cursor: "pointer", m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}`, }} onClick={() => window.history.go(-1)}>
            <GoBack />
          </Box>
          <Breadcrumb title="Resignation Approvals" breadcrumbItem="Approvals / Resignation Approvals" />
        </Box>
        <Box sx={{ bgcolor: "background.paper" }}>
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
              pendingData && pendingData?.results && value === 0 ?
                <MyTableContainer columns={pendingcolumns} data={pendingRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
            }
          </>
        }
        {historyLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
          <>
            {historyisError ? <ErrorHandler online={navigator.onLine} /> :
              historyData && historyData?.results && value === 1 ?
                <MyTableContainer columns={historycolumns} data={historyRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
            }
          </>
        }
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
            Resignation Approval
          </Typography>
          <ResignationDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllResignationApprovals;
