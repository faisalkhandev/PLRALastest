import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Typography
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Outlined_eye,
    Warning
} from "../../../../Assets/Icons/index.jsx";
import { ErrorHandler, Loader } from "../../../../Components/index.js";
import {
    useGetNocApprovalByIdQuery,
    usePutNocApprovalMutation,
} from "../../../../Features/API/NocAPI.js";
import { showToast } from "../../../../Components/shared/Toast_Card.jsx";
import { approvalcellStyle } from "../../../../Utils/cellstyle.js";

const NocApprovalDetail = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id, noc_id } = useParams();
    const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
    const [dataOject, setDataObject] = useState({});
    const [actionPerformed, setActionPerformed] = useState("");
    const [reason, setReason] = useState("");
    const [user_id, set_user_id] = useState(null);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    const {
        data: NocData,
        isLoading: nocLoading,
        isError: nocError,
        refetch,
    } = useGetNocApprovalByIdQuery(noc_id);

    console.log("Approvallll:::", NocData);

    const [putNocApproval] = usePutNocApprovalMutation();

    const status = NocData?.results[0].status;
  const { backgroundColor, color } = approvalcellStyle(status, theme);

    const openPdfInNewTab = (path) => {
        if (!path) {
            toast.error("No Attachment", {
                position: "top-center",
                autoClose: 2000,
            });
        } else {
            window.open(path, "_blank");
        }
    };
    const handleNotesChange = (event) => setReason(event.target.value);
    const handleCloseReasonDialog = () => setReasonDialogOpen(false);

    const handleButtonClick = (action, data) => {
        setDataObject(data);
        setActionPerformed(action);
        setReasonDialogOpen(true);
    };

    const handleSubmit = async () => {
        const formData = {
            status: actionPerformed,
            comments: reason,
            approving_authority: dataOject?.approving_authority?.id,
            approving_authority_designation: dataOject?.approving_authority_designation,
            noc_request: dataOject?.noc_request,
        };

        try {
            const res = await putNocApproval({ formData, id });
            console.log("res::", res);
            if (res?.data?.id) {
                if (res?.error?.status === 422 && res?.error?.data?.code) {
                    return (showToast(`${res?.error?.data?.detail}`, "error"));
                }
                if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                    return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                }
                navigate("/approval/nocapproval");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
        setReasonDialogOpen(false);
    };

    return (
        <Box sx={{}}>
            {nocLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                    }}
                >
                    <Loader />
                </Box>
            ) : nocError ? (
                <ErrorHandler online={navigator.onLine} />
            ) : (
                <Box sx={{ pl: 0.7, pt: 0.7 }}>
                    <Grid
                        container
                        spacing={0}
                        sx={{ width: "100%", border: "1px solid #E4E4E4" }}
                    >
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "120px" }}
                                >
                                    NOC ID:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {noc_id}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "120px" }}
                                >
                                    Employee Name:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                {NocData?.results[0]?.employee?.first_name.charAt(0).toUpperCase()}{NocData?.results[0]?.employee?.first_name.slice(1).toLowerCase()} {NocData?.results[0]?.employee?.last_name.charAt(0).toUpperCase()}{NocData?.results[0]?.employee?.last_name.slice(1).toLowerCase()}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "200px" }}
                                >
                                    Attachment:
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
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            onClick={() => {
                                                openPdfInNewTab(NocData?.results[0]?.attachments);
                                            }}
                                        >
                                            <Outlined_eye color={`${theme.palette.success[600]}`} />
                                        </div>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "120px" }}
                                >
                                    Initiation Date:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {NocData?.results[0]?.noc_apply_date}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "120px" }}
                                >
                                    NOC Type:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {NocData?.results[0]?.noc_type?.noc_type}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "100px" }}
                                >
                                    Status:
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    sx={{
                                        fontWeight: 600,
                                        px: 2,
                                        borderRadius: "4px",
                                        backgroundColor: backgroundColor, color: color,
                                        width: "100px"
                                    }}
                                >
                                    {NocData?.results[0].status}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                                <Typography
                                    variant="subtitle1"
                                    color="initial"
                                    fontWeight={600}
                                    sx={{ width: "100px" }}
                                >
                                    Reason:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {NocData?.results[0]?.noc_middle_body_text}{" "}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Box sx={{ m: 0.7 }}>
                <Typography
                    variant="h6"
                    color="initial"
                    sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 0.6 }}
                >
                    Approvals Status:
                </Typography>

                {NocData?.results[0]?.approvals.map(
                    (data, index) =>
                        data?.approving_authority?.id !== user_id && (
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
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {data?.approving_authority?.first_name}{" "}
                                                {data?.approving_authority?.last_name}
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                color="initial"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                |
                                            </Typography>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    px: 2,
                                                    borderRadius: "4px",
                                                    backgroundColor: approvalcellStyle(data?.status, theme).backgroundColor, color: approvalcellStyle(data?.status, theme).color,
                                                }}
                                            >
                                                {data.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={0}>
                                        <Grid
                                            item
                                            xs={3}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    color="initial"
                                                    fontWeight={600}
                                                    sx={{ width: "150px" }}
                                                >
                                                    Officer Name:
                                                </Typography>
                                            </Box>
                                        </Grid>


                                        <Grid
                                            item
                                            xs={9}
                                            sx={{
                                                border: "1px solid #E4E4E4",
                                                p: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography variant="subtitle1" color="initial">
                                                    {" "}
                                                    {data?.approving_authority?.first_name +
                                                        " " +
                                                        data?.approving_authority?.last_name}{" "}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {data?.approving_authority?.id == user_id && data?.comments && (
                                        <Grid container spacing={0}>
                                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    color="initial"
                                                    fontWeight={600}
                                                    sx={{ width: "150px" }}
                                                >
                                                    Comments:
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "start",
                                                }}
                                            >
                                                <Typography variant="subtitle1" color="initial">
                                                    {" "}
                                                    {data?.comments}{" "}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    )}

                                    {data?.approving_authority?.id == user_id && (
                                        <>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "start",
                                                    p: 1,
                                                    mt: 3,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="initial"
                                                    sx={{ width: "100px",fontWeight:"bold" }}
                                                >
                                                    Comments:{" "}
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
                                                    placeholder="Write the Reason..."
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
                                                    onClick={() => handleButtonClick("Approved", data)}
                                                >
                                                    Approve
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
                                                    onClick={() => handleButtonClick("Rejected", data)}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        )
                )}
            </Box>

            {/* Dialog  */}
            <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
                <Box sx={{ width: "350px" }}>
                    <DialogContent>
                        <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
                            <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {actionPerformed === "Rejected" ? "Reject" : "approve"}?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ mt: 4 }}>
                        <Button onClick={handleSubmit} sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }}>
                            Submit
                        </Button>
                        <Button onClick={() => setReasonDialogOpen(false)} sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2, }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default NocApprovalDetail;
