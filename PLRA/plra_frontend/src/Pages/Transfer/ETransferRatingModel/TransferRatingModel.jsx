import { Box,Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Btn, Loader, MyTableContainer } from "../../../Components";
import { useGettransferratingmodelQuery } from "../../../Features/API/Transfer";
import "../../table.css";
import Theme from "../../../Theme/Light__Theme";

const TransferRatingModel = () => {
    // States
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: TransferRating, isLoading: TransferRatingLoading, isError: TransferRatingisError, error: TransferRatingError, refetch: TransferRatingRefetch } = useGettransferratingmodelQuery();

    console.log(TransferRating);

    const TransferRatingRecord = TransferRating?.results?.map((approval) => ({
        id: approval?.rating_model_rec_id,
        year: approval?.year,
        active: approval?.active,
    })) || [];

    useEffect(() => {
        TransferRatingRefetch();
    }, [TransferRatingRefetch])

    //functions
    const handleRowClick = (params) => {
        setDialogOpen(true);
    };

    const columns = [
        {
            field: "id",
            headerName: "Rating Model ID",
            minWidth: 200,
            renderCell: (params) => {
                return (
                    <Link to={`/employee/setup/Transfer_Rating_Model_Edit/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                        <span
                            style={{ whiteSpace: "pre-wrap" }}
                            className="table_first_column"
                        >
                            {params?.row?.id}
                        </span>
                    </Link>
                );
            },
        },
        {
            field: "year",
            headerName: "year",
            minWidth: 230,
            renderCell: (params) => {
                return (
                    <span
                        style={{ whiteSpace: "pre-wrap" }}
                        className="table_first_column"
                    >
                        {params?.row?.year}
                    </span>
                );
            },
        },
        {
            field: "active",
            headerName: "Active",
            minWidth: 230,
            renderCell: (params) => {
                return (
                    <span
                        style={{ whiteSpace: "pre-wrap", color: params?.row?.active ? "green" : 'red' }}
                        className="table_first_column"
                    >
                        {params?.row?.active ? <FaCheck /> : <RxCross2 />}
                    </span>
                );
            },
        },
    ];
    return (
        <Box sx={{ height: "calc(100vh - 200px)", overflowY: "scroll", pr: 1 }}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    mb: 4,
                    gap: 2,
                    alignItems: "center",
                    mt: 0.8,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        width: "100%",
                        color: Theme.palette.primary.main,
                        fontWeight: "500",
                        fontSize:"20px"
                    }}
                >
                    E-Transfer Rating Model
                </Typography>
                <Link to="/employee/setup/Transfer_Rating_Model_Apply">
                    <Btn type="apply" />
                    
                </Link>
            </Box>
            {TransferRating && TransferRating?.results ? (
                <MyTableContainer
                    columns={columns}
                    data={TransferRatingRecord}
                    RowFilterWith="id"
                    customPageSize={21}
                    minHeight={"calc(100vh - 300px)"}
                    onRowClick={handleRowClick}
                />
            ) : (
                <p><Loader /></p>
            )}
        </Box>
    );
};

export default TransferRatingModel;
