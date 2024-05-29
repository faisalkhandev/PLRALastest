import { useTheme } from "@emotion/react";
import { Box, Dialog, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { GoBack } from "../../../../../Assets/Icons/index.jsx";
import { Breadcrumb, Btn, ErrorHandler, Loader, MyTableContainer } from "../../../../../Components";
import { useGetetransferprocessQuery } from "../../../../../Features/API/Transfer.js";
import ConcernOfficerMarksDialog from "./ConcernOfficerMarksDialog.jsx";

const AllETransferProcess = () => {
    const theme = useTheme();

    const [selectedResignation, setSelectedResignation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [user_id, set_user_id] = useState(null);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [approvalId, setRequest_id] = useState(null);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    console.log(user_id);

    //Queries
    const { data: allETransfer, isLoading: allETransferLoading, isError: allETransferisError, error: allETransfererror, refetch, } = useGetetransferprocessQuery();
    console.log(allETransfer);

    useEffect(() => {
        if (user_id) {
            refetch();
        }
    }, [refetch, user_id]);

    const allETransferRecord = allETransfer?.results?.map((data) => ({
        id: data?.e_transfer_rec_id,
        emp_name: data?.employee?.first_name + " " + data?.employee?.last_name,
        e_transfer_apply_date: data?.e_transfer_apply_date,
        transfer_category: data?.transfer_category,
        new_joining_date: data?.new_joining_date,
        status: data?.status,
    })) || [];

    //functions
    const handleRowClick = async (params) => {
        const data = await axios.get(`http://127.0.0.1:8000/E_transfer/ratingmatrix/?e_transfer_process=${params?.row?.id}`);
        setSelectedHistory(data?.data);
        setDialogOpen(true);
        setRequest_id(params?.row?.id);
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

    const columns = [
        {
            field: "check",
            headerName: '',
            renderCell: (params) => (
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(params.row.id, e)}
              />
            ),
          },
        {
            field: "id", headerName: "ID", minWidth: 50, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span>
            },
        },
        {
            field: "Emp_name", headerName: "Employee Name", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.emp_name}</span>
            },
        },
        {
            field: "e_transfer_apply_date", headerName: "E Transfer Apply Date", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.e_transfer_apply_date}</span>
            },
        },
        {
            field: "transfer_category", headerName: "Transfer Category", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.transfer_category}</span>
            },
        },
        {
            field: "status", headerName: "Status", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                const cellStyle = getCellStyle(params?.row?.status);
                return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column">{params?.row?.status}</span>
            },
        },
        {
            field: "action", headerName: "Action", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                const onView = () => handleRowClick(params);
                return (
                    <Btn innerStyle={{ backgroundColor: theme.palette.success.main, color: "white" }} type="generate marks" onClick={onView} />
                );
            },
        },
    ];

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <Box sx={{ width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
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
                            title="ETransfer Process"
                            breadcrumbItem="Approvals / ETransferApprovals"
                        />
                    </Box>
                    <Btn type="Mark" />
                </Box>
                {allETransferLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
                    <>
                        {allETransferisError ? <ErrorHandler online={navigator.onLine} /> :
                            allETransfer && allETransfer?.results ?
                                <MyTableContainer columns={columns} data={allETransferRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" onRowClick={handleRowClick} /> : null
                        }
                    </>
                }
            </Box>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
                    <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
                        Concern Officer Marks
                    </Typography>
                    <ConcernOfficerMarksDialog DialogData={selectedHistory} />
                </Box>
            </Dialog>
        </div>
    );
};

export default AllETransferProcess;
