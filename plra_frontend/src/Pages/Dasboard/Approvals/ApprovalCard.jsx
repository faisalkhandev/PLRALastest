import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { useApprovalsQuery } from "../../../Features/API/SetupApi";
import Cookies from 'js-cookie';
import { useDashboardApprovalCountQuery } from "../../../Features/API/DashboardApi";
 
 
const ApprovalCard = () => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null);
 
    useEffect(() => {
        const id = Cookies.get('user_id');
        set_user_id(id);
    }, [user_id]);
    const { data: approvalData, loading: approvalLoading, isError: approvalRefreshError, error: approvalQueryError } = useDashboardApprovalCountQuery();
    const { data: leaveData, isLoading: leaveLoading, isError: leaveRefreshError, error: leaveQueryError, refetch } = useApprovalsQuery(user_id);
 
    const approvalsRecord = [
        { id: 1, approval: "Leave Approvals", route: "leaveapproval", count: 2 },
        { id: 2, approval: "Alternate Leave Approvals", route: "superapproval", count: 2 },
        { id: 3, approval: "Resignation Approvals", route: "resignationapproval", count: 3 },
        { id: 4, approval: "Termination Approvals", route: "terminationapproval", count: 3 },
        { id: 5, approval: "Disciplinary Approvals:Probe Officer", route: "disciplinaryprocedingapproval/probofficerapproval", count: 2 },
        { id: 6, approval: "Disciplinary Approvals:DG(first)", route: "disciplinaryprocedingapproval/dgfirstapproval", count: 2 },
        { id: 7, approval: "Disciplinary Approvals:HR User", route: "disciplinaryprocedingapproval/hruserapproval", count: 2 },
        { id: 8, approval: "Disciplinary Approvals:Regular Inquiry Officer", route: "disciplinaryprocedingapproval/regularinquiryofficerapproval", count: 2 },
        { id: 9, approval: "Disciplinary Approvals:Dir HR", route: "disciplinaryprocedingapproval/dirhrapproval", count: 2 },
        { id: 10, approval: "Disciplinary Approvals:DG(final)", route: "disciplinaryprocedingapproval/dgfinalapproval", count: 2 },
        { id: 11, approval: "NOC Approvals", route: "nocapproval", count: 3 },
        { id: 12, approval: "Annual-Assessment Center : Counter", route: "annualassesment/center/counter", count: 0 },
        { id: 13, approval: "Annual-Assessment Center : Reporting Officer", route: "annualassesment/center/reportingofficer", count: 0 },
        { id: 14, approval: "Annual-Assessment HeadOffice : Counter", route: "annualassesment/headoffice/counter", count: 0 },
        { id: 15, approval: "Annual-Assessment HeadOffice : Reporting Officer", route: "annualassesment/headoffice/reportingOfficer", count: 0 },
        { id: 16, approval: "Annual-Assessment DG", route: "annualassesment/center/competentauthority", count: 0 },
        { id: 17, approval: "Transfer Approvals", route: "transferapproval", count: 0 },
        { id: 18, approval: "E-Transfer Approvals: Concern Officer Approval", route: "transferwindow", count: 0 },
        { id: 19, approval: "E-Transfer Approvals: HR  Director Approval", route: "hrdirtransferapproval", count: 0 },
        { id: 20, approval: "Elevation Approvals: DG", route: "ElevationProcess", count: 0 },
        { id: 21, approval: "Progression Approvals: DG / Dir HR", route: "ProgressionProcess", count: 0 },
    ];
 
    // Group approvals by their headings
    const groupedApprovals = approvalsRecord.reduce((acc, approval) => {
        // Extract the first word from the approval string
        const heading = approval.approval.split(':')[0].split(' ')[0];
        if (!acc[heading]) {
            acc[heading] = [];
        }
        acc[heading].push(approval);
        return acc;
    }, {});
 
    if (!approvalData || !approvalData.results || approvalData.results.length === 0) {
        return null; // Handle loading or empty data scenario
    }
 
    const { process_counts: processCounts } = approvalData.results[0];
 
    if (!processCounts) {
        return null; // Handle scenario where process_counts is missing or empty
    }
 
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: "100%", height: "400px", backgroundColor: theme.palette.white[800], borderRadius: "6px", boxShadow: "0 0 15px 2px #efefef", overflow: "hidden", }} >
                {/* Header  */}
                <Box sx={{ height: "30px", width: "100%", backgroundColor: theme.palette.primary.main, color: theme.palette.white[800], textAlign: "center", }} >
                    <Typography variant="h6" color="#fff" sx={{ fontWeight: 600 }}>Work Items Assign To Me</Typography>
                </Box>
                {/* Body  */}
                {/* <Box sx={{ height: "370px", width: "100%", display: "flex", alignItems: "start", justifyContent: "start", flexDirection: "column", overflow: "scroll", pl: 1 }}>
                    {Object.entries(groupedApprovals).map(([heading, approvals]) => (
                        <Box key={heading} sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>{heading} </Typography>
                            {approvals.map(record => (
                                <Box sx={{ width: "100%", "&:hover": { backgroundColor: theme.palette.gray[200] } }} key={record.id} container spacing={0}  >
                                    <Link to={`approval/${record.route}`} style={{ width: "100%", padding: '6px', borderBottom: `1px solid ${theme.palette.gray[400]}`, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", }} >
                                        <Typography variant="body1" color="#000">   {record.approval} </Typography>
                                        <Typography variant="body1" sx={{ width: "20px", height: "20px", bgcolor: theme.palette.primary.main, textAlign: "center", borderRadius: "50%", color: "#fff", }} >
                                            {record.count}
                                        </Typography>
                                    </Link>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box> */}
 
 
                <Box sx={{ height: "370px", width: "100%", display: "flex", alignItems: "start", justifyContent: "start", flexDirection: "column", overflow: "scroll", pl: 1 }}>
                    {Object?.entries(processCounts)?.map(([sectionName, approvals]) => (
                        <Box key={sectionName} sx={{ width: '100%' }}>
                            {/* Heading */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>{sectionName}</Typography>
                            {approvals.map((approval, index) => (
                                <Link key={index} to={`approval/${approval?.path}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1, borderBottom: '1px solid #E0E0E0', '&:hover': { backgroundColor: '#F5F5F5' } }} >
                                        <Typography variant="body1">
                                            {approval?.name}
                                        </Typography>
                                        <Typography variant="body1" sx={{ width: "20px", height: "20px", bgcolor: theme.palette.primary.main, textAlign: "center", borderRadius: "50%", color: "#fff", }} >
                                            {approval?.counts}
                                        </Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Box>
 
                    ))}
                </Box>
               
            </Box>
        </Box>
    );
};
 
export default ApprovalCard;