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
import { useAllProbeOfficerHistoryApprovalQuery, useAllProbeOfficerPendingApprovalQuery } from "../../../../Features/API/DisciplinaryProceedings";
// import DisciplinaryProcedingDialog from "../DisciplinaryProcedingDialog";
import { gridCellStyle } from "../../../../Utils/cellstyle";
import { useGetHistoryProgressionQuery, useGetPendingProgressionQuery } from "../../../../Features/API/ProgressionApi";

const ProgressionProcess = () => {
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
  const { data: pendingData, isLoading: pendingLoading, isError: PendingisError, error: Pendingerror, refetch: pendingRefetch, } = useGetPendingProgressionQuery(user_id);
  console.log("pendingData", pendingData);
  const { data: historyData, isLoading: historyLoading, isError: historyisError, error: historyerror, refetch: historyRefetch, } = useGetHistoryProgressionQuery(user_id);
  console.log("HistoryData", historyData);

  useEffect(() => { if (user_id) { pendingRefetch(); historyRefetch(); } }, [user_id, pendingRefetch, historyRefetch]);


  const pendingRecord = pendingData?.results?.map((approval) => ({
    id: approval.document?.progression_document_rec_id,
    emp_name: approval?.employee?.first_name + " " + approval?.employee?.last_name,
    job_title: approval?.employee?.position?.job?.job_title,
    center_name: approval?.employee?.position?.location?.center_name,
    promote_job: approval?.promote_job?.job_title,
    ppg_level: approval?.employee?.position?.job?.ppg_level?.ppg_level,
    promote_ppg_level: approval?.promote_ppg_level?.ppg_level,
    status: approval?.status,
  })) || [];


  const historyRecord = historyData?.results?.map((approval) => ({
    id: approval.document?.progression_document_rec_id,
    approveby: approval.document?.approved_by,
    emp_name: approval?.employee?.first_name + " " + approval?.employee?.last_name,
    job_title: approval?.employee?.position?.job?.job_title,
    center_name: approval?.employee?.position?.location?.center_name,
    promote_job: approval?.promote_job?.job_title,
    ppg_level: approval?.employee?.position?.job?.ppg_level?.ppg_level,
    promote_ppg_level: approval?.promote_ppg_level?.ppg_level,
    status: approval?.status,
  })) || [];


  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const pendingcolumns = [
    {
      field: "id", headerName: "ID", width: 10, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/progressionapproval/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
            {params?.row?.id}
          </span>
        </Link>
      },
    },
    {
      field: "emp_name", headerName: "Employee Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.emp_name}
        </span>
      },
    },
    {
      field: "job_title", headerName: "Job title", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.job_title}
        </span>
      },
    },
    {
      field: "center_name", headerName: "Center Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.center_name}
        </span>
      },
    },
    {
      field: "promote_job", headerName: "Promoted Job", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_job}
        </span>
      },
    },
    {
      field: "ppg_level", headerName: "PPG Level", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.ppg_level}
        </span>
      },
    },
    {
      field: "promote_ppg_level", headerName: "Promote PPG Level", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_ppg_level}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 150, renderCell: renderNullInRed,
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
      field: "id", headerName: "ID", width: 10, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.id}
        </span>
      },
    },
    {
      field: "emp_name", headerName: "Employee Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.emp_name}
        </span>
      },
    },
    {
      field: "approve/Reject by", headerName: "Approved/Rejected By", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">
          {params?.row?.approveby}
        </span>
      },
    },
    {
      field: "job_title", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.job_title}
        </span>
      },
    },
    {
      field: "center_name", headerName: "Center Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.center_name}
        </span>
      },
    },
    {
      field: "promote_job", headerName: "Promoted Job", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_job}
        </span>
      },
    },
    {
      field: "ppg_level", headerName: "PPG Level", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.ppg_level}
        </span>
      },
    },
    {
      field: "promote_ppg_level", headerName: "Promoted PPG Level", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_ppg_level}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 150, renderCell: renderNullInRed,
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
          <Breadcrumb title="Elevation Approvals" breadcrumbItem="Approvals / Elevation Approvals" />
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
      {/* <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
          Disciplinary Proceeding 
          </Typography>
          <DisciplinaryProcedingDialog DialogData={selectedHistory} />
        </Box>
      </Dialog> */}
    </div>
  );
};

export default ProgressionProcess;
