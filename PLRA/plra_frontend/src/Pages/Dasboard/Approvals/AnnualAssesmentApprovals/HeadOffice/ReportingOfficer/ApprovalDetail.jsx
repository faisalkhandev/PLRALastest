import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Switch, Typography, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlined_eye, Warning } from "../../../../../../Assets/Icons/index.jsx";
import { ErrorHandler, Loader, SimpleDropDown, TextArea } from "../../../../../../Components/index.js";
import { useCcoApprovalByIDQuery, useHorApprovalsPutMutation, } from "../../../../../../Features/API/AnnualAssessment";
import { showToast } from "../../../../../../Components/shared/Toast_Card.jsx";
import useDateFormat from "../../../../../../hooks/useDateFormat.js";

const ApprovalDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id, apprvalID } = useParams();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [dataOject, setDataObject] = useState({});
  const [actionPerformed, setActionPerformed] = useState("");
  const [reason, setReason] = useState("");
  const [user_id, set_user_id] = useState(null);
  const [formData, setFormData] = useState({ aar_process: apprvalID, status: "Approved", quality_of_work: "", output_of_work: "", overall_grading: "", integrity_general: "", integrity_intellectual: "", officer_performance: "", pen_picture_reporting_officer: "", area_and_level_of_expertise: "", fitness_for_retention: "", training_and_development_need: false });
  const formatDate = useDateFormat();


  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(apprvalID);
  console.log(id);

  const { data: approvalData, isLoading: approvalLoading, isError: approvalisError, error: approvalError, refetch, } = useCcoApprovalByIDQuery(apprvalID);
  console.log(approvalData);
  const [horApprovalsPut] = useHorApprovalsPutMutation();

  //Function
  const formattedDate = approvalData?.results[0]?.aar_apply_Date
    ? new Date(approvalData?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(approvalData?.results[0]?.aar_apply_Date)



  useEffect(() => { refetch() }, [actionPerformed, refetch]);

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
  const status = approvalData?.results[0]?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };
  const handleCloseReasonDialog = () => setReasonDialogOpen(false);

  const handleButtonClick = (action, data) => {
    setDataObject(data);
    setActionPerformed(action);
    setReasonDialogOpen(true);
  };

  function handleChangeActive(event) {
    setFormData(prevState => ({
      ...prevState,
      training_and_development_need: event.target.checked
    }));
  }

  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleTextAreaChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleSubmit = async () => {
    console.log("Form Data on Submit:", formData);
    setReasonDialogOpen(false);
    if (formData.quality_of_work === "" || formData.integrity_general === "" || formData.output_of_work === "" || formData.integrity_intellectual === "" || formData.overall_grading === "") {
      toast.error(`Please fill all fields`, { position: "top-center", autoClose: 3000, });
      return;
    }
    setFormData({
      quality_of_work: formData.quality_of_work,
      integrity_general: formData.integrity_general,
      output_of_work: formData.output_of_work,
      integrity_intellectual: formData.integrity_intellectual,
      overall_grading: formData.overall_grading,
      officer_performance: formData.officer_performance,
      pen_picture_reporting_officer: formData.pen_picture_reporting_officer,
      area_and_level_of_expertise: formData.area_and_level_of_expertise,
      fitness_for_retention: formData.fitness_for_retention,
      training_and_development_need: formData.training_and_development_need
    });

    console.log(formData);
    try {
      const res = await horApprovalsPut({ formData, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        toast.success("Updated Successfully", { position: "top-center", autoClose: 1000, });
        setTimeout(() => { navigate("/approval/annualassesment/headoffice/reportingOfficer"); }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
    }
  };

  const options = [
    { value: "A", label: "A", },
    { value: "B", label: "B", },
    { value: "C", label: "C", },
    { value: "D", label: "D", },
  ];

  const Grading_options = [
    { value: "very good", label: "Very Good", },
    { value: "good", label: "Good", },
    { value: "average", label: "Average", },
    { value: "below average", label: "Below Average", },
  ];

  return (
    <Box >
      {approvalLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
        <Loader /> </Box> : approvalisError ? <ErrorHandler online={navigator.onLine} /> :
        <Box sx={{ pl: 0.7, pt: 0.7 }}>
          <Grid container spacing={0} sx={{ width: "99.5%", border: "1px solid #E4E4E4" }}>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  ID:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  #00{apprvalID}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                  Employee Name:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.results[0]?.employee?.first_name + " " + approvalData?.results[0]?.employee?.last_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Attachment:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                    <div onClick={() => { openPdfInNewTab(approvalData?.results[0]?.attachments); }}>
                      <Outlined_eye color={`${theme.palette.success[600]}`} />
                    </div>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Apply Date:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {formattedApplyDate}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  year:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
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
                    color: color,
                    width: "100px"
                  }}
                >
                  {approvalData?.results[0]?.status}{" "}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Job Description:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.results[0]?.job_description}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                  Brief Achievements:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.results[0]?.brief_achievements}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Notes:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {approvalData?.results[0]?.notes}{" "}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      }

      <Box sx={{ m: 0.7 }}>
        <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}>
          Approvals :
        </Typography>

        {approvalData?.results[0]?.approvals.map(
          (data, index) => data?.approving_authority?.id !== user_id && (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      {data?.designation}
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      |
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(data?.status, theme).backgroundColor, color: getStatusStyle(data?.status, theme).color, }}>
                      {data?.status}
                    </Typography>
                  </Box>
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
                {data?.approving_authority?.id == user_id &&
                  data?.status == "In Process" && data?.designation == "REPORTING OFFICER" && (
                    <div>
                      <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                        <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, mr: 1 }}>
                          <SimpleDropDown labelWidth={"280px"} name="quality_of_work" label="Quality of Work" isShowIcon={true} value={formData.quality_of_work} options={options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "quality_of_work")} />
                          <SimpleDropDown labelWidth={"280px"} name="output_of_work" label="Output of Work" isShowIcon={true} value={formData.output_of_work} options={options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "output_of_work")} />
                          <SimpleDropDown labelWidth={"280px"} name="overall_grading" label="Overall Grading" isShowIcon={true} value={formData.overall_grading} options={Grading_options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "overall_grading")} />
                        </Grid>
                        <Grid item xs={5.9} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <SimpleDropDown labelWidth={"280px"} name="integrity_general" label="Integrity General" isShowIcon={true} value={formData.integrity_general} options={options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "integrity_general")} />
                          <SimpleDropDown labelWidth={"280px"} name="integrity_intellectual" label="Integrity Intellectual" isShowIcon={true} value={formData.integrity_intellectual} options={options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "integrity_intellectual")} />
                          <Box sx={{ width: "100%", display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                            <Typography sx={{ width: "40%", display: "flex", mt: 0.8, fontSize: "14px" }}>Training and Development Need:</Typography>
                            <Switch size="small" checked={formData.training_and_development_need} onChange={handleChangeActive} />
                          </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <TextArea Rows={5} label="Officer Performance" name="officer_performance" placeholder="Officer Performance..." value={formData.officer_performance} onChange={(event) => handleTextAreaChange(event, "officer_performance")} />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <TextArea Rows={5} label="Pen Picture" name="pen_picture_reporting_officer" placeholder="Pen Picture...." value={formData.pen_picture_reporting_officer} onChange={(event) => handleTextAreaChange(event, "pen_picture_reporting_officer")} />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <TextArea Rows={5} label="Area and Level of Professional Expertise" name="area_and_level_of_expertise" placeholder="Level of Experties..." value={formData.area_and_level_of_expertise} onChange={(event) => handleTextAreaChange(event, "area_and_level_of_expertise")} />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <TextArea Rows={5} label="Fitness for Retention" name="fitness_for_retention" placeholder="Fitness for Retention..." value={formData.fitness_for_retention} onChange={(event) => handleTextAreaChange(event, "fitness_for_retention")} />
                        </Grid>
                      </Grid>
                      <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                        <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, mr: 2 }} onClick={() => handleButtonClick("Approved", data)}>
                          Approve
                        </Button>
                      </Box>
                    </div>
                  )}
              </AccordionDetails>
            </Accordion>
          )
        )}
      </Box>

      {/* Dialog  */}
      <Dialog open={reasonDialogOpen} onClose={handleCloseReasonDialog}>
        <Box sx={{ width: "600px" }}>
          <DialogContent>
            <Typography variant="body2" color="initial" ml={2} sx={{ fontSize: "16px", display: "flex", justifyContent: "start", alignItems: "center" }}>
              <Warning color={`${theme.palette.warning[600]}`} /> Do you want to Approve?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ mt: 4 }}>
            <Button onClick={() => setReasonDialogOpen(false)} sx={{ borderRadius: "4px", backgroundColor: theme.palette.error[300], color: theme.palette.error[600], fontSize: "14px", fontWeight: 500, p: 2, }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }}>
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ApprovalDetail;
