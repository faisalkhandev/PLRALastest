import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Dialog, Tab, Tabs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Breadcrumb, Btn, MyTableContainer } from "../../../Components";
import { useGetAnnualAssessmentProcessListQuery, useGetHRDirAnnualAssessmentProcessListQuery } from "../../../Features/API/AnnualAssessment";
import HeadOfficeDialog from "../../Dasboard/Approvals/AnnualAssesmentApprovals/HeadOffice/HeadOfficeDialog";
import CenterDialog from "../../Dasboard/Approvals/AnnualAssesmentApprovals/Center/CenterDialog";
import axios from "axios";
import Cookies from "js-cookie";

const AnnualAssesmentApply = () => {
  const theme = useTheme();
  const [selectedApproval, setselectedApproval] = useState(null);
  const [headOfficeDialog, setHeadOfficeDialog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const index = 1;
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [user_id, set_user_id] = useState(null);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => setValue(newValue);
  const hrdirid = 111;

  //quries
  const {
    data: AnnualApprovalListData,
    isLoading,
    refetch: leaveRefetch,
  } = useGetAnnualAssessmentProcessListQuery(user_id);

  const {
    data: HrDirApprovalListData,
    isLoading: HrDirloading,
    refetch: HrDirleaveRefetch,
  } = useGetHRDirAnnualAssessmentProcessListQuery();

  console.log(AnnualApprovalListData);
  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
    leaveRefetch();
  }, [user_id]);
  //functions
  const getStatusStyle = (status, theme) => {
    let backgroundColor, color;

    switch (status) {
      case "Approved":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Refer to Competent Authority":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Completed":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Pending":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "In process":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "In Process":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "N/A":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "Rejected":
        backgroundColor = theme.palette.error[300];
        color = theme.palette.error[600];
        break;
      default:
        backgroundColor = "black";
        color = "black";
    }

    return { backgroundColor, color };
  };
  const handleRowClick = async (params) => {
    setselectedApproval(params?.row);
    const data = await axios.get(
      `http://127.0.0.1:8000/annual-assessment/aar-processesList/?id=${params?.row?.id}`
    );
    setSelectedHistory(data.data);
    setOpenDialog(true);
    setHeadOfficeDialog(params?.row?.is_head_office);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const tableData =
    AnnualApprovalListData?.results?.map((item) => ({
      id: item.id,
      employee: item?.approvals[0]?.aar_process?.employee?.first_name,
      employeeName: `${item?.approvals[0]?.aar_process?.employee?.first_name} ${item?.approvals[0]?.aar_process?.employee?.last_name}`,
      hr_year: item?.approvals[0]?.aar_process?.year?.hr_year,
      aar_apply_Date: item?.aar_apply_Date,
      notes: item?.notes,
      status: item?.status,
      reportingofficer: item?.approvals[0]?.status,
      counterassigningofficer: item?.approvals[1]?.status,
      dg: item?.approvals[2]?.status,
      is_head_office: item?.is_head_office,
    })) || [];

  const HrDirData =
    HrDirApprovalListData?.results?.map((item) => ({
      id: item.id,
      employee: item?.approvals[0]?.aar_process?.employee?.first_name,
      employeeName: `${item?.approvals[0]?.aar_process?.employee?.first_name} ${item?.approvals[0]?.aar_process?.employee?.last_name}`,
      hr_year: item?.approvals[0]?.aar_process?.year?.hr_year,
      aar_apply_Date: item?.aar_apply_Date,
      notes: item?.notes,
      status: item?.status,
      reportingofficer: item?.approvals[0]?.status,
      counterassigningofficer: item?.approvals[1]?.status,
      dg: item?.approvals[2]?.status,
      is_head_office: item?.is_head_office,
    })) || [];

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      flex: true,
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
      field: "employeeName",
      headerName: "Employee Name",
      flex: true,
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const employee = params?.row?.employee;
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.employeeName}
          </span>
        );
      },
    },
    {
      field: "hr_year",
      headerName: "HR Calendar Year",
      flex: true,
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const hrYear = params?.row?.hr_year;
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.hr_year}
          </span>
        );
      },
    },
    {
      field: "aar_apply_Date",
      headerName: "Apply Date",
      flex: true,
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
            {params?.row?.aar_apply_Date}
          </span>
        );
      },
    },

    {
      field: "reportingofficer",
      headerName: "Reporting Officer",
      flex: true,
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{
              whiteSpace: "pre-wrap",
              padding: "2px 10px ",
              borderRadius: "5px",
              backgroundColor: getStatusStyle(
                params?.row?.reportingofficer,
                theme
              ).backgroundColor,
              color: getStatusStyle(params?.row?.reportingofficer, theme).color,
            }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.reportingofficer}
          </span>
        );
      },
    },

    {
      field: "counterassigningofficer",
      headerName: "Countersigning Officer",
      flex: true,
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{
              whiteSpace: "pre-wrap",
              padding: "2px 10px ",
              borderRadius: "5px",
              backgroundColor: getStatusStyle(
                params?.row?.counterassigningofficer,
                theme
              ).backgroundColor,
              color: getStatusStyle(params?.row?.counterassigningofficer, theme)
                .color,
            }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.counterassigningofficer}
          </span>
        );
      },
    },

    {
      field: "dg",
      headerName: "DG",
      flex: true,
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{
              whiteSpace: "pre-wrap",
              padding: "2px 10px ",
              borderRadius: "5px",
              backgroundColor: getStatusStyle(
                params?.row?.dg ? params?.row?.dg : "N/A",
                theme
              ).backgroundColor,
              color: getStatusStyle(
                params?.row?.dg ? params?.row?.dg : "N/A",
                theme
              ).color,
            }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.dg == null ? "N/A" : params?.row?.dg}
          </span>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: true,
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{
              whiteSpace: "pre-wrap",
              padding: "2px 10px ",
              borderRadius: "5px",
              backgroundColor: getStatusStyle(params?.row?.status, theme)
                .backgroundColor,
              color: getStatusStyle(params?.row?.status, theme).color,
            }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.status}
          </span>
        );
      },
    },
  ];

  //useEffect Refresh Data
  useEffect(() => {
    leaveRefetch();
  }, [leaveRefetch]);

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
          title="All Annual Assessment "
          breadcrumbItem="Annual Assessments"
        />
        {user_id == hrdirid ? <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="My" />
            <Tab label="All" />
          </Tabs>
        </Box> : <Link to="/applyNewAnnaualAssesment">
          <Btn type="New" />
        </Link>
        }
      </Box>
      {AnnualApprovalListData && user_id != hrdirid && (
        <>
          <MyTableContainer
            columns={columns}
            data={tableData}
            RowFilterWith="id"
            customPageSize={20}
            minHeight={"calc(100vh - 200px)"}
            onRowClick={handleRowClick}
          />
        </>
      )}
      {AnnualApprovalListData && value == 0 && user_id == hrdirid && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Link to="/applyNewAnnaualAssesment">
              <Btn type="New" />
            </Link>
          </Box>

          <MyTableContainer
            columns={columns}
            data={tableData}
            RowFilterWith="id"
            customPageSize={20}
            minHeight={"calc(100vh - 200px)"}
            onRowClick={handleRowClick}
          />
        </>
      )}

      {HrDirApprovalListData && value == 1 && user_id == hrdirid && (
        <>
          <MyTableContainer
            columns={columns}
            data={HrDirData}
            RowFilterWith="id"
            customPageSize={20}
            minHeight={"calc(100vh - 200px)"}
            onRowClick={handleRowClick}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography
            variant="h4"
            color="initial"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Annual Assessment
          </Typography>
          {headOfficeDialog === true && headOfficeDialog != null ? (
            <HeadOfficeDialog DialogData={selectedHistory} />
          ) : (
            <CenterDialog DialogData={selectedHistory} />
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default AnnualAssesmentApply;
