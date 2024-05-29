import { useTheme } from "@emotion/react";
import { Box, Dialog, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, ErrorHandler, Loader, MyTableContainer } from "../../Components";
import { useAllResignationQuery, useAllhrdirResignationQuery } from "../../Features/API/ResignationApi.js";
import ResignationDialog from "../Dasboard/Approvals/ResignationApprovals/ResignationDialog.jsx";
import Cookies from "js-cookie";
import ResignationDialogSideBar from "./ResignationDialogSideBar.jsx";

const AllResignation = () => {
  const theme = useTheme();

  const [selectedResignation, setSelectedResignation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [user_id, set_user_id] = useState(null);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => setValue(newValue);
  const hrdirid = 111;

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  //console.log(user_id);

  //Queries
  const {
    data: allResignation,
    isLoading: allResignationLoading,
    isError: allResignationisError,
    error: allResignationerror,
    refetch,
  } = useAllResignationQuery(user_id);

  const {
    data: allhrdirResignation,
    isLoading: allhrdirResignationLoading,
    isError: allhrdirResignationisError,
    error: allhrdirResignationerror,
    refetch: hrdirrefetch,
  } = useAllhrdirResignationQuery();

  useEffect(() => {
    if (user_id) {
      refetch();
      hrdirrefetch();
    }
  }, [refetch, hrdirrefetch, user_id]);

  //functions
  const handleRowClick = (params) => {
    setSelectedResignation(params.row);
    setDialogOpen(true);
  };

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
    } else if (status === "In process") {
      return {
        backgroundColor: theme.palette.warning[300],
        padding: "10px",
        color: theme.palette.warning.main,
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
      field: `id`,
      headerName: "ID",
      minWidth: 170,
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
      field: `first_name + last_name`,
      headerName: "Name",
      minWidth: 180,
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
            {`${params?.row?.employee?.first_name}  ${params?.row?.employee?.last_name}`}
          </span>
        );
      },
    },
    {
      field: `case_initiation_date`,
      headerName: "Initiation Date",
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
            {params?.row?.case_initiation_date}
          </span>
        );
      },
    },
    {
      field: `notice_period`,
      headerName: "Notice Period",
      minWidth: 110,
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
            {params?.row?.notice_period}
          </span>
        );
      },
    },
    {
      field: `approvals[0].status`,
      headerName: "Reporting Officer",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = getCellStyle(params?.row?.approvals[0]?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.approvals[0]?.status}
          </span>
        );
      },
    },
    {
      field: `approvals[1].status`,
      headerName: "Director HR",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = getCellStyle(params?.row?.approvals[1]?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
          >
            {params?.row?.approvals[1]?.status}
          </span>
        );
      },
    },
    {
      field: "approvals[2]?.status",
      headerName: "ADG",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const status =
          params?.row?.approvals.length > 1
            ? params?.row?.approvals?.[2]?.status
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
      field: `approvals[3].status`,
      headerName: "DG",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = getCellStyle(params?.row?.approvals[3]?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.approvals[3]?.status}
          </span>
        );
      },
    },
    {
      field: `status`,
      headerName: "Status",
      minWidth: 140,
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
  ];

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
          title="All Resignation"
          breadcrumbItem="Employee / Employee List"
        />
        {user_id == hrdirid ? <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="My" />
            <Tab label="All" />
          </Tabs>
        </Box> : <Link to="/applyresignation">
          <Btn type="apply" />
        </Link>
        }
      </Box>
      {allResignationLoading ? (
        <Loader />
      ) : (
        <>
          {allResignationisError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : allResignation && allResignation?.results && user_id != hrdirid && (
            <MyTableContainer
              columns={columns}
              data={allResignation?.results || []}
              RowFilterWith="id"
              customPageSize={25}
              minHeight={"calc(100vh - 200px)"}
              onRowClick={handleRowClick}
            />
          )}
        </>
      )}
      {allResignationLoading ? (
        <Loader />
      ) : (
        <>
          {allResignationisError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : allResignation && allResignation?.results && user_id == hrdirid && value == 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Link to="/applyresignation">
                  <Btn type="apply" />
                </Link>
              </Box>
              <MyTableContainer
                columns={columns}
                data={allResignation?.results || []}
                RowFilterWith="id"
                customPageSize={25}
                minHeight={"calc(100vh - 200px)"}
                onRowClick={handleRowClick}
              />
            </>
          )}
        </>
      )}
      {allhrdirResignationLoading ? (
        <Loader />
      ) : (
        <>
          {allhrdirResignationisError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : allhrdirResignation && allhrdirResignation?.results && user_id == hrdirid && value == 1 && (
            <>
              <MyTableContainer
                columns={columns}
                data={allhrdirResignation?.results || []}
                RowFilterWith="id"
                customPageSize={25}
                minHeight={"calc(100vh - 200px)"}
                onRowClick={handleRowClick}
              />
            </>
          )}
        </>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography
            variant="h4"
            color="initial"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Resignation
          </Typography>
          {/* <ResignationDialog DialogData={selectedResignation} /> */}
          <ResignationDialogSideBar DialogData={selectedResignation} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllResignation;
