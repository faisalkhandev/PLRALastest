import React, { useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import {
    useGetLeaveListApiQuery,
    useLeaveApplyDataQuery,
} from "../../../Features/API/SetupApi";
import LeaveDialog from "../../Dasboard/Approvals/LeaveApprovals/LeaveDialog";
import { useTheme } from "@emotion/react";
import { Breadcrumb, Btn, MyTableContainer } from "../../../Components";

const AnnualAssesmentApply = () => {
    const theme = useTheme();

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    //quries
    const {
        data: leaveListData,
        isLoading,
        refetch: leaveRefetch,
    } = useGetLeaveListApiQuery();

    console.log('LeaveListData: ', leaveListData)


    //functions
    const handleRowClick = (params) => {
        setSelectedLeave(params.row);
        setDialogOpen(true);
    };
    console.log('paramsRowLeave: ', selectedLeave)

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
        } else {
            return {
                backgroundColor: "transparent",
                color: "black",
                padding: "10px",
            };
        }
    };

    const fakeData = [
        {
            id: 1,
            name: 'John Doe',
            address: '123 Main St, Cityville',
            phone: '123-456-7890',
        },
        {
            id: 2,
            name: 'Jane Smith',
            address: '456 Oak St, Townsville',
            phone: '987-654-3210',
        },
        {
            id: 3,
            name: 'Alice Johnson',
            address: '789 Pine St, Villageland',
            phone: '555-123-4567',
        },
        {
            id: 4,
            name: 'Bob Anderson',
            address: '101 Cedar St, Hamlet City',
            phone: '777-888-9999',
        },
        {
            id: 5,
            name: 'Emily White',
            address: '222 Elm St, Riverside',
            phone: '333-444-5555',
        },
        {
            id: 6,
            name: 'David Brown',
            address: '333 Maple St, Hilltop',
            phone: '666-777-8888',
        },
        {
            id: 7,
            name: 'Eva Davis',
            address: '444 Birch St, Lakeside',
            phone: '999-000-1111',
        },
        {
            id: 8,
            name: 'George Wilson',
            address: '555 Pine St, Mountainside',
            phone: '222-333-4444',
        },
        {
            id: 9,
            name: 'Helen Taylor',
            address: '666 Cedar St, Countryside',
            phone: '555-555-5555',
        },
        {
            id: 10,
            name: 'Ian Miller',
            address: '777 Oak St, Seaside',
            phone: '777-777-7777',
        },
        {
            id: 11,
            name: 'Jenna Harris',
            address: '888 Elm St, Lakeshore',
            phone: '888-888-8888',
        },
        {
            id: 12,
            name: 'Kevin Clark',
            address: '999 Maple St, Hillside',
            phone: '999-999-9999',
        },
        {
            id: 13,
            name: 'Laura Turner',
            address: '111 Birch St, Waterside',
            phone: '111-111-1111',
        },
        {
            id: 14,
            name: 'Michael Turner',
            address: '222 Pine St, Countryside',
            phone: '222-222-2222',
        },
        {
            id: 15,
            name: 'Nina Davis',
            address: '333 Oak St, Mountainside',
            phone: '333-333-3333',
        },
        {
            id: 16,
            name: 'Oliver Brown',
            address: '444 Elm St, Hilltop',
            phone: '444-444-4444',
        },
        {
            id: 17,
            name: 'Paula White',
            address: '555 Maple St, Riverside',
            phone: '555-555-5555',
        },
        {
            id: 18,
            name: 'Quentin Miller',
            address: '666 Birch St, Seaside',
            phone: '666-666-6666',
        },
        {
            id: 19,
            name: 'Rachel Clark',
            address: '777 Pine St, Lakeshore',
            phone: '777-777-7777',
        },
        {
            id: 20,
            name: 'Samuel Harris',
            address: '888 Cedar St, Waterside',
            phone: '888-888-8888',
        },
        // Add more entries as needed
    ];



    const columns = [
        {
            field: "name",
            headerName: "Annual Assessment1",
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
                        {params?.row?.name}
                    </span>
                );
            },
        },
        {

            field: "address",
            headerName: "Annual Assessment 2",
            minWidth: 330,
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
                        {params?.row?.address}
                    </span>
                );
            },
        },
        {
            field: "phone",
            headerName: "Annual Assessment 3",
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
                        {params?.row?.phone}
                    </span>
                );
            },
        },

    ];

    //useEffect Refresh Data
    useEffect(() => {
        leaveRefetch();
    }, [leaveRefetch]);

    //sort
    const sortedData = leaveListData?.results
        ? [...leaveListData.results].sort(
            (a, b) => b.leave_request_id - a.leave_request_id
        )
        : [];

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
                    title="All Annual Assessment "
                    breadcrumbItem="Annual Assessment Apply"
                />
                <Link to="/Apply_AnnualAssessment">
                    <Btn type="New" />
                </Link>
            </Box>


            <MyTableContainer
                columns={columns}
                data={fakeData}
                RowFilterWith="id"
                customPageSize={20}
                minHeight={"calc(100vh - 200px)"}
                onRowClick={handleRowClick}
            />

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
                    <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Leave Detail</Typography>
                    <LeaveDialog leaveData={selectedLeave} />
                    {console.log('selectedLeaves: ', selectedLeave)}

                </Box>
            </Dialog>
        </div>
    );
};

export default AnnualAssesmentApply;
