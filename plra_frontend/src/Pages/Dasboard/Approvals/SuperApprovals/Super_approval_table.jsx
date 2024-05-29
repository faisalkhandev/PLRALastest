import { Box, Grid } from '@mui/material'
import React, {useState, useEffect } from 'react'
import { Breadcrumb } from '../../../../Components'
import { GoBack } from '../../../../Assets/Icons'
import { useTheme } from '@emotion/react'
import { useGetSuperApprovalApiQuery } from '../../../../Features/API/SetupApi'
import { Link } from 'react-router-dom'
import Cookies  from 'js-cookie'


const Super_approval_table = () => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null)
    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id)
    }, [user_id])

    console.log("user_id", user_id);
    const { data: superApprovalData, isLoading: superApprovalLoading, isError: superApprovalError, refetch } = useGetSuperApprovalApiQuery(user_id);

    console.log('superAppData: ', superApprovalData)

    const records = superApprovalData?.results?.map(approval => {
        const applyDate = new Date(approval.leave.apply_date);
        const formattedApplyDate = `${applyDate.getDate()}-${applyDate.getMonth() + 1}-${applyDate.getFullYear()}`;

        return {
            id: approval.id,
            leaveID: `#00${approval.id}`,
            name: approval.approving_authority.first_name + ' ' + approval.approving_authority.last_name,
            type: approval.leave.leave_type,
            duration: approval.leave.days_count,
            aDate: formattedApplyDate,
            sDate: approval.leave.from_date,
            eDate: approval.leave.to_date,
            leave_request_id: approval.leave.leave_request_id
        };
    }) || [];

    console.log(records)




    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                    width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                    transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                    boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
                }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                <Breadcrumb title="Super Approvals" breadcrumbItem="Approvals / Super Approvals" />
            </Box>
            <Box sx={{ width: '100%', mt: 1 }}>
                <Box
                    sx={{
                        width: "100%", height: "calc(100vh - 200px)",
                        backgroundColor: theme.palette.white[800],
                        borderRadius: "6px", overflow: 'hidden',
                        boxShadow: "0 0 15px 2px #efefef",
                    }}>
                    {/* Header  */}
                    <Box
                        sx={{
                            height: '30px', width: "100%",
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.white[800],
                            display: 'flex', alignItems: 'center', px: 1,
                        }}>
                        <Grid container spacing={0}>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>Leave Approval ID</Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>Name</Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>Leave Type</Grid>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>Leave Apply Date</Grid>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>From Date</Grid>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>To Date</Grid>
                            <Grid item xs={1} sx={{ textAlign: 'center' }}>Duration</Grid>
                        </Grid>
                    </Box>
                    {/* Body  */}
                    <Box sx={{
                        height: "calc(100vh - 220px)", width: "100%",
                        display: 'flex', alignItems: 'start', overflow: 'scroll',
                        justifyContent: 'start', flexDirection: "column",
                    }}>
                        {records.map(record => (
                            <Link
                                key={record.id}
                                to={`/approval/superapproval/${record.id}/superapproval/${record.leave_request_id}`}
                                style={{
                                    padding: "4px 0",
                                    width: "100%",
                                    color: '#000',
                                    borderBottom: `1px solid ${theme.palette.gray[400]}`,
                                    '&:hover': { bgcolor: theme.palette.gray[200], cursor: 'pointer' }
                                }}
                            >
                                <Grid container spacing={0} >
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.leaveID}</Grid>
                                    <Grid item xs={2} sx={{ textAlign: 'center' }}>{record.name}</Grid>
                                    <Grid item xs={2} sx={{ textAlign: 'center' }}>{record.type}</Grid>
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.aDate}</Grid>
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.sDate}</Grid>
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.eDate}</Grid>
                                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record.duration}</Grid>
                                </Grid>
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Super_approval_table
