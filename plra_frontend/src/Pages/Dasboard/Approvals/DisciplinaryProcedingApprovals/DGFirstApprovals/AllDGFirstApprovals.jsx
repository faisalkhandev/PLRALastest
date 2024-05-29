import { useTheme } from "@emotion/react";
import { Box, Dialog, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoBack } from "../../../../../Assets/Icons";
import { Breadcrumb, ErrorHandler, Loader, MyTableContainer } from "../../../../../Components";
import { useAllDGFirstHistoryApprovalQuery, useAllDGFirstPendingApprovalQuery } from "../../../../../Features/API/DisciplinaryProceedings";
import DisciplinaryProcedingDialog from "../DisciplinaryProcedingDialog";
import { gridCellStyle } from "../../../../../Utils/cellstyle";

const AllDGFirstApprovals = () => {
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

  console.log(user_id);
  const { data: pendingData, isLoading: pendingLoading, isError: PendingisError, error: Pendingerror, refetch: pendingRefetch, } = useAllDGFirstPendingApprovalQuery(user_id);
  console.log("pendingData", pendingData);
  const { data: historyData, isLoading: historyLoading, isError: historyisError, error: historyerror, refetch: historyRefetch, } = useAllDGFirstHistoryApprovalQuery(user_id);
  console.log("HistoryData", historyData);

  useEffect(() => { if (user_id) { pendingRefetch(); historyRefetch(); } }, [user_id, pendingRefetch, historyRefetch]);


  const pendingRecord = pendingData?.results?.map((approval) => ({
    id: approval.id,
    processid: approval?.disciplinary_proceeding_request?.id,
    emp_name: approval?.disciplinary_proceeding_request?.employee?.first_name + " " + approval?.disciplinary_proceeding_request?.employee?.last_name,
    inquiry_reason: approval?.disciplinary_proceeding_request?.inquiry_reason,
    inquiry_start_date: approval?.disciplinary_proceeding_request?.inquiry_start_date,
    status: approval?.probe_allegation_status,
  })) || [];


  const historyRecord = historyData?.results?.map((approval) => ({
    id: approval.id,
    processid: approval?.disciplinary_proceeding_request?.id,
    emp_name: approval?.disciplinary_proceeding_request?.employee?.first_name + " " + approval?.disciplinary_proceeding_request?.employee?.last_name,
    inquiry_reason: approval?.disciplinary_proceeding_request?.inquiry_reason,
    inquiry_start_date: approval?.disciplinary_proceeding_request?.inquiry_start_date,
    status: approval?.probe_allegation_status,
  })) || [];


  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const pendingcolumns = [
    {
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/dgfirstapproval/${params?.row?.id}/dgfirstapproval/${params?.row?.processid}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
            {params?.row?.id}
          </span>
        </Link>
      },
    },
    {
      field: "emp_name", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.emp_name}
        </span>
      },
    },
    {
      field: "inquiry_reason", headerName: "Inquiry Reason", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.inquiry_reason}
        </span>
      },
    },
    {
      field: "inquiry_start_date", headerName: "Inquiry Start Date", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.inquiry_start_date}
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
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.id}
        </span>
      },
    },
    {
      field: "emp_name", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.emp_name}
        </span>
      },
    },
    {
      field: "inquiry_reason", headerName: "Inquiry Reason", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.inquiry_reason}
        </span>
      },
    },
    {
      field: "inquiry_start_date", headerName: "Inquiry Start Date", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.inquiry_start_date}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme,params?.row?.status);
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} onClick={onView} className="table_first_column">
          {params?.row?.status}
        </span>
      },
    },
  ];

  //functions
  const handleRowClick = async (params) => {
    const data = await axios.get(`http://127.0.0.1:8000/desiplinary-preceeding/DisciplinaryProceedingInquiryAPI/${params?.row?.processid}`);
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.id);
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
          <Breadcrumb title="DG Approvals" breadcrumbItem="Approvals / DG Approvals" />
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
            Disciplinary Proceeding 
          </Typography>
          <DisciplinaryProcedingDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllDGFirstApprovals;
