import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import {
    Download,
    Outlined_eye,
    Warning,
} from "../../../../Assets/Icons/index.jsx";
import {
    useGetSuperApprovalByIDQuery,
} from "../../../../Features/API/SetupApi.js";

const SuperApprovalsDetails = () => {
    const theme = useTheme();
    const { id, leave_request_id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");

    const {
        data: superDetails,
        isLoading: leaveLoading,
        isError: leaveRefreshError,
        error: leaveQueryError,
        refetch,
    } = useGetSuperApprovalByIDQuery(leave_request_id);
    console.log('superDetail: ', superDetails)

    const openPdfInNewTab = () => {
        const pdfUrl = "path/to/your/pdf/file.pdf";
        window.open(pdfUrl, "_blank");
    };
    const handleNotesChange = (event) => setReason(event.target.value);
    const handleCloseReasonDialog = () => setReasonDialogOpen(false);
    const handleReasonSubmit = () => setReasonDialogOpen(false);
    const handleButtonClick = (action) => {
        setActionPerformed(action);
        setReasonDialogOpen(true);
    };

    const formattedDate = superDetails?.results[0]?.from_date
        ? new Date(superDetails.results[0].apply_date).toLocaleDateString('en-GB')
        : '';




    return (
        <Box sx={{ p: 1 }}>
            <Grid container spacing={0} sx={{ border: "1px solid #E4E4E4", m: -0.7 }}>
                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Leave ID:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            #00{leave_request_id}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Leave Type:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            {superDetails?.results[0]?.leave_type?.leave_type}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Attechment:
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                                sx={{
                                    fontWeight: 600,
                                    px: 2,
                                    pt: 0.4,
                                    borderRadius: "4px",
                                    backgroundColor: theme.palette.success[300],
                                    color: theme.palette.success[600],
                                    mr: 2,
                                    cursor: "pointer",
                                }}
                                onClick={openPdfInNewTab}
                            >
                                <Outlined_eye color={`${theme.palette.success[600]}`} />
                            </Box>
                            <Box
                                sx={{
                                    fontWeight: 600,
                                    px: 2,
                                    pt: 0.4,
                                    backgroundColor: theme.palette.success[300],
                                    color: theme.palette.success[600],
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                <Download />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Apply Dates:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            {formattedDate}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={5} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Leave Period:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            {superDetails?.results[0]?.from_date}{" "}
                            <span style={{ fontWeight: 600 }}>TO</span>{" "}
                            {superDetails?.results[0]?.to_date}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "150px" }}
                        >
                            Count of Leaves:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            {superDetails?.results[0]?.days_count}{" "}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                        <Typography
                            variant="subtitle1"
                            color="initial"
                            fontWeight={600}
                            sx={{ width: "100px" }}
                        >
                            Leave Reason:
                        </Typography>
                        <Typography variant="subtitle1" color="initial">
                            {superDetails?.results[0].notes}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* <Box>
                <Typography variant="h6" color="initial" sx={{ mt: 2 }}>
                    Status:
                </Typography>
                {approvalData.map((data, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index + 1}-content`}
                            id={`panel${index + 1}-header`}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        color="initial"
                                        sx={{ fontweight: 600 }}
                                    >
                                        {data.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="initial"
                                        sx={{ fontweight: 600 }}
                                    >
                                        |
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            px: 2,
                                            borderRadius: "4px",
                                            backgroundColor: theme.palette[data.statusColor][300],
                                            color: theme.palette[data.statusColor][600],
                                        }}
                                    >
                                        {data.status}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: "50%",
                                        display: "flex",
                                        justifyContent: "end",
                                        mr: 2,
                                    }}
                                >
                                    Approval Date: {data.date}
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Reason:
                            </Typography>
                            <Typography variant="body2">{data.reason}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box> */}

            <Box sx={{ display: "flex", alignItems: "start", p: 1, mt: 3 }}>
                <Typography variant="body2" color="initial" sx={{ width: "100px" }}>
                    Notes:{" "}
                </Typography>
                <textarea
                    rows={8}
                    onChange={handleNotesChange}
                    style={{
                        resize: "none",
                        width: "100%",
                        border: "1px solid black",
                        padding: "10px",
                        borderRadius: "6px",
                    }}
                    placeholder="Write the job description..."
                />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    mt: 2,
                    gap: 2,
                }}
            >
                <Button
                    sx={{
                        backgroundColor: theme.palette.success[300],
                        color: theme.palette.success[600],
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: 500,
                        p: 2,
                    }}
                    onClick={() => handleButtonClick("Accept")}
                >
                    Accept
                </Button>
                <Button
                    sx={{
                        borderRadius: "4px",
                        backgroundColor: theme.palette.error[300],
                        color: theme.palette.error[600],
                        fontSize: "14px",
                        fontWeight: 500,
                        p: 2,
                    }}
                    onClick={() => handleButtonClick("Reject")}
                >
                    Reject
                </Button>
            </Box>

            {/* Dialog  */}
            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                <Box sx={{ width: "600px" }}>
                    <DialogTitle sx={{ display: "flex", alignItems: "center", ml: -2 }}>
                        {reason.trim() ? (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Warning color={`${theme.palette.warning[600]}`} />
                                Are you sure you want to {actionPerformed} leave on the based of
                                given reason?
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Warning color={`${theme.palette.warning[600]}`} />
                                {actionPerformed} without reason.
                            </Box>
                        )}
                    </DialogTitle>
                    <DialogContent>
                        {reason.trim() ? (
                            <Box sx={{ maxHeight: "400px", overflow: "scroll" }}>
                                <Typography variant="subtitle1" color="initial" sx={{ px: 4 }}>
                                    {reason}
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="initial" ml={2}>
                                Are you sure {actionPerformed} application without povide any
                                reason.
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ mt: 4 }}>
                        <Button
                            onClick={handleCloseReasonDialog}
                            sx={{
                                borderRadius: "4px",
                                backgroundColor: theme.palette.error[300],
                                color: theme.palette.error[600],
                                fontSize: "14px",
                                fontWeight: 500,
                                p: 2,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReasonSubmit}
                            sx={{
                                backgroundColor: theme.palette.success[300],
                                color: theme.palette.success[600],
                                borderRadius: "4px",
                                fontSize: "14px",
                                fontWeight: 500,
                                p: 2,
                            }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default SuperApprovalsDetails;
