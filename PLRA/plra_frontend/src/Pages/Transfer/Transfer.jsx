
import React, { useEffect, useState } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Breadcrumb, Btn, Loader, MyTableContainer } from "../../Components";
import { useTheme } from "@emotion/react";
import { useGetAllTransferQuery } from "../../Features/API/Transfer.js";
import TransferDialog from "../Dasboard/Approvals/TransferApprovals/TransferDialog";
import axios from "axios";

const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};

const Transfer = () => {
    const theme = useTheme();

    //quries
    const { data: transferData, isLoading, isError, refetch } = useGetAllTransferQuery();
    console.log(transferData);
  const [DialogData, setDialogData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);



    //functions
    const handleCloseDialog = () => {
        setDialogOpen(false);
      };
    useEffect(() => {
        refetch()
    }, [refetch])
    const handleRowClick = async (params) => {
        const data = await axios.get(
          `http://127.0.0.1:8000/Administrative_transfer/transfer-approvals/${params?.row?.transfer_rec_id}`
        );
        setDialogData(data.data);
        setDialogOpen(true);
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

        }
        else if (status === "In Process") {
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
            field: "transfer_rec_id",
            headerName: "Transfer ID",
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
                        {params?.row?.transfer_rec_id}
                    </span>
                );
            },
        },

        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            renderCell: renderNullInRed,
            valueGetter: (params) => `${params.row.employee.first_name || ""} ${params.row.employee.last_name || ""}`,
            renderCell: (params) => {

            },
        },
        {
            field: "transfer_apply_date",
            headerName: "Initiation Date",
            minWidth: 130,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <span
                        style={{ whiteSpace: "pre-wrap" }}

                    >
                        {params?.row?.transfer_apply_date}
                    </span>
                );
            },
        },
        {
            field: "transfer_category",
            headerName: "Transfer Category",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <span>
                        {params?.row?.transfer_category}
                    </span>
                );
            },
        },
        {
            field: "hr_dir",
            headerName: "HR Director",
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
                    title="Administrative Transfers"
                    breadcrumbItem="Transfer / Employee"
                />
                <Link to="/EmployeeGrid/Transfers ">
                    <Btn type="initiate" />
                </Link>
            </Box>

            {isLoading ? (
                <Loader placement={{ marginTop: '-100px' }} />
            ) : (
                <>
                    {isError ? (<ErrorHandler online={navigator.onLine} />)
                        : (
                            transferData && transferData?.results ? (
                                <MyTableContainer
                                    columns={columns}
                                    onRowClick={handleRowClick}
                                    data={transferData?.results}
                                    RowFilterWith="transfer_rec_id"
                                    customPageSize={35}
                                    minHeight={"calc(100vh - 220px)"}
                                />
                            ) : null
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
            Transfer Approval
          </Typography>
          <TransferDialog DialogData={DialogData} />
        </Box>
      </Dialog>
        </div>
    );
};

export default Transfer;
