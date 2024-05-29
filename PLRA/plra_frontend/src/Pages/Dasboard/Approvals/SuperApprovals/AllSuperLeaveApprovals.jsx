import { Box, Dialog, Grid, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Breadcrumb, MyTableContainer } from "../../../../Components";
import { GoBack } from "../../../../Assets/Icons";
import { useTheme } from "@emotion/react";
import {
  useGetSuperApprovalApiQuery,
  useGetSuperApprovalByIDQuery,
  useGetSuperApprovalAdditionalPositionApiQuery,
  useGetSuperApprovalHistoryApiQuery,
} from "../../../../Features/API/SetupApi";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LeaveDialog from "../LeaveApprovals/LeaveDialog";
import axios from "axios";

const AllSuperLeaveApprovals = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [user_id, set_user_id] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leave_request_id, setRequest_id] = useState(null);

  useLayoutEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  const {
    data: superApprovalData,
    isLoading: superApprovalLoading,
    isError: superApprovalError,
    refetch,
  } = useGetSuperApprovalApiQuery(user_id);
  const { data: superAppHistory ,refetch:superAppHistoryRefetch} = useGetSuperApprovalHistoryApiQuery(user_id);
  const { data: superAppAdditionalposition ,refetch:superAppAdditionalpositionRefetch} =
    useGetSuperApprovalAdditionalPositionApiQuery(user_id);

  useEffect(() => {
    refetch();
    superAppAdditionalpositionRefetch();
    superAppHistoryRefetch();
  }, [user_id, refetch]);

  const records =
    superApprovalData?.results?.map((approval) => {
      const applyDate = new Date(approval.leave.apply_date);
      const formattedApplyDate = `${applyDate.getDate()}-${
        applyDate.getMonth() + 1
      }-${applyDate.getFullYear()}`;

      return {
        id: approval.id,
        leaveID: `#00${approval.id}`,
        name:
          approval?.leave?.employee?.first_name +
          " " +
          approval?.leave?.employee?.last_name,
        type: approval?.leave?.leave_type?.leave_type,
        duration: approval.leave.days_count,
        aDate: formattedApplyDate,
        sDate: approval.leave.from_date,
        eDate: approval.leave.to_date,
        leave_request_id: approval?.leave?.leave_request_id,
        // status: approval?.status,
      };
    }) || [];
  const superAppAdditionalpositionrecords =
    superAppAdditionalposition?.results?.map((approval) => {
      const applyDate = new Date(approval.leave.apply_date);
      const formattedApplyDate = `${applyDate.getDate()}-${
        applyDate.getMonth() + 1
      }-${applyDate.getFullYear()}`;

      return {
        id: approval.id,
        leaveID: `#00${approval.id}`,
        name:
          approval?.leave?.employee?.first_name +
          " " +
          approval?.leave?.employee?.last_name,
        type: approval?.leave?.leave_type?.leave_type,
        duration: approval.leave.days_count,
        aDate: formattedApplyDate,
        sDate: approval.leave.from_date,
        eDate: approval.leave.to_date,
        leave_request_id: approval?.leave?.leave_request_id,
        // status: approval?.status,
      };
    }) || [];

  const historyRecord = superAppHistory?.results?.map((historyRecord) => ({
    id: historyRecord?.id,
    leaveID: `#00${historyRecord.id}`,
    name:
      historyRecord?.leave?.employee?.first_name +
      " " +
      historyRecord?.leave?.employee?.last_name,
    type: historyRecord?.leave?.leave_type?.leave_type,
    // status: historyRecord?.status,
    statusDate: historyRecord?.status_date,
  }));

  const AdditionalPositionRecord = superAppAdditionalposition?.results?.map(
    (historyRecord) => ({
      id: historyRecord?.id,
      leaveID: `#00${historyRecord.id}`,
      name:
        historyRecord?.leave?.employee?.first_name +
        " " +
        historyRecord?.leave?.employee?.last_name,
      type: historyRecord?.leave?.leave_type?.leave_type,
      // status: historyRecord?.status,
      statusDate: historyRecord?.status_date,
    })
  );

  const getCellStyle = (status) => {
    if (status === "Approved") {
      return {
        backgroundColor: theme.palette.primary[200],
        padding: "2px",
        color: theme.palette.primary.main,
        borderRadius: "50px",
      };
    } else if (status === "Rejected") {
      return {
        backgroundColor: theme.palette.error[300],
        padding: "2px",
        color: theme.palette.error[600],
        borderRadius: "50px",
      };
    } else if (status === "Withdraw") {
      return {
        backgroundColor: theme.palette.error[300],
        padding: "2px",
        color: theme.palette.error[600],
        borderRadius: "50px",
      };
    } else if (status === "Pending") {
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "2px",
        color: theme.palette.warning.main,
        borderRadius: "50px",
      };
    }
  };

  function handleCloseDialog() {
    setDialogOpen(!dialogOpen);
  }

  const handleChange = (event, newValue) => setValue(newValue);

  const handleRowClick = async (params) => {
    console.log(params?.row?.id);
    const data = await axios.get(
      `http://127.0.0.1:8000/leave/LeaveListApi/${params?.row?.id}`
    );
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.id);
  };

  const historyColumns = [
    {
      field: "id",
      headerName: "Leave Approval ID",
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
            {params?.row?.leaveID}
          </span>
        );
      },
    },
    {
      field: "empname",
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
            {params?.row?.name}
          </span>
        );
      },
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
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
            {params?.row?.type}
          </span>
        );
      },
    },
    {
      field: "statusDate",
      headerName: "Status Date",
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
            {params?.row?.statusDate}
          </span>
        );
      },
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   minWidth: 150,
    //   renderCell: (params) => {
    //     const onView = () => {
    //       handleRowClick(params);
    //     };
    //     const cellStyle = getCellStyle(params?.row?.status);
    //     return (
    //       <span
    //         style={{ whiteSpace: "pre-wrap", ...cellStyle }}
    //         onClick={onView}
    //         className="table_first_column"
    //       >
    //         {params?.row?.status}
    //       </span>
    //     );
    //   },
    // },
  ];

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
            title="Super Approvals"
            breadcrumbItem=" Approvals / All Super Approvals"
          />
        </Box>
        <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending" />
            <Tab label="History" />
            <Tab label="Additional Position Assignment" />
          </Tabs>
        </Box>
      </Box>
      {value === 0 && (
        <Box sx={{ width: "100%", mt: 1 }}>
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 200px)",
              backgroundColor: theme.palette.white[800],
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 0 12px 2px #efefef",
            }}
          >
            {/* Header  */}
            <Box
              sx={{
                // height: "30px",
                width: "100%",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.white[800],
                display: "flex",
                // alignItems: "center",
                px: 1,
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Leave Approval ID
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                  Name
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                  Leave Type
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Leave Apply Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  From Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  To Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Duration
                </Grid>
                {/* <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Status
                </Grid> */}
              </Grid>
            </Box>
            {/* Body  */}
            <Box
              sx={{
                height: "calc(100vh - 220px)",
                width: "100%",
                display: "flex",
                alignItems: "start",
                overflow: "scroll",
                justifyContent: "start",
                flexDirection: "column",
              }}
            >
              {records.map((record) => (
                <Link
                  key={record.id}
                  to={`/approval/superapproval/${record.id}/pending-superapproval/${record.leave_request_id}`}
                  style={{
                    // padding: "4px 0",
                    width: "100%",
                    color: "#000",
                    borderBottom: `1px solid ${theme.palette.gray[400]}`,
                    "&:hover": {
                      bgcolor: theme.palette.gray[200],
                      cursor: "pointer",
                    },
                  }}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.leaveID}
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      {record.name}
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      {record.type}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.aDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.sDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.eDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.duration}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center",...getCellStyle(record.status) }}>
                      {record.status}
                    </Grid>
                  </Grid>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {value === 1 && (
        <Box sx={{ width: "100%", mt: 1 }}>
          {superAppHistory?.results ? (
            <MyTableContainer
              columns={historyColumns}
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
      {value === 2 && (
        <Box sx={{ width: "100%", mt: 1 }}>
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 200px)",
              backgroundColor: theme.palette.white[800],
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 0 12px 2px #efefef",
            }}
          >
            {/* Header  */}
            <Box
              sx={{
                // height: "30px",
                width: "100%",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.white[800],
                display: "flex",
                // alignItems: "center",
                px: 1,
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Leave Approval ID
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                  Name
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                  Leave Type
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Leave Apply Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  From Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  To Date
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Duration
                </Grid>
                {/* <Grid item xs={1} sx={{ textAlign: "center" }}>
                  Status
                </Grid> */}
              </Grid>
            </Box>
            {/* Body  */}
            <Box
              sx={{
                height: "calc(100vh - 220px)",
                width: "100%",
                display: "flex",
                alignItems: "start",
                overflow: "scroll",
                justifyContent: "start",
                flexDirection: "column",
              }}
            >
              {superAppAdditionalpositionrecords.map((record) => (
                <Link
                  key={record.id}
                  to={`/approval/superapproval/${record.id}/superapproval/${record.leave_request_id}`}
                  style={{
                    // padding: "4px 0",
                    width: "100%",
                    color: "#000",
                    borderBottom: `1px solid ${theme.palette.gray[400]}`,
                    "&:hover": {
                      bgcolor: theme.palette.gray[200],
                      cursor: "pointer",
                    },
                  }}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.leaveID}
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      {record.name}
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      {record.type}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.aDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.sDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.eDate}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      {record.duration}
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center",...getCellStyle(record.status) }}>
                      {record.status}
                    </Grid>
                  </Grid>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography
            variant="h4"
            color="initial"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Leave Detail
          </Typography>
          <LeaveDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllSuperLeaveApprovals;
