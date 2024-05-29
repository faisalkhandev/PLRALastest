import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, Loader, MyTableContainer } from '../../../Components/index';
import { useNavigate } from 'react-router-dom';
import {
    useGetLeaveApprovalSetupQuery, useLeave_approvals_deleteMutation,
    useLeave_approvals_viewQuery,
} from '../../../Features/API/SetupApi';
import { Warning } from '../../../Assets/Icons';
import { showToast } from '../../../Components/Common/ToastCard';


const Leave_Approvals = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // queries
    const { data, isError, refetch } = useGetLeaveApprovalSetupQuery();
    const [Leave_approvals_delete] = useLeave_approvals_deleteMutation();

    // state for dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [id, setID] = useState(null)

    // columns
    const columns = [
        { field: "min_count", headerName: "Min Count", minWidth: 200, },
        { field: "max_count", headerName: "Max Count", minWidth: 200, },
        { field: "total_approvals_days", headerName: "Days", minWidth: 100, },
        {
            field: "delete", headerName: "", renderCell: (params) => (
                <Button onClick={() => handleOpenDeleteDialog(params)} style={{ color: 'red' }}>Delete</Button>
            ), align: 'center', minWidth: 150,
        },
        {
            field: "view", headerName: "", renderCell: (params) => (
                <Button onClick={() => handleOpenViewDialog(params)} style={{ color: 'green' }}>View</Button>
            ), align: 'center', minWidth: 150,
        },
    ];

    // function
    function handleClick() {
        navigate('/employee/setup/New_Leave_Approvals');
    }

    function handleRowClick() {
        console.log('clicked row:');
    }

    function handleOpenDeleteDialog(params) {
        document.body.style.backgroundColor = 'initial';
        setDeleteDialogOpen(true);
        setSelectedRow(params);
    }

    function handleCloseDeleteDialog() {
        setDeleteDialogOpen(false);
        setSelectedRow(null);
    }

    const handleDelete = async (row) => {
        handleCloseDeleteDialog();
        const leave_approvals_id = row?.id;

        try {
            const response = await Leave_approvals_delete(leave_approvals_id);

            if (response?.error?.data?.status === 409) {
                showToast(`${response?.error?.data?.detail}`, "error");
                return;
            }
            if (response?.error) {
                showToast("An error occurred while deleting the leave approval.", "error");
                return;
            }

            showToast("Leave approval deleted successfully.", "success");
            refetch();
        } catch (error) {
            showToast("An unexpected error occurred.", "error");
            console.error("Error deleting leave approval:", error);
        }
    };

    const handleOpenViewDialog = async (params) => {
        setViewDialogOpen(true);
        setSelectedRow(params);
        // const appraval_id = params?.id;
        // setID(appraval_id);
        // console.log("params?.row",params?.row);
    }
    // const { data: leave_approvals_data} = useLeave_approvals_viewQuery(id);
    // console.log(leave_approvals_data);

    function handleCloseViewDialog() {
        setViewDialogOpen(false);
    }

    useEffect(() => {
        refetch();
    }, [data]);

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Box sx={{ width: '100%', display: 'flex', gap: 2, my: 1, alignItems: 'center' }}>
                <Typography variant="h4" sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Leave Approvals</Typography>
                <Btn type="new" onClick={handleClick} />
            </Box>

            {data?.results ? (
                <MyTableContainer
                    columns={columns}
                    data={data?.results}
                    RowFilterWith="id"
                    onRowClick={handleRowClick}
                    customPageSize={30}
                    minHeight={'calc(100vh - 350px)'}
                />
            ) : (
                <Loader />
            )}

            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '400px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure you want to delete the record?</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleDelete(selectedRow); handleCloseDeleteDialog(); }} style={{ color: theme.palette.primary.light, borderRadius: "8px" }}>Sure</Btn>
                        <Btn type="close" onClick={handleCloseDeleteDialog} style={{ color: theme.palette.error.light, borderRadius: "8px" }}>Close</Btn>
                    </Box>
                </Box>
            </Dialog>

            <Dialog open={ViewDialogOpen} onClose={handleCloseViewDialog} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '400px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, fontWeight: 600, mb: 2 }}>Leave Approval</Typography>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Total Approving Time: {selectedRow?.row?.total_approvals_days}</Typography>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Max Day: {selectedRow?.row?.max_count}</Typography>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Record ID: {selectedRow?.row?.min_count}</Typography>
                </Box>
            </Dialog>
        </Box>
    );
}

export default Leave_Approvals;
