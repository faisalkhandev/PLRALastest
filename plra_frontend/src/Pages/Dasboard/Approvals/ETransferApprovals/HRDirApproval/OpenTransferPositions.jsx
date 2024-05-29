import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { GoBack } from "../../../../../Assets/Icons/index.jsx";
import { Breadcrumb, ErrorHandler, Loader, MyTableContainer } from "../../../../../Components/index.js";
import { useGetetransferwindowbystatusQuery, useGethrdirectorapprovalQuery, useGethrdirectorapprovalbyidQuery, useGettransferpositionsQuery, usePuttransferwindowMutation } from "../../../../../Features/API/Transfer.js";
import { Link } from "react-router-dom";

const OpenTransferPositions = () => {
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
    const { data: allopenpositions, isLoading: allopenpositionsLoading, isError: allopenpositionsisError, error: allopenpositionserror, refetch: openrefetch, } = useGettransferpositionsQuery();
    const { data: allapprovalpositions, isLoading: allapprovalpositionsLoading, isError: allapprovalpositionsisError, error: allapprovalpositionserror, refetch: approvalrefetch, } = useGethrdirectorapprovalQuery();
    console.log(allapprovalpositions);

    useEffect(() => {
        if (user_id) {
            refetch();
        }
    }, [refetch, user_id]);

    const allEtransferWindowRecord = allapprovalpositions?.results?.filter(data => data.visible).map((data) => ({
        id: data?.id,
        end_date: data?.window?.to_date,
        start_date: data?.window?.from_date,
        window_id: data?.window?.id,
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
        no_of_applicants:data?.no_of_applicants,
        marked_employees:data?.marked_employees,
        unmarked_employees:data?.unmarked_employees,
    })) || [];

    //functions


    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const columns = [
        {
          field: "id", headerName: "ID", minWidth: 50, renderCell: renderNullInRed,
          renderCell: (params) => {
            return <Link to={`/approval/hrdirtransferapproval/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}><span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span></Link>
          },
        },
        // {
        //   field: "window_id", headerName: "Window ID", minWidth: 100, renderCell: renderNullInRed,
        //   renderCell: (params) => {
        //     return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.window_id}</span>
        //   },
        // },
        // {
        //   field: "start_date", headerName: "Start Date", minWidth: 100, renderCell: renderNullInRed,
        //   renderCell: (params) => {
        //     return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.start_date}</span>
        //   },
        // },
        // {
        //   field: "end_date", headerName: "End Date", minWidth: 100, renderCell: renderNullInRed,
        //   renderCell: (params) => {
        //     return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.end_date}</span>
        //   },
        // },
        // {
        //     field: "no_of_applicants", headerName: "Applicants", minWidth: 200, renderCell: renderNullInRed,
        //     renderCell: (params) => {
        //       return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.no_of_applicants}</span>
        //     },
        //   },
        //   {
        //     field: "marked_employees", headerName: "Marked", minWidth: 200, renderCell: renderNullInRed,
        //     renderCell: (params) => {
        //       return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.marked_employees}</span>
        //     },
        //   },
        //   {
        //     field: "unmarked_employees", headerName: "Unmarked", minWidth: 200, renderCell: renderNullInRed,
        //     renderCell: (params) => {
        //       return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.unmarked_employees}</span>
        //     },
        //   },
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
                        title="Open positions"
                        breadcrumbItem="Approvals / open positions"
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

export default OpenTransferPositions;
