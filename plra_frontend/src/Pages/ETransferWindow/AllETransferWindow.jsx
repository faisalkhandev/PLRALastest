import { useTheme } from "@emotion/react";
import { Box, Dialog, Tab, Tabs, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, ErrorHandler, Loader, MyTableContainer } from "../../Components/index.js";
import { useGetetransferwindowQuery, useGethistoryetransferwindowQuery } from "../../Features/API/Transfer.js";
import { toast } from "react-toastify";
import TransferWindowDialog from "./TransferWindowDialog.jsx";

const AllEtransferWindow = () => {
  const theme = useTheme();

  const [selectedResignation, setSelectedResignation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [user_id, set_user_id] = useState(null);
  const [value, setValue] = useState(0);
  const [selectedHistory, setSelectedHistory] = useState(null);
  // const [puttransferwindow] = usePuttransferwindowMutation();

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(user_id);

  //Queries
  const { data: allEtransferWindow, isLoading: allEtransferWindowLoading, isError: allEtransferWindowisError, error: allEtransferWindowerror, refetch, } = useGetetransferwindowQuery();
  const { data: allhistoryEtransferWindow, isLoading: allhistoryEtransferWindowLoading, isError: allhistoryEtransferWindowisError, error: allhistoryEtransferWindowerror, refetch: historyrefetch, } = useGethistoryetransferwindowQuery();
  console.log(allEtransferWindow);

  useEffect(() => {
    if (user_id) {
      refetch();
      historyrefetch();
    }
  }, [refetch, historyrefetch, user_id]);

  const allEtransferWindowRecord = allEtransferWindow?.results?.map((data) => ({
    id: data?.id,
    name: data?.name,
    from_date: data?.from_date,
    to_date: data?.to_date,
    status: data?.status,
    description: data?.description,
    open_position: data?.open_position,
  })) || [];
  const allhistoryEtransferWindowRecord = allhistoryEtransferWindow?.results?.map((data) => ({
    id: data?.id,
    name: data?.name,
    from_date: data?.from_date,
    to_date: data?.to_date,
    status: data?.status,
    description: data?.description,
    open_position: data?.open_position,
  })) || [];

  //functions
  const handleRowClick = async (params) => {
    // setSelectedResignation(params.row);
    // setDialogOpen(true);
    console.log(params?.row);
    setSelectedHistory(params?.row);
    setDialogOpen(true);
  };

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const columns = [
    {
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/edittransferwindow/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span></Link>
      },
    },
    {
      field: "name", headerName: "Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.name}</span>
      },
    },
    {
      field: "from_date", headerName: "From Date", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.from_date}</span>
      },
    },
    {
      field: "to_date", headerName: "To Date", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.to_date}</span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <span
            style={{ whiteSpace: "pre-wrap", color: params?.row?.status ? "green" : 'red' }}
            className="table_first_column"
          >
            {params?.row?.status ? <FaCheck /> : <RxCross2 />}
          </span>
        );
      },
    },
  ];
  const historycolumns = [
    {
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        const onView = () => handleRowClick(params);
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column" onClick={onView}>{params?.row?.id}</span>
      },
    },
    {
      field: "name", headerName: "Name", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.name}</span>
      },
    },
    {
      field: "from_date", headerName: "From Date", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.from_date}</span>
      },
    },
    {
      field: "to_date", headerName: "To Date", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.to_date}</span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <span
            style={{ whiteSpace: "pre-wrap", color: params?.row?.status ? "green" : 'red' }}
            className="table_first_column"
          >
            {params?.row?.status ? <FaCheck /> : <RxCross2 />}
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
          title="Open Transfer Window"
          breadcrumbItem="ETransfer / opentransferwindow"
        />
        <Box sx={{ bgcolor: "background.paper", display: "flex", justifyContent: "end", marginBottom: "10px" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Active Windows" />
            <Tab label="Closed Windows" />
          </Tabs>
        </Box>
      </Box>
      {allEtransferWindowLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>

          {allEtransferWindowisError ? <ErrorHandler online={navigator.onLine} /> :
            allEtransferWindow && allEtransferWindow?.results && value === 0 ?
              <><Box sx={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
                <Link to="/applytransferwindow">
                  <Btn type="Add" />
                </Link>
              </Box>
                <MyTableContainer columns={columns} data={allEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /></> : null
          }
        </>
      }
      {allhistoryEtransferWindowLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {allhistoryEtransferWindowisError ? <ErrorHandler online={navigator.onLine} /> :
            allhistoryEtransferWindow && allhistoryEtransferWindow?.results && value === 1 ?
              <MyTableContainer columns={historycolumns} data={allhistoryEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
          }
        </>
      }
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
            ETransfer Window
          </Typography>
          <TransferWindowDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>
    </div>
  );
};

export default AllEtransferWindow;
