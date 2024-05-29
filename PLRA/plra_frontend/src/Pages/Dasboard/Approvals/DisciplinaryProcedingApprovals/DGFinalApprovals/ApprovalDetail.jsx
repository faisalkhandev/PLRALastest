import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlined_eye, Warning } from "../../../../../Assets/Icons/index.jsx";
import { Btn, ErrorHandler, InputField, Loader, SimpleDropDown, } from "../../../../../Components/index.js";
import { useDGFinalApprovalsPutMutation, useDirHRApprovalsPutMutation, useDisciplinaryProceedingApiQuery, useInquiryOutcomesApiQuery, useInquiryTypeApiByIdQuery, useInquiryTypeApiQuery } from "../../../../../Features/API/DisciplinaryProceedings.js";
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
  const [inquiry_id, set_inquiry_id] = useState(null);
  const formatDate = useDateFormat();

  const [type_id, set_type_id] = useState(null);
  const [formData, setformData] = useState({
    inquiry_name: "", inquiry_type: "", amount: "", start_date: "", end_date: "",
  });

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  

  console.log(approvalID);
  console.log(inquiry_id);

  const { data: DisciplineProceedingsData, isLoading: DisciplineProceedingsLoading, isError: DisciplineProceedingsisError, error: DisciplineProceedingsError, refetch, } = useDisciplinaryProceedingApiQuery(approvalID);
  const { data: InquiryOutcomeData, isLoading: InquiryOutcomeLoading, isError: InquiryOutcomeisError, error: InquiryOutcomeError, refetch: InquiryOutcomeRefectch, } = useInquiryOutcomesApiQuery();
  const { data: InquiryOutcomeIdData, isLoading: InquiryOutcomeIdLoading, isError: InquiryOutcomeIdisError, error: InquiryOutcomeIdError, refetch: InquiryOutcomeIdRefectch, } = useInquiryTypeApiByIdQuery(type_id);
  const { data: InquiryTypeData, isLoading: InquiryTypeLoading, isError: InquiryTypeisError, error: InquiryTypeError, refetch: InquiryTypeRefectch, } = useInquiryTypeApiQuery(inquiry_id);
  console.log(DisciplineProceedingsData);
  console.log(InquiryOutcomeData);
  console.log(InquiryTypeData);
  console.log(InquiryOutcomeIdData);
//Function
const formattedDate = DisciplineProceedingsData?.inquiry_start_date
? new Date(DisciplineProceedingsData?.inquiry_start_date).toISOString().split('T')[0]
: '';

const formattedApplyDate = formatDate(DisciplineProceedingsData?.inquiry_start_date)
  const [ApprovalsPut] = useDGFinalApprovalsPutMutation();

  const inquiry_outcome = InquiryOutcomeData?.results?.map(item => ({
    value: item?.id,
    label: item?.inquiry_name
  }));
  const inquiry_type = InquiryTypeData?.results?.map(item => ({
    value: item?.id,
    label: item?.category_name,
  }));

  useEffect(() => { refetch(); InquiryOutcomeRefectch(); InquiryTypeRefectch(); InquiryOutcomeIdRefectch(); }, []);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "start_date" || name == "end_date") {
      const currentDate = new Date();
      const selectedDate = new Date(value);

      // Set hours, minutes, seconds, and milliseconds to 0 for both dates
      currentDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        toast.error("You cannot select previous date", { position: "top-center", autoClose: 3000, });
        return;
      }
    }
    setformData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDropDownChange = (event, field) => {
    if (field === "inquiry_name") {
      const selectedId = event.target.value;
      console.log("id", selectedId);
      set_inquiry_id(selectedId);
      InquiryTypeRefectch();
    } else if (field === "inquiry_type") {
      const choice = event.target.value;
      console.log(choice);
      set_type_id(choice);
      InquiryOutcomeIdRefectch();
    }
    setformData((prevFormData) => ({ ...prevFormData, [field]: event.target.value }));
  };

  const handleReset = () => {
    setformData({
      inquiry_name: "", inquiry_type: "", amount: "", start_date: "", end_date: "",
    });
  };

  const handleSubmit = async () => {
    let formD = new FormData();
    if (!formData.inquiry_name && !formData.inquiry_type) {
      toast.error("Fill All Fields! ", {
        position: "top-center",
        autoClose: "30000",
      });
      setReasonDialogOpen(false)

      return;
    }
    else if (formData.inquiry_name && formData.inquiry_type) {
      formD.append("inquiry_name", formData.inquiry_name);
      formD.append("inquiry_type", formData.inquiry_type);
      if (InquiryOutcomeIdData?.results[0]?.nature === "Amount" && !formData.amount) {
        toast.error("Enter Amount! ", {
          position: "top-center",
          autoClose: "30000",
        });
        setReasonDialogOpen(false)

        return;
      } else { formD.append("amount", formData.amount); }
      if (InquiryOutcomeIdData?.results[0]?.nature === "Date" && !formData.start_date && !formData.end_date) {
        toast.error("Enter Amount! ", {
          position: "top-center",
          autoClose: "30000",
        });
        setReasonDialogOpen(false)

        return;
      } else {
        formD.append("start_date", formData.start_date);
        formD.append("end_date", formData.end_date);
      }
      formD.append("status", "Closed");
    }
    formD.append("disciplinary_proceeding_request", approvalID);
    formD.append("approving_authority", user_id);
    console.log(Object.fromEntries(formD.entries()));

    try {
      const res = await ApprovalsPut({ formData: formD, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        toast.success("Approval Updated Successfully", { position: "top-center", autoClose: 1000, });
        setTimeout(() => { navigate("/approval/disciplinaryprocedingapproval/dgfinalapproval"); }, 3000);
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
                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                    <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                      Officer Name:
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
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

              {data?.designation === "HR USER" && data?.status === "Refer to Director HR" && (
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
                        <div onClick={() => { openPdfInNewTab(data?.attachment_of_personal_hearing_notice); }}>
                          <Outlined_eye color={`${theme.palette.success[600]}`} />
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {data?.designation === "INQUIRY OFFICER" && data?.attachment_of_inquiry_order && (
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                        Attachment of Inquiry Order:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                        <div onClick={() => { openPdfInNewTab(data?.attachment_of_inquiry_order); }}>
                          <Outlined_eye color={`${theme.palette.success[600]}`} />
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {data?.designation === "INQUIRY OFFICER" && data?.attachment_of_inquiry_report && (
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                        Attachment of Inquiry Report:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                        <div onClick={() => { openPdfInNewTab(data?.attachment_of_inquiry_report); }}>
                          <Outlined_eye color={`${theme.palette.success[600]}`} />
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {data?.designation === "DIRECTOR HR" && data?.attachment_of_final_order && (
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                        Attachment of Inquiry Report:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                        <div onClick={() => { openPdfInNewTab(data?.attachment_of_final_order); }}>
                          <Outlined_eye color={`${theme.palette.success[600]}`} />
                        </div>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {data?.approving_authority?.id == user_id && data?.status === "Pending" && (
                <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                  <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <SimpleDropDown name="inquiry_name" label="Inquiry Name" isShowIcon={true} mandatory={true} value={formData.inquiry_name} options={inquiry_outcome} sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "inquiry_name")} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <SimpleDropDown name="inquiry_type" label="Inquiry Type" mandatory={true} isShowIcon={true} value={formData.inquiry_type} options={inquiry_type} sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "inquiry_type")} />
                  </Grid>
                </Grid>
              )}

              {console.log("type_id", type_id)}
              {console.log("amount", InquiryOutcomeIdData?.results[0]?.nature)}

              {data?.approving_authority?.id == user_id && data?.status === "Pending" && (
                <Btn type="reset" outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', mt: 2 }} onClick={handleReset} />
              )}

              {data?.approving_authority?.id == user_id && data?.status === "Pending" && InquiryOutcomeIdData?.results[0]?.id === type_id && InquiryOutcomeIdData?.results[0]?.nature === "Amount" && (
                <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                  <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <InputField name="amount" label="Amount" mandatory={true} onChange={handleChange} value={formData.amount} type="number" />
                  </Grid>
                </Grid>
              )}

              {data?.approving_authority?.id == user_id && data?.status === "Pending" && InquiryOutcomeIdData?.results[0]?.id === type_id && InquiryOutcomeIdData?.results[0]?.nature === "Date" && (
                <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                  <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <InputField name="start_date" type="date" mandatory={true} label="Start Date" onChange={handleChange} value={formData?.start_date} min={getCurrentDate} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <InputField name="end_date" type="date" mandatory={true} label="End Date" onChange={handleChange} value={formData?.end_date} min={getCurrentDate} />
                  </Grid>
                </Grid>
              )}

              {data?.approving_authority?.id == user_id && data?.status === "Pending" && (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                  <Button sx={{ backgroundColor: theme.palette.error[300], color: theme.palette.error[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Closed", data)}>
                    Close
                  </Button>
                </Box>
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
              <Warning color={`${theme.palette.warning[600]}`} /> Do you want to close this case?
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