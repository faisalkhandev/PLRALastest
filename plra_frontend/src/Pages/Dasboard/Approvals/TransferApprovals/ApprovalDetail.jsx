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
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Outlined_eye, Warning } from "../../../../Assets/Icons/index.jsx";
import {
  ErrorHandler,
  InputField,
  Loader,
} from "../../../../Components/index.js";
import {
  useAllResignationByIdQuery,
  useResignationApprovalsPutMutation,
} from "../../../../Features/API/ResignationApi.js";
import { toast } from "react-toastify";
import { useGetAllTransferPendingbyIdQuery, useUpdatetransferMutation } from "../../../../Features/API/Transfer.js";
import { showToast } from "../../../../Components/shared/Toast_Card.jsx";

const ApprovalDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id, } = useParams();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [dataOject, setDataObject] = useState({});
  const [actionPerformed, setActionPerformed] = useState("");
  const [reason, setReason] = useState("");
  const [user_id, set_user_id] = useState(null);
  const [dateData, setdateData] = useState({
    // attachment: null,
    from_date: "",
  });

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  const { data: approvalData, isLoading: approvalLoading, isError: approvalisError, error: approvalError, refetch, } = useGetAllTransferPendingbyIdQuery(id);
  console.log(approvalData);

  useEffect(() => {
    refetch();
  }, []);
  const [ApprovalsPut] = useUpdatetransferMutation();

  const getStatusStyle = (status, theme) => {
    let backgroundColor, color;

    switch (status) {
      case "Approved":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Refer to Competent Authority":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Pending":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "In process":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "In Process":
        backgroundColor = theme.palette.warning[300];
        color = theme.palette.warning.main;
        break;
      case "Rejected":
        backgroundColor = theme.palette.error[300];
        color = theme.palette.error[600];
        break;
      default:
        backgroundColor = "black";
        color = "black";
    }

    return { backgroundColor, color };
  };
  const status = approvalData?.transfer_process?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };
  const handleNotesChange = (event) => setReason(event.target.value);
  const handleCloseReasonDialog = () => setReasonDialogOpen(false);

  const handleButtonClick = (action, data) => {
    setDataObject(data);
    setActionPerformed(action);
    setReasonDialogOpen(true);
  };

  const close = () => {
    setReasonDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "from_date") {
      const currentDate = new Date();
      const selectedDate = new Date(value);

      // Set hours, minutes, seconds, and milliseconds to 0 for both dates
      currentDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        toast.error("You cannot select previous date", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }
    setdateData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    let date;
    if (approvalData?.designation === "HR DIRECTOR") {
      date = dateData.from_date;
    } else {
      date = null;
    }
    const formData = {
      notes: reason,
      visible: "false",
      status: actionPerformed,
      approving_authority: approvalData?.approving_authority?.id,
      transfer_process: approvalData?.transfer_process?.transfer_rec_id,
      Joining_effective_date: date?date:null,
    };
    console.log(formData);
    try {
      const res = await ApprovalsPut({ formData, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        toast.success("Transfer Approval Updated Successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/approval/transferapproval");
        }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
    setReasonDialogOpen(false);
  };

  return (
    <Box sx={{}}>
      {approvalLoading ? (
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
      ) : approvalisError ? (
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
                  sx={{ width: "100px" }}
                >
                  ID:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  #00{id}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "50px" }}
                >
                  Name:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.employee.first_name}{" "}
                  {approvalData?.transfer_process?.employee.last_name}
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
                  sx={{ width: "100px" }}
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
                        openPdfInNewTab(approvalData?.transfer_process?.attachments);
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
                  sx={{ width: "150px" }}
                >
                  Transfer Category:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_category}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer Apply date:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_apply_date}
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
                    backgroundColor: backgroundColor,
                    color: color
                  }}
                >
                  {approvalData?.transfer_process?.status}{" "}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "150px" }}
                >
                  Transfer Position:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_position?.position_desc}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer Center:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_position?.location?.center_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer District:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_position?.location?.district?.district_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Division:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_position?.location?.division?.division_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Tehsil:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.transfer_position?.location?.tehsil?.t_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "110px" }}
                >
                  Wing:
                </Typography>
                <Typography variant="subtitle1" color="initial" sx={{ width: "165px" }}>
                  {approvalData?.transfer_process?.transfer_position?.wing?.wing_name}
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
                  Remarks:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.transfer_process?.remarks}{" "}
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
          sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}
        >
          Approvals:
        </Typography>

        <Accordion key={1}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${1}-content`}
            id={`panel${1}-header`}
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
                  {approvalData?.designation}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  sx={{ fontWeight: 600 }}
                >
                  |
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(approvalData?.status, theme).backgroundColor, color: getStatusStyle(approvalData?.status, theme).color, }}>
                  {approvalData?.status}
                </Typography>
              </Box>
              <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                Approval Date: {approvalData?.transfer_process?.transfer_approval_date}
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
                    {approvalData?.approving_authority?.first_name +
                      " " +
                      approvalData?.approving_authority?.last_name}{" "}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {approvalData?.designation === "HR DIRECTOR" &&
              approvalData?.Joining_effective_date && (
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={3}
                    sx={{
                      border: "1px solid #E4E4E4",
                      p: 1,
                      borderBottom: "none",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      {" "}
                      <Typography
                        variant="subtitle1"
                        color="initial"
                        fontWeight={600}
                        sx={{ width: "200px" }}
                      >
                        Effective date:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={9}
                    sx={{
                      border: "1px solid #E4E4E4",
                      p: 1,
                      borderBottom: "none",
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
                        {approvalData?.Joining_effective_date}{" "}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            {approvalData?.notes && (
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
                      {approvalData?.notes}{" "}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}

            {approvalData?.approving_authority?.id == user_id &&
              approvalData?.status === "Pending" && (
                <>
                  <Box sx={{ width: "300px", p: 1, mt: 2 }}>
                    <InputField
                      name="from_date"
                      type="date"
                      label="Joining Date"
                      onChange={handleChange}
                      value={dateData?.from_date}
                      min={getCurrentDate}
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", alignItems: "start", p: 1, mt: 3 }}
                  >
                    <Typography
                      variant="body2"
                      color="initial"
                      sx={{ width: "100px" }}
                    >
                      Notes:{" "}*
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
                      placeholder="Write your remarks..."
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
                      onClick={() => handleButtonClick("Approved", approvalData)}
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
                      onClick={() => handleButtonClick("Rejected", approvalData)}
                    >
                      Reject
                    </Button>
                  </Box>
                </>
              )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Dialog  */}
      <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
        <Box sx={{ width: "600px" }}>
          <DialogContent>
            <Typography variant="body2" color="initial" sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center" }}>
              <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {actionPerformed === "Rejected" ? "Reject" : "Accept"}?
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

export default ApprovalDetail;