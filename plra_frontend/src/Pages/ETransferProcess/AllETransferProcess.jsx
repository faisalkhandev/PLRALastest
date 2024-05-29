import { useTheme } from "@emotion/react";
import { Box, Tab, Tabs } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, ErrorHandler, Loader, MyTableContainer } from "../../Components";
import { useGetetransferprocessQuery, useGetetransferprocessbyidQuery, useGethrdiretransferprocessbyidQuery } from "../../Features/API/Transfer.js";

const AllETransferProcess = () => {
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

  console.log(user_id);

  //Queries
  const { data: allETransfer, isLoading: allETransferLoading, isError: allETransferisError, error: allETransfererror, refetch, } = useGetetransferprocessbyidQuery(user_id);
  const { data: allhrdirETransfer, isLoading: allhrdirETransferLoading, isError: allhrdirETransferisError, error: allhrdirETransfererror, refetch: hrdirrefectch, } = useGethrdiretransferprocessbyidQuery();
  console.log(allETransfer);
  const { data: allEtransferWindow, isLoading: allEtransferWindowLoading, isError: allEtransferWindowisError, error: allEtransferWindowerror, refetch: historyrefetch, } = useGetapplypositionQuery();
  console.log(allEtransferWindow);

  useEffect(() => {
    if (user_id) {
      refetch();
      historyrefetch();
    }
  }, [refetch, historyrefetch, user_id]);

  const allETransferRecord = allETransfer?.results?.map((data) => ({
    id: data?.e_transfer_rec_id,
    emp_name: data?.employee?.first_name + " " + data?.employee?.last_name,
    e_transfer_apply_date: data?.e_transfer_apply_date,
    transfer_category: data?.transfer_category,
    new_joining_date: data?.new_joining_date,
    status: data?.status,
    attachments:data?.attachments,
    transfer_position:data?.transfer_position,
    previous_position:data?.employee?.position
  })) || [];

  const allEtransferWindowRecord = allEtransferWindow?.map((data) => ({
    id: data?.position?.p_rec_id,
    end_date: data?.end_date,
    start_date: data?.start_date,
    window_id: data?.window_id,
    job: data?.position?.job?.job_title,
    ppg_level: data?.position?.job?.ppg_level?.ppg_level,
    center: data?.position?.location?.center_name,
    district: data?.position?.location?.district?.district_name,
    division: data?.position?.location?.division?.division_name,
    region: data?.position?.location?.region?.region_name,
    tehsil: data?.position?.location?.tehsil?.t_name,
    description: data?.position?.position_desc,
    position_type: data?.position?.position_type?.position_type_name,
    sub_wing: data?.position?.sub_wing?.sub_wing_name,
    wing: data?.position?.wing?.wing_name,
  })) || [];
  const allhrdirETransferRecord = allhrdirETransfer?.results?.map((data) => ({
    id: data?.e_transfer_rec_id,
    emp_name: data?.employee?.first_name + " " + data?.employee?.last_name,
    e_transfer_apply_date: data?.e_transfer_apply_date,
    transfer_category: data?.transfer_category,
    new_joining_date: data?.new_joining_date,
    status: data?.status,
  })) || [];

  //functions
  const handleRowClick = (params) => {
    console.log(params?.row);
    setSelectedHistory(params?.row);
    setDialogOpen(true);
  };

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const getCellStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: theme.palette.primary[200], padding: "10px", color: theme.palette.primary.main, borderRadius: "90px",
        };
      case "Rejected":
        return {
          backgroundColor: theme.palette.error[300], padding: "10px", color: theme.palette.error[600], borderRadius: "90px",
        };
      case "Pending":
        return {
          backgroundColor: theme.palette.warning[300], padding: "10px", color: theme.palette.warning.main, borderRadius: "90px",
        };
      case "In Process":
        return {
          backgroundColor: theme.palette.warning[300], padding: "10px", color: theme.palette.warning.main, borderRadius: "90px",
        };
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const columns = [
    {
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.id}</span>
      },
    },
    {
      field: "Emp_name", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.emp_name}</span>
      },
    },
    {
      field: "e_transfer_apply_date", headerName: "E Transfer Apply Date", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.e_transfer_apply_date}</span>
      },
    },
    {
      field: "transfer_category", headerName: "Transfer Category", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.transfer_category}</span>
      },
    },
    {
      field: "new_joining_date", headerName: "New Joining Date", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.new_joining_date}</span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        const cellStyle = getCellStyle(params?.row?.status);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column" onClick={onView}>{params?.row?.status}</span>
      },
    },
  ];

  const historycolumns = [
    {
      field: "id", headerName: "ID", minWidth: 50, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <><input
          type="radio"
          checked={selectedId === params.row.id}
          onChange={() => { setSelectedId(params.row.id); setwindowId(params.row.window_id) }}
          style={{ marginRight: "10px" }}
        /><span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span></>
      },
    },
    {
      field: "window_id", headerName: "Window ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.window_id}</span>
      },
    },
    {
      field: "start_date", headerName: "Start Date", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.start_date}</span>
      },
    },
    {
      field: "end_date", headerName: "End Date", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.end_date}</span>
      },
    },
    {
      field: "job", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.job}</span>
      },
    },
    {
      field: "description", headerName: "Description", minWidth: 450, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.description}</span>
      },
    },
    {
      field: "position_type", headerName: "Position Type", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.position_type}</span>
      },
    },
    {
      field: "ppg_level", headerName: "PPG level", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.ppg_level}</span>
      },
    },
    {
      field: "center", headerName: "Center", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.center}</span>
      },
    },
    {
      field: "district", headerName: "District", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.district}</span>
      },
    },
    {
      field: "division", headerName: "Division", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.division}</span>
      },
    },
    {
      field: "region", headerName: "Region", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.region}</span>
      },
    },
    {
      field: "tehsil", headerName: "Tehsil", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.tehsil}</span>
      },
    },
    {
      field: "sub_wing", headerName: "Sub Wing", minWidth: 300, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.sub_wing}</span>
      },
    },
    {
      field: "wing", headerName: "Wing", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.wing}</span>
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
          title="All ETransfer Process"
          breadcrumbItem="ETransfer / ETransferProcess"
        />
        {user_id == hrdirid ? <Box sx={{ bgcolor: "background.paper" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="My" />
            <Tab label="All" />
          </Tabs>
        </Box> : <Link to="/applyetransfer">
          <Btn type="apply" />
        </Link>
        }

      </Box>
      {allEtransferWindowLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {allEtransferWindowisError ? <ErrorHandler online={navigator.onLine} /> :
            allEtransferWindow && value === 0 ?
              <><Box sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                <Link to={`/applyetransfer/${selectedId}/window/${windowId}`} onClick={(e) => {
                  if (!selectedId) {
                    e.preventDefault(); // Prevent navigation if no ID is selected
                    toast.error("Please select a position first.", {
                      position: "top-center",
                      autoClose: 3000,
                    });
                  }
                }}>
                  <Btn type="apply" />
                </Link>
              </Box>
                <MyTableContainer columns={historycolumns} data={allEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 300px)" onRowClick={handleRowClick} /></> : null
          }
        </>
      }
      {allETransferLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {allETransferisError ? <ErrorHandler online={navigator.onLine} /> :
            allETransfer && allETransfer?.results && user_id != hrdirid &&
            <MyTableContainer columns={columns} data={allETransferRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} />
          }
        </>
      }
      {allETransferLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {allETransferisError ? <ErrorHandler online={navigator.onLine} /> :
            allETransfer && allETransfer?.results && user_id == hrdirid && value == 0 &&
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Link to="/applyetransfer">
                  <Btn type="apply" />
                </Link>
              </Box>
              <MyTableContainer columns={columns} data={allETransferRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} />
            </>
          }
        </>
      }
      {allhrdirETransferLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {allETransferisError ? <ErrorHandler online={navigator.onLine} /> :
            allhrdirETransfer && allhrdirETransfer?.results && user_id == hrdirid && value == 1 &&
            <MyTableContainer columns={columns} data={allhrdirETransfer} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} />
          }
        </>
      }
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
            ETransfer Process
          </Typography>
          <TransferProcessDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllETransferProcess;
