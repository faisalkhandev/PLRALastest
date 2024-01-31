import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, MyTableContainer } from "../../Components";
import {
  useGetLeaveListApiQuery,
  useLeaveApplyDataQuery,
} from "../../Features/API/SetupApi";
import LeaveDialog from "../Dasboard/Approvals/LeaveApprovals/LeaveDialog";
import { useTheme } from "@emotion/react";

const Leave = () => {
  const theme = useTheme();

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  //quries
  const {
    data: leaveListData,
    isLoading,
    refetch: leaveRefetch,
  } = useGetLeaveListApiQuery();

  console.log('LeaveListData: ', leaveListData)


  //functions
  const handleRowClick = (params) => {
    setSelectedLeave(params.row);
    setDialogOpen(true);
  };
  console.log('paramsRowLeave: ', selectedLeave)

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
    } else if (status === "Pending") {
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
        borderRadius: "90px",
      };
    } else {
      return {
        backgroundColor: "transparent",
        color: "black",
        padding: "10px",
      };
    }
  };

  const columns = [
    {
      field: "leave_request_id",
      headerName: "Leave ID",
      minWidth: 100,
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
            {params?.row?.leave_request_id}
          </span>
        );
      },
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      minWidth: 130,
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
            {params?.row?.leave_type?.leave_type}
          </span>
        );
      },
    },
    // {
    //   field: "apply_date",
    //   headerName: "Apply Date",
    //   minWidth: 130,
    //   renderCell: (params) => {
    //     const onView = () => {
    //       handleRowClick(params);
    //     };
    //     const rawDate = params?.row?.apply_date;
    //     const formattedDate = rawDate
    //       ? new Date(rawDate).toLocaleDateString()
    //       : "";
    //     return (
    //       <span
    //         style={{ whiteSpace: "pre-wrap" }}
    //         onClick={onView}
    //         className="table_first_column"
    //       >
    //         {formattedDate}
    //       </span>
    //     );
    //   },
    // },
    {
      field: "days_count",
      headerName: "Days",
      minWidth: 140,
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
            {params?.row?.days_count}
          </span>
        );
      },
    },
    {
      field: "params?.row?.approvals[0]?.status",
      headerName: "Reporting Officer",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.approvals.length > 0
            ? params.row.approvals[0].status
            : "N/A";
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
    },
    {
      field: "params?.row?.approvals[1]?.status",
      headerName: "Director Officer",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.approvals?.length > 1
            ? params?.row?.approvals[1]?.status
            : "N/A";
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
    },
    {
      field: "params?.row?.approvals[2]?.status",
      headerName: "ADG Admin",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.approvals?.length > 2
            ? params?.row?.approvals[2]?.status
            : "N/A";
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
    },
    {
      field: "params?.row?.approvals[3]?.status",
      headerName: "DG",
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.approvals.length > 3
            ? params?.row?.approvals?.[3]?.status
            : "N/A";
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
    },
    {
      field: "params?.row?.superapprovals[0]",
      headerName: "Super Approvals",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.superapprovals?.length > 0
            ? params?.row?.superapprovals[0]?.status
            : "N/A";
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
    },

  ];

  //useEffect Refresh Data
  useEffect(() => {
    leaveRefetch();
  }, [leaveRefetch]);

  //sort
  const sortedData = leaveListData?.results
    ? [...leaveListData.results].sort(
      (a, b) => b.leave_request_id - a.leave_request_id
    )
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
          breadcrumbItem="Employee / Employee List"
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
        <p>Loading...</p>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Leave Detail</Typography>
          <LeaveDialog leaveData={selectedLeave} />
          {console.log('selectedLeaves: ', selectedLeave)}

        </Box>
      </Dialog>
    </div>
  );
};

export default Leave;
