import React, { useEffect, useState } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, Loader, MyTableContainer } from "../../Components";
import { useTheme } from "@emotion/react";
import TerminationDialog from "../Dasboard/Approvals/TerminationApprovals/TerminationDialog.jsx";
import { useGetTerminationQuery } from "../../Features/API/Termination.js";
import TerminationDialogSideBar from "./TerminationDialogSideBar.jsx";
import { gridCellStyle } from "../../Utils/cellstyle.js";

const AllTermination = () => {
    const theme = useTheme();
    const [selectedTermination, setSelectedTermination] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    //quries
    const { data: terminationData, isLoading, isError, refetch } = useGetTerminationQuery();
    useEffect(() => { refetch() }, [refetch])
    console.log("terminationData", terminationData);

    //functions
    const handleRowClick = (params) => {
        setSelectedTermination(params.row);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const columns = [
        {
            field: "id",
            headerName: "Termination ID",
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
            field: "name",
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
                        {params?.row?.employee?.first_name} {params?.row?.employee?.last_name}
                    </span>
                );
            },
        },
        {
            field: "case_initiation_date",
            headerName: "Initiation Date",
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
                        {params?.row?.case_initiation_date}
                    </span>
                );
            },
        },
        {
            field: "termination_category",
            headerName: "Termination Category",
            minWidth: 240,
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
                        {params?.row?.termination_category}
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
                const cellStyle = gridCellStyle(theme, status);
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
            headerName: "HR Director",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                const status =
                    params?.row?.approvals.length > 1
                        ? params?.row?.approvals?.[1]?.status
                        : "N/A";
                const cellStyle = gridCellStyle(theme, status);
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
                const cellStyle = gridCellStyle(theme, status);
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
            field: "params?.row?.approvals[3]",
            headerName: "DG",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                const status =
                    params?.row?.approvals?.length > 2
                        ? params?.row?.approvals[3]?.status
                        : "N/A";
                const cellStyle = gridCellStyle(theme, status);
                return (
                    <span
                        style={{ whiteSpace: "pre-wrap", ...cellStyle }}
                        onClick={onView}
                        className="table_first_column" >
                        {status}
                    </span>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 180,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                const cellStyle = gridCellStyle(theme, params?.row?.status);
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
                    title="All Termination"
                    breadcrumbItem="Approval / All Termination"
                />
                <Link to="/EmployeeGrid ">
                    <Btn type="initiate" />
                </Link>
            </Box>
            {
                console.log(terminationData)
            }

            {terminationData && terminationData?.results ? (
                <MyTableContainer
                    columns={columns}
                    data={terminationData?.results}
                    RowFilterWith="id"
                    customPageSize={35}
                    minHeight={"calc(100vh - 220px)"}
                    onRowClick={handleRowClick}
                />
            ) : (
                <p><Loader /></p>
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
                    <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Termination</Typography>
                    <TerminationDialogSideBar DialogData={selectedTermination} />

                </Box>
            </Dialog>
        </div>
    );
};

export default AllTermination;
