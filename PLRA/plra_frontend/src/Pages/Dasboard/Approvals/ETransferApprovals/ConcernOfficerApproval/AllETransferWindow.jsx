import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, ErrorHandler, Loader, MyTableContainer } from "../../../../../Components/index.js";
import { useGetetransferwindowQuery, useGetetransferwindowbystatusQuery, usePuttransferwindowMutation } from "../../../../../Features/API/Transfer.js";
import { toast } from "react-toastify";
import { GoBack } from "../../../../../Assets/Icons/index.jsx";

const AllEtransferWindow = () => {
    const theme = useTheme();

    const [selectedResignation, setSelectedResignation] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [user_id, set_user_id] = useState(null);
    const [puttransferwindow] = usePuttransferwindowMutation();

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    console.log(user_id);

    //Queries
    const { data: allEtransferWindow, isLoading: allEtransferWindowLoading, isError: allEtransferWindowisError, error: allEtransferWindowerror, refetch, } = useGetetransferwindowbystatusQuery();
    console.log(allEtransferWindow);

    useEffect(() => {
        if (user_id) {
            refetch();
        }
    }, [refetch, user_id]);

    const allEtransferWindowRecord = allEtransferWindow?.results?.map((data) => ({
        id: data?.id,
        name: data?.name,
        from_date: data?.from_date,
        to_date: data?.to_date,
        status: data?.status,
        description: data?.description,
        open_position: data?.open_position,
    })) || [];

    //functions


    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const columns = [
        {
            field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span>
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
        {
            field: "action", headerName: "Action", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return (
                    <Link
                        to={`/approval/transferprocess/${params?.row?.id}`}
                    >
                        <Btn innerStyle={{ backgroundColor: theme.palette.success.main, color: "white" }} type="generate matrix" />
                    </Link>

                );
            },
        },
    ];

    return (
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
                        title="ETransfer Windows"
                        breadcrumbItem="Approvals / ETransferApprovals"
                    />
                </Box>
            </Box>
            {allEtransferWindowLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
                <>
                    {allEtransferWindowisError ? <ErrorHandler online={navigator.onLine} /> :
                        allEtransferWindow && allEtransferWindow?.results ?
                            <MyTableContainer columns={columns} data={allEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" /> : null
                    }
                </>
            }
        </Box>
    );
};

export default AllEtransferWindow;
