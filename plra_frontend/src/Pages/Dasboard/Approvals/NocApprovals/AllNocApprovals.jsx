import { useTheme } from "@emotion/react";
import { Box, Dialog, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoBack } from "../../../../Assets/Icons";
import { Breadcrumb, Loader, MyTableContainer } from "../../../../Components";
import NocDialogBox from "./NocDialogBox";
import { useGetHistoryNocApprovalQuery, useGetPendingNocApprovalQuery } from "../../../../Features/API/NocAPI";
import { gridCellStyle } from "../../../../Utils/cellstyle";

const AllNocApprovals = () => {
  const theme = useTheme();
  const [user_id, set_user_id] = useState(null)
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [DialogData, setDialogData] = useState(null);
  const [requestId, setRequest_id] = useState(null);

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
    console.log("id", id);
  }, [user_id]);


  const {
    data: NOCPendingApproval,
    isLoading: NOCPendingApprovalLoading,
    isError: NOCPendingApprovalisError,
    error: NOCPendingApprovalerror,
    refetch: pendingRefetch,
  } = useGetPendingNocApprovalQuery(user_id);

  console.log("NOCPEnding:::", NOCPendingApproval)

  const {
    data: NOCHistory,
    isLoading: NOCHistoryLoading,
    isError: NOCHistoryisError,
    error: NOCHistoryerror,
    refetch: historyRefetch,
  } = useGetHistoryNocApprovalQuery(user_id);



  useEffect(() => {
    if (user_id) {
      pendingRefetch();
      historyRefetch();
    }
  }, [user_id, pendingRefetch, historyRefetch]);


  const pendingrecords = NOCPendingApproval?.results?.map((approval) => ({
    id: approval?.noc_request?.id,
    name:approval?.noc_request?.employee?.first_name+ " "+approval?.noc_request?.employee?.last_name,
    noc_request: approval?.id,
    status: approval?.status,
    status_date: approval?.status_date,
    visible: approval?.visible,
    comments: approval?.comments
  })) || [];


  const historyrecords = NOCHistory?.results?.map((approval) => ({
    id: approval?.noc_request?.id,
    name:approval?.noc_request?.employee?.first_name+ " "+approval?.noc_request?.employee?.last_name,
    noc_request: approval?.id,
    status: approval?.status,
    status_date: approval?.status_date,
    visible: approval?.visible,
    comments: approval?.comments
  })) || [];

  const PendingColumns = [
    {
      field: "noc_request",
      headerName: "NOC ID",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Link
            to={`/approval/nocapproval/${params?.row?.noc_request}/nocapproval/${params?.row?.id}`}
            style={{ color: "#379237", textDecoration: "underline" }}
          >
            <span
              style={{ whiteSpace: "pre-wrap" }}
              className="table_first_column"
            >
              {params?.row?.id}
            </span>
          </Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Employee Name",
      minWidth: 250,
      renderCell: (params) => {
        console.log("paramsssPending::", params)
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            className="table_first_column"
          >
            {params?.row?.name}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme,params?.row?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            className="table_first_column"
          >
            {params?.row?.status}
          </span>
        );
      },
    },
  ];

  const historycolumns = [
    {
      field: "noc_request",
      headerName: "NOC ID",
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
      field: "name",
      headerName: "Employee Name",
      minWidth: 250,
      renderCell: (params) => {
        console.log("paramsssPending::", params)
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            className="table_first_column"
          >
            {params?.row?.name}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = gridCellStyle(theme,params?.row?.status);
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
  ];

  //functions
  const handleRowClick = async (params) => {
    const data = await axios.get(
      `http://127.0.0.1:8000/noc/NocProcessListAPI/${params?.row?.id}`
    );
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.id);
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  historyrecords.sort((a, b) => {
    if (a.noc_request < b.noc_request) return 1;
    if (a.noc_request > b.noc_request) return -1;
    return 0;
  });

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "rotate(180deg)",
              cursor: "pointer",
              m: 1,
              borderRadius: "6px",
              backgroundColor: `${theme.palette.white[800]}`,
              boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,
            }}
            onClick={() => window.history.go(-1)}
          >
            <GoBack />
          </Box>
          <Breadcrumb
            title="NOC Approvals"
            breadcrumbItem="Approvals / NOCApprovals"
          />
        </Box>
        <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending" />
            <Tab label="History" />
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ width: '100%', mt: 1 }}>
        {
          (NOCPendingApprovalLoading || NOCHistoryLoading) ? (
            <Loader />
          ) : (
            <Box sx={{ width: '100%', mt: 1 }}>
              {value === 0 ? (
                <MyTableContainer
                  columns={PendingColumns}
                  data={pendingrecords}
                  RowFilterWith="id"
                  customPageSize={25}
                  minHeight={"calc(100vh - 200px)"}
                  onRowClick={handleRowClick}
                />
              ) : (
                <MyTableContainer
                  columns={historycolumns}
                  data={historyrecords}
                  RowFilterWith="id"
                  customPageSize={25}
                  minHeight={"calc(100vh - 200px)"}
                  onRowClick={handleRowClick}
                />
              )}
            </Box>
          )
        }
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography
            variant="h4"
            color="initial"
            sx={{ textAlign: "center", mb: 2 }}
          >
            NOC Details
          </Typography>
          <NocDialogBox DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllNocApprovals;
