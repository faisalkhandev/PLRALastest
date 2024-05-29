import { useTheme } from "@emotion/react";
import { Box, Dialog, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoBack } from "../../../../../../Assets/Icons";
import { Breadcrumb, ErrorHandler, Loader, MyTableContainer } from "../../../../../../Components";
import { useHoroAllApprovalsQuery, useHorohistoryAllApprovalsQuery, } from "../../../../../../Features/API/AnnualAssessment";
import HeadOfficeDialog from "../HeadOfficeDialog";

const AllCounterApprovals = () => {
  const theme = useTheme();
  const [user_id, set_user_id] = useState(null);
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [approvalId, setRequest_id] = useState(null);

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(user_id);
  const {data: pendingData,isLoading: pendingLoading,isError: PendingisError,error: Pendingerror,refetch: pendingRefetch,} = useHoroAllApprovalsQuery(user_id);
  console.log("pendingData", pendingData);
  const {data: historyData,isLoading: historyLoading,isError: historyisError,error: historyerror,refetch: historyRefetch,} = useHorohistoryAllApprovalsQuery(user_id);
  console.log("HistoryData", historyData);

  useEffect(() => { if (user_id) {pendingRefetch();historyRefetch();}}, [user_id, pendingRefetch, historyRefetch]);

  const pendingRecord = pendingData?.results?.map((approval) => ({
      id: approval?.id,
      processid:approval?.aar_process?.id,
      emp_name: approval?.aar_process?.employee?.first_name +" " + approval?.aar_process?.employee?.last_name,
      aar_apply_Date:approval?.aar_process?.aar_apply_Date,
      status: approval?.status,
    })) || [];

  const historyRecord = historyData?.results?.map((approval) => ({
      id: approval?.id,
      processid:approval?.aar_process?.id,
      emp_name: approval?.aar_process?.employee?.first_name +" " + approval?.aar_process?.employee?.last_name,
      aar_apply_Date:approval?.aar_process?.aar_apply_Date,
      status: approval?.status,
    })) || [];

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const getCellStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: theme.palette.primary[200],padding: "10px",color: theme.palette.primary.main,borderRadius: "90px",
        };
      case "Rejected":
        return {
          backgroundColor: theme.palette.error[300],padding: "10px",color: theme.palette.error[600],borderRadius: "90px",
        };
      case "Pending":
        return {
          backgroundColor: theme.palette.warning[300],padding: "10px",color: theme.palette.warning.main,borderRadius: "90px",
        };
      case "In Process":
        return {
          backgroundColor: theme.palette.warning[300],padding: "10px",color: theme.palette.warning.main,borderRadius: "90px",
        };
    }
  };

  const pendingcolumns = [
    {
      field: "id",headerName: "ID",minWidth: 100,renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/annualassesment/${params?.row?.id}/horo_approval/${params?.row?.processid}`} style={{ color: "#379237", textDecoration: "underline" }}>
            <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{console.log(params)} {params?.row?.id}</span>
          </Link>
      },
    },
    {
      field: "Emp_name",headerName: "Employee Name",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/annualassesment/${params?.row?.id}/horo_approval/${params?.row?.processid}`} style={{ color: "#379237", textDecoration: "underline" }}>
            <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.emp_name}</span>
          </Link>
      },
    },
    {
      field: "aar_apply_Date",headerName: "AAR Apply Date",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/annualassesment/${params?.row?.id}/horo_approval/${params?.row?.processid}`} style={{ color: "#379237", textDecoration: "underline" }}>
            <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.aar_apply_Date}</span>
          </Link>
      },
    },
    {
      field: "status",headerName: "Status",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = getCellStyle(params?.row?.status);
        return <Link to={`/approval/annualassesment/${params?.row?.id}/horo_approval/${params?.row?.processid}`} style={{ color: "#379237", textDecoration: "underline" }}>
            <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column">{params?.row?.status}</span>
          </Link>
      },
    },
  ];
  const historycolumns = [
    {
      field: "id",headerName: "ID",minWidth: 100,renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params);};
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">{params?.row?.id}</span>
      },
    },
    {
      field: "Emp_name",headerName: "Employee Name",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => {handleRowClick(params);};
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">{params?.row?.emp_name}</span>
      },
    },
    {
      field: "aar_apply_Date",headerName: "AAR Apply Date",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => {handleRowClick(params);};
        return <span style={{ whiteSpace: "pre-wrap" }} onClick={onView} className="table_first_column">{params?.row?.aar_apply_Date}</span>
      },
    },
    {
      field: "status",headerName: "Status",minWidth: 250,renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => {handleRowClick(params);};
        const cellStyle = getCellStyle(params?.row?.status);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} onClick={onView} className="table_first_column">{params?.row?.status}</span>
      },
    },
  ];

  const handleRowClick = async(params) => {
    console.log("first");
    const data = await axios.get(`http://127.0.0.1:8000/annual-assessment/aar-processesList/?id=${params?.row?.processid}`);
    console.log(data.data);
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.id);
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <div>
      <Box sx={{display: "flex",alignItems: "center",justifyContent: "space-between",}}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{width: "40px",height: "40px",display: "flex",justifyContent: "center",alignItems: "center",transform: "rotate(180deg)",cursor: "pointer",m: 1,borderRadius: "6px",backgroundColor: `${theme.palette.white[800]}`,boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,}} onClick={() => window.history.go(-1)}>
            <GoBack />
          </Box>
          <Breadcrumb title="Reporting Officer Approvals" breadcrumbItem="Approvals / Reporting Officer Approvals"/>
        </Box>
        <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending" />
            <Tab label="History" />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: "100%", mt: 1 }}>
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
            Reporting Officer Approvals
          </Typography>
          <HeadOfficeDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllCounterApprovals;
