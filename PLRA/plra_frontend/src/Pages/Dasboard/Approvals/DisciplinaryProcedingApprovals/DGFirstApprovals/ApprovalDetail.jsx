import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlined_eye, Warning } from "../../../../../Assets/Icons/index.jsx";
import { ErrorHandler, InputField, Loader, } from "../../../../../Components/index.js";
import { useDGFirstApprovalsPutMutation, useDisciplinaryProceedingApiQuery, useProbeOfficerApprovalsPutMutation } from "../../../../../Features/API/DisciplinaryProceedings.js";
import { showToast } from "../../../../../Components/shared/Toast_Card.jsx";
import { approvalcellStyle } from "../../../../../Utils/cellstyle.js";
import useDateFormat from "../../../../../hooks/useDateFormat.js";

const ApprovalDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id, approvalID } = useParams();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [dataOject, setDataObject] = useState({});
  const [actionPerformed, setActionPerformed] = useState("");
  const [reason, setReason] = useState("");
  const [user_id, set_user_id] = useState(null);
  const formatDate = useDateFormat();


  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(approvalID);

  //Function
  


  const { data: DisciplineProceedingsData, isLoading: DisciplineProceedingsLoading, isError: DisciplineProceedingsisError, error: DisciplineProceedingsError, refetch, } = useDisciplinaryProceedingApiQuery(approvalID);
  console.log(DisciplineProceedingsData);
  const formattedApplyDate = formatDate(DisciplineProceedingsData?.inquiry_start_date)

  const formattedDate = DisciplineProceedingsData?.inquiry_start_date
    ? new Date(DisciplineProceedingsData?.inquiry_start_date).toISOString().split('T')[0]
    : '';

  const [ApprovalsPut] = useDGFirstApprovalsPutMutation();
  useEffect(() => { refetch(); }, []);

  const status = DisciplineProceedingsData?.inquiry_status;
  const { backgroundColor, color } = approvalcellStyle(status, theme);

  const handleCloseReasonDialog = () => setReasonDialogOpen(false);

  const handleButtonClick = (action, data) => {
    setDataObject(data);
    setActionPerformed(action);
    setReasonDialogOpen(true);
  };

  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };

  const handleSubmit = async () => {
    const formData = {
      probe_allegation_status: actionPerformed,
      disciplinary_proceeding_request: approvalID,
      approving_authority: user_id,
    };
    try {
      const res = await ApprovalsPut({ formData, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        toast.success("Approval Updated Successfully", { position: "top-center", autoClose: 1000, });
        setTimeout(() => { navigate("/approval/disciplinaryprocedingapproval/dgfirstapproval"); }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
    }
    setReasonDialogOpen(false);
  };

  return (
    <Box sx={{}}>
      {DisciplineProceedingsLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
        <Loader />
      </Box>
        : DisciplineProceedingsisError ? <ErrorHandler online={navigator.onLine} /> :
          <Box sx={{ pl: 0.7, pt: 0.7 }}>
            <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "190px" }}>
                    ID:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    #00{approvalID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                    Name:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {DisciplineProceedingsData?.employee.first_name}{" "}{DisciplineProceedingsData?.employee.last_name}
                  </Typography>
                </Box>
              </Grid>
              {DisciplineProceedingsData?.inquiry_type?.inquiryoutcomes?.inquiry_name ?
                <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                      Inquiry Type:
                    </Typography>
                    <Typography variant="subtitle1" color="initial">
                      {DisciplineProceedingsData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                    </Typography>
                  </Box>
                </Grid> : <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                      Inquiry Type:
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color, width: "100px" }}>
                      {DisciplineProceedingsData?.inquiry_status}
                    </Typography>
                  </Box>
                </Grid>}
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "180px" }}>
                    Inquiry Reason:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {DisciplineProceedingsData?.inquiry_reason}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                    Inquiry Start Date:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {formattedApplyDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Status:
                  </Typography>
                  <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color, width: "100px" }}>
                    {DisciplineProceedingsData?.inquiry_status}
                  </Typography>
                </Box>
              </Grid>
              {DisciplineProceedingsData?.remarks_for_other_inquiry_reason && (
                <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "300px" }}>
                      Remarks for other inquiry reason:
                    </Typography>
                    <Typography variant="subtitle1" color="initial">
                      {DisciplineProceedingsData?.remarks_for_other_inquiry_reason}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
      }

      <Box sx={{ m: 0.7 }}>
        <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}>
          Approvals :
        </Typography>

        {DisciplineProceedingsData?.approvals.map((data, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
              <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2, }}>
                  <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                    {data?.designation}
                  </Typography>
                  <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                    |
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: approvalcellStyle(data?.probe_allegation_status ? data?.probe_allegation_status : data?.status, theme).backgroundColor, color: approvalcellStyle(data?.probe_allegation_status ? data?.probe_allegation_status : data?.status, theme).color, }}>
                    {data?.probe_allegation_status ? data?.probe_allegation_status : data?.status}
                  </Typography>
                </Box>
                {data?.status_date ? <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                  Approval Date: {data?.status_date}
                </Box> : data?.alert_date ? <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                  Alert Date: {data?.alert_date}
                </Box> : null}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={0}>
                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                      Officer Name:
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                    <Typography variant="subtitle1" color="initial">
                      {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              {data?.designation === "PROBE OFFICER" && data?.status === "Refer to DG" && (
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                        Attachment:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                        <div onClick={() => { openPdfInNewTab(data?.attachment_of_probe_report); }}>
                          <Outlined_eye color={`${theme.palette.success[600]}`} />
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {data?.approving_authority?.id == user_id && data?.probe_allegation_status === "Pending" && (
                <>
                  <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                    <Button sx={{ backgroundColor: theme.palette.primary[200], color: theme.palette.primary.main, borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Approved", data)}>
                      Forward
                    </Button>
                    <Button sx={{ backgroundColor: theme.palette.error[300], color: theme.palette.error[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Unapproved", data)}>
                      Reject
                    </Button>
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialog  */}
      <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
        <Box sx={{ width: "350px" }}>
          <DialogContent>
            <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center", gap: 1, ml: '-5px' }}>
              <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {actionPerformed === "Unapproved" ? "Unapprove" : "approve"}?
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