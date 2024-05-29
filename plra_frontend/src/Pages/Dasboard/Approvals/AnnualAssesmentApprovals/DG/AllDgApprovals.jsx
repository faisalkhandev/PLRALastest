import React, { useEffect, useState } from 'react'
import { Box, Dialog, Grid, Typography, CircularProgress } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { GoBack } from '../../../../../Assets/Icons'
import { Breadcrumb, Loader, MyTableContainer } from '../../../../../Components'
import { useDG_History_DataQuery, useDG_Pending_DataQuery } from '../../../../../Features/API/AnnualAssessment';
import CenterDialog from '../Center/CenterDialog';
import axios from 'axios';
import HeadOfficeDialog from '../HeadOffice/HeadOfficeDialog';



const AllDgApprovals = () => {

    const theme = useTheme();
    const [user_id, set_user_id] = useState(null)
    const [value, setValue] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [DialogData, setDialogData] = useState(null)
    const [leave_request_id, setRequest_id] = useState(null);
    const [isheadoffice, setisheadoffice] = useState(null);



    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [])

    const { data: DG_Data, isLoading: DG_Data_Loading, isError: DG_DataRefreshError, error: DG_DataQueryError, refetch: pendingRefetch } = useDG_Pending_DataQuery(user_id);
    const { data: DG_History, isLoading: DG_History_Loading, isError: DG_HistoryRefreshError, error: DG_HistoryQueryError, refetch: historyRefetch } = useDG_History_DataQuery(user_id);

    console.log(DG_Data);

    const records = DG_Data?.results?.map(approval => {
        return {
            aar_process_id: approval?.aar_process?.id,
            processid: approval?.aar_process?.id,
            id: approval?.id,
            employee_name: approval?.aar_process?.employee?.first_name + '  ' + approval?.aar_process?.employee?.last_name,
            apply_date: approval?.aar_process?.aar_apply_Date,
            status: approval?.status,
        };
    }) || [];

    const historyRecord = DG_History?.results?.map((approval) => {
        return {
            id: approval?.id,
            processid: approval?.aar_process?.id,
            employee_name: approval?.aar_process?.employee?.first_name + '  ' + approval?.aar_process?.employee?.last_name,
            apply_date: approval?.aar_process?.aar_apply_Date,
            status: approval?.status,
        }
    })

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
        }
        else if (status === "In Process") {
            return {
                backgroundColor: theme.palette.warning[300],
                padding: "10px",
                color: theme.palette.warning.main,
                borderRadius: "90px",
            };
        }
    };

    useEffect(() => {
        pendingRefetch();
        historyRefetch();
    }, [user_id, DG_Data, DG_History])

    const columns = [
        {
            field: "id",
            headerName: "ID",
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <Link to={`/approval/annualassesment/${params?.row?.id}/ca_approval/${params?.row?.aar_process_id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                        <span
                            style={{ whiteSpace: "pre-wrap" }}
                            onClick={onView}
                            className="table_first_column"
                        >
                            {params?.row?.id}
                        </span>
                    </Link>
                );
            },
        },
        {
            field: "empName",
            headerName: "Emp Name",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <Link to={`/approval/annualassesment/${params?.row?.id}/ca_approval/${params?.row?.aar_process_id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                        <span
                            style={{ whiteSpace: "pre-wrap" }}
                            onClick={onView}
                            className="table_first_column"
                        >
                            {params?.row?.employee_name}
                        </span>
                    </Link>
                );
            },
        },
        {
            field: "applydate",
            headerName: "Apply Date",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <Link to={`/approval/annualassesment/${params?.row?.id}/ca_approval/${params?.row?.aar_process_id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                        <span
                            style={{ whiteSpace: "pre-wrap" }}
                            onClick={onView}
                            className="table_first_column"
                        >
                            {params?.row?.apply_date}
                        </span>
                    </Link>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                const cellStyle = getCellStyle(params?.row?.status);
                return (
                    <Link to={`/approval/annualassesment/${params?.row?.id}/ca_approval/${params?.row?.aar_process_id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                        <span
                            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
                            onClick={onView}
                            className="table_first_column"
                        >
                            {params?.row?.status}
                        </span>
                    </Link>
                );
            },
        },

    ]
    const historyColumns = [
        {
            field: "id",
            headerName: "ID",
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
            field: "empName",
            headerName: "Emp Name",
            minWidth: 150,
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
                        {params?.row?.employee_name}
                    </span>
                );
            },
        },
        {
            field: "applydate",
            headerName: "Apply Date",
            minWidth: 150,
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
                        {params?.row?.apply_date}
                    </span>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
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

    ]

    //functions
    const handleRowClick = async (params) => {
        const data = await axios.get(`http://127.0.0.1:8000/annual-assessment/aar-processesList/?id=${params?.row?.processid}`);
        setisheadoffice(data?.data?.results[0]?.is_head_office)
        setSelectedHistory(data.data);
        setDialogOpen(true);
        setRequest_id(params?.row?.id)
    };

    const handleChange = (event, newValue) => setValue(newValue);
    const handleCloseDialog = () => setDialogOpen(false);

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transform: 'rotate(180deg)',
                            cursor: 'pointer',
                            m: 1,
                            borderRadius: '6px',
                            backgroundColor: `${theme.palette.white[800]}`,
                            boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,
                        }}
                        onClick={() => window.history.go(-1)}
                    >
                        <GoBack />
                    </Box>
                    <Breadcrumb title="DG Approvals" breadcrumbItem="Approvals / DG Approvals" />
                </Box>
                <Box sx={{ bgcolor: 'background.paper' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label="Pending" />
                        <Tab label="History" />
                    </Tabs>
                </Box>
            </Box>
            <Box sx={{ width: '100%', mt: 1 }}>
                {
                    (DG_Data_Loading || !DG_History) ? (
                        <Loader />
                    ) : (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            {value === 0 ? (
                                <MyTableContainer
                                    columns={columns}
                                    data={records}
                                    RowFilterWith="id"
                                    customPageSize={25}
                                    minHeight="calc(100vh - 200px)"
                                    onRowClick={handleRowClick}
                                />
                            ) : (
                                <MyTableContainer
                                    columns={historyColumns}
                                    data={historyRecord}
                                    RowFilterWith="id"
                                    customPageSize={25}
                                    minHeight="calc(100vh - 200px)"
                                    onRowClick={handleRowClick}
                                />
                            )}
                        </Box>
                    )
                }
            </Box>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <Box sx={{ width: '800px', p: 2, height: '70vh', overflow: 'scroll' }}>
                    <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
                        Counter Assigning Approvals
                    </Typography>
                    {console.log(isheadoffice)}
                    {isheadoffice === true && isheadoffice != null ?
                        <HeadOfficeDialog DialogData={selectedHistory} /> :
                        <CenterDialog DialogData={selectedHistory} />
                    }
                </Box>
            </Dialog>
        </div>
    )
}

export default AllDgApprovals
