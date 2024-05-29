import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Dialog,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, Loader, MyTableContainer } from "../../Components";
import {
  useGetLeaveListApiQuery,
} from "../../Features/API/SetupApi";
import { useTheme } from "@emotion/react";
import Cookies from 'js-cookie'
import LeaveDialog from "./LeaveDialog";
import axios from "axios";

const Leave = () => {
  const theme = useTheme();

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user_id, set_user_id] = useState(Cookies.get('user_id') || null);

  // useLayoutEffect to set user_id from Cookies
  useLayoutEffect(() => {
    const id = Cookies.get('user_id');
    if (id !== user_id) {
      set_user_id(id);
    }
  }, [user_id]);

  console.log("user_id", user_id)

  // Queries"

  // Queries
  const {
    data: leaveListData,
    isLoading,
    refetch: leaveRefetch,
  } = useGetLeaveListApiQuery(user_id);

  // Use useEffect to refetch data on user_id change
  useEffect(() => {
    leaveRefetch();
  }, [user_id, leaveRefetch]);

  const handleRowClick = async (params) => {
    const data = await axios.get(`http://127.0.0.1:8000/leave/LeaveListApi/${params?.row?.leave_request_id}`);
    setSelectedLeave(data.data);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseDialogFromApproval = () => {
    setDialogOpen(false);
    leaveRefetch();
  };

  const getCellStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: theme.palette.primary[200],
          padding: "10px",
          color: theme.palette.primary.main,
          borderRadius: "90px",
        };
      case "Rejected":
      case "Withdraw":
        return {
          backgroundColor: theme.palette.error[300],
          padding: "10px",
          color: theme.palette.error[600],
          borderRadius: "90px",
        };
      case "Pending":
      case "In Process":
        return {
          backgroundColor: theme.palette.warning[300],
          padding: "10px",
          color: theme.palette.warning.main,
          borderRadius: "90px",
        };
      default:
        return {
          backgroundColor: "transparent",
          color: "black",
          padding: "10px",
        };
    }
  };

  const generateColumns = () => {
    if (!leaveListData?.results || leaveListData.results.length === 0) {
      return [];
    }

    const approvingAuthorities = new Set();
    leaveListData.results.forEach((result) => {
      result.approvals.forEach((approval) => {
        approvingAuthorities.add(approval.leave_approval?.approving_authority);
      });
    });

    return Array.from(approvingAuthorities).map((authority) => ({
      field: `approvals_${authority}`,
      headerName: authority,
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        const status = params?.row?.approvals.find(
          (approval) => approval.leave_approval?.approving_authority === authority
        )?.status || "N/A";
        const cellStyle = getCellStyle(status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
            className="table_first_column"
          >
            {status}
          </span>
        );
      },
    }));
  };

  const columns = [
    {
      field: "leave_request_id",
      headerName: "Leave ID",
      minWidth: 100,
      renderCell: (params) => (
        <span
          style={{ whiteSpace: "pre-wrap" }}
          onClick={() => handleRowClick(params)}
          className="table_first_column"
        >
          {params?.row?.leave_request_id}
        </span>
      ),
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      minWidth: 130,
      renderCell: (params) => (
        <span
          style={{ whiteSpace: "pre-wrap" }}
          onClick={() => handleRowClick(params)}
          className="table_first_column"
        >
          {params?.row?.leave_type?.leave_type}
        </span>
      ),
    },
    {
      field: "days_count",
      headerName: "Days",
      minWidth: 140,
      renderCell: (params) => (
        <span
          style={{ whiteSpace: "pre-wrap" }}
          onClick={() => handleRowClick(params)}
          className="table_first_column"
        >
          {params?.row?.days_count}
        </span>
      ),
    },
    ...generateColumns(),
    {
      field: "params?.row?.superapprovals[0]",
      headerName: "Super Approvals",
      minWidth: 150,
      renderCell: (params) => {
        const status = params?.row?.superapprovals?.[0]?.status || "N/A";
        const cellStyle = getCellStyle(status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={() => handleRowClick(params)}
            className="table_first_column"
          >
            {status}
          </span>
        );
      },
    },
    {
      field: "params?.row?.status",
      headerName: "Leave Status",
      minWidth: 150,
      renderCell: (params) => {
        const status = params?.row?.status || "N/A";
        const cellStyle = getCellStyle(status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={() => handleRowClick(params)}
            className="table_first_column"
          >
            {status}
          </span>
        );
      },
    },
  ];

  const sortedData = leaveListData?.results
    ? [...leaveListData.results].sort((a, b) => b.leave_request_id - a.leave_request_id)
    : [];

  return (
    <div
      style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }}
      className="EmployeeTableBox"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumb
          title="All Leaves"
          breadcrumbItem="Leave / Leave List"
        />
        <Link to="/applyleave">
          <Btn type="New" />
        </Link>
      </Box>

      {leaveListData?.results ? (
        <MyTableContainer
          columns={columns}
          data={sortedData}
          RowFilterWith="leave_request_id"
          customPageSize={25}
          minHeight={"calc(100vh - 200px)"}
          onRowClick={handleRowClick}
        />
      ) : (
        <Loader placement={{ marginTop: '-100px' }} />
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Leave Detail</Typography>
          <LeaveDialog DialogData={selectedLeave} closeDialog={handleCloseDialogFromApproval} />
        </Box>
      </Dialog>
    </div>
  );
};

export default Leave;
