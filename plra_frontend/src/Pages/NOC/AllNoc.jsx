import React, { useEffect, useState, useLayoutEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, Loader, MyTableContainer } from "../../Components/index.js";
import { useTheme } from "@emotion/react";
import TerminationDialog from "../Dasboard/Approvals/TerminationApprovals/TerminationDialog.jsx";
import { useGetTerminationQuery } from "../../Features/API/Termination.js";
import { useGetNOCQuery, useGethrdirNOCQuery } from "../../Features/API/NocAPI.js";
import Cookies from "js-cookie";
import NocDialogBox from "../Dasboard/Approvals/NocApprovals/NocDialogBox.jsx";

const AllNoc = () => {
    const theme = useTheme();

    const [selectedNOC, setSelectedNOC] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userId, setUserId] = useState(null)
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => setValue(newValue);
    const hrdirid = 111;


    //quries
    useLayoutEffect(() => {
        const userid = Cookies.get("user_id")
        setUserId(userid)
    }, [userId])

    const { data: NocData, isLoading: nocLoading, refetch } = useGetNOCQuery(userId);
    const { data: NochrdirData, isLoading: nochrdirLoading, refetch: hrdirrefectch } = useGethrdirNOCQuery();

    console.log(NocData);

    useEffect(() => {
        refetch();
        hrdirrefectch();
    }, [userId, refetch, hrdirrefectch])

    //functions
    const handleRowClick = (params) => {
        setSelectedNOC(params.row);
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
        } else if (status === "Issued") {
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
        } else if (status === "Not Issued") {
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

        }
        else if (status === "In process" || "In Process") {
            return {
                backgroundColor: theme.palette.warning[300],
                padding: "10px",
                color: theme.palette.warning.main,
                borderRadius: "90px",
            };

        }
        else if (status === "Closed") {
            return {
                backgroundColor: theme.palette.primary[200],
                padding: "10px",
                color: theme.palette.primary.main,
                borderRadius: "90px",
            };

        }
        else {
            return {
                backgroundColor: "transparent",
                color: "black",
                padding: "10px",
            };
        }
    };

    const columns = [
        {
            field: "id",
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
            field: "noc_type",
            headerName: "NOC Type",
            minWidth: 230,
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
                        {params?.row?.noc_type?.noc_type}
                    </span>
                );
            },
        },
        {
            field: "noc_apply_date",
            headerName: "Apply Date",
            minWidth: 230,
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
                        {params?.row?.noc_apply_date}
                    </span>
                );
            },
        },
        {
            field: "hrdirstatus",
            headerName: "HR Director ",
            minWidth: 230,
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
                    </span >
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 240,
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
                    </span >
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
                    title="All NOC"
                    breadcrumbItem="Approval / All NOC"
                />
                {userId == hrdirid ? <Box sx={{ bgcolor: "background.paper" }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="My" />
                        <Tab label="All" />
                    </Tabs>
                </Box> : <Link to="/applynoc">
                    <Btn type="Apply" />
                </Link>
                }

            </Box>
            {NocData && NocData?.results && userId != hrdirid && (
                <MyTableContainer
                    columns={columns}
                    data={NocData?.results}
                    RowFilterWith="id"
                    customPageSize={21}
                    minHeight={"calc(100vh - 220px)"}
                    onRowClick={handleRowClick}
                />
            )}
            {NocData && NocData?.results && userId == hrdirid && value == 0 && (
                <>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Link to="/applynoc">
                            <Btn type="Apply" />
                        </Link>
                    </Box>
                    <MyTableContainer
                        columns={columns}
                        data={NocData?.results}
                        RowFilterWith="id"
                        customPageSize={21}
                        minHeight={"calc(100vh - 220px)"}
                        onRowClick={handleRowClick}
                    />
                </>
            )}
            {NochrdirData && NochrdirData?.results && userId == hrdirid && value == 1 && (
                <MyTableContainer
                    columns={columns}
                    data={NochrdirData?.results}
                    RowFilterWith="id"
                    customPageSize={21}
                    minHeight={"calc(100vh - 220px)"}
                    onRowClick={handleRowClick}
                />
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>

                <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
                    <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>NOC</Typography>
                    <NocDialogBox DialogData={selectedNOC} />
                </Box>
            </Dialog>
        </div>
    );
};

export default AllNoc;
