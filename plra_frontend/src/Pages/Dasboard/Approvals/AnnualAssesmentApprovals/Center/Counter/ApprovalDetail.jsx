import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Switch, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Outlined_eye, Warning } from "../../../../../../Assets/Icons/index.jsx";
import { ErrorHandler, Loader, SimpleDropDown, TextArea } from "../../../../../../Components";
import { useCcoApprovalByIDQuery, useCocApprovalsPutMutation, useCoroAllRatingQuery } from "../../../../../../Features/API/AnnualAssessment.js";
import { toast } from "react-toastify";
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
  const [disableFields, setfieldsDisable] = useState(false);
  const [ishonest, setishonest] = useState(false);
  const [isreportedascorrupt, setreportedascorrupt] = useState(false);
  const [isuseful, setuseful] = useState(false);
  const [inputData, setInputData] = useState([]);
  const [Data, setData] = useState({ aar_process: apprvalID, status: "", service_level: "", pen_picture_countersigning_officer: "", honest: "", reported_as_corrupt: "", useful: "", });
  const formatDate = useDateFormat();

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(apprvalID);
  console.log(id);

  const { data: approvalData, isLoading: approvalLoading, isError: approvalisError, error: approvalError, refetch, } = useCcoApprovalByIDQuery(apprvalID);
  console.log(approvalData);
  const { data: RatingData, isLoading: RatingLoading, isError: RatingisError, error: RatingError, refetch: RatingRefectch, } = useCoroAllRatingQuery(apprvalID);
  const [horApprovalsPut] = useCocApprovalsPutMutation();

  useEffect(() => { refetch(); RatingRefectch() }, [actionPerformed, refetch, RatingRefectch]);


  //Function
  const formattedDate = approvalData?.results[0]?.aar_apply_Date
    ? new Date(approvalData?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(approvalData?.results[0]?.aar_apply_Date)


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

  const handleDropDownChange = (event, field) => {
    setData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleTextAreaChange = (event, field) => {
    setData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleCloseReasonDialog = () => setReasonDialogOpen(false);

  const handleButtonClick = (action, data) => {
    setDataObject(data);
    setActionPerformed(action);
    setReasonDialogOpen(true);
  };

  const handleSubmit = async () => {
    setReasonDialogOpen(false);
    console.log(actionPerformed);
    if (Data.service_level == "") {
      toast.error(`Please fill mandatory fields`, { position: "top-center", autoClose: 3000, });
      return;
    }
    const formData = {
      aar_process: apprvalID,
      status: actionPerformed,
      service_level: Data.service_level,
      pen_picture_countersigning_officer: Data.pen_picture_countersigning_officer,
      honest: Data.honest,
      reported_as_corrupt: Data.reported_as_corrupt,
      useful: Data.useful,
    };

    try {
      const res = await horApprovalsPut({ formData, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        showToast(`Updated Successfully`, "success");
        setTimeout(() => { navigate("/approval/annualassesment/center/counter"); }, 3000);
      }
    } catch (error) {
      showToast(`Error submitting form:${error.message}`, "error");
    }
  };

  const Grading_options = [
    {
      "value": "Very Good",
      "label": "Very Good"
    },
    {
      "value": "Good",
      "label": "Good"
    },
    {
      "value": "Average",
      "label": "Average"
    },
    {
      "value": "Below Average",
      "label": "Below Average"
    }
  ]

  const generateInputFields = () => {
    const inputFields = [];
    for (let i = 0; i < RatingData?.results.length; i++) {
      inputFields.push(
        <Grid container spacing={0} key={i}>
          <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, pt: 2, }} name="sr_no">
            {RatingData?.results[i]?.id}
          </Grid>
          <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
            {RatingData?.results[i]?.category}
          </Grid>
          <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
            {RatingData?.results[i]?.max_points}
          </Grid>
          <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
            {RatingData?.results[i]?.system_generated_points}
          </Grid>
          {RatingData?.results[i]?.point_earned != null && (
            <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
              {RatingData?.results[i]?.point_earned}
            </Grid>
          )}
          {RatingData?.results[i]?.point_earned == null && (
            <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
              <TextField name="point_earned" placeholder="Enter Points" type="number" onChange={(event) => handleInputChange(event, i)} fullWidth mandatory />
            </Grid>
          )}
        </Grid>
      );
    }
    return inputFields;
  };

  useEffect(() => {
    console.log("inputData: ", inputData);
  }, [inputData]);

  return (
    <Box sx={{}}>
      {approvalLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
        <Loader />
      </Box>
        : approvalisError ? <ErrorHandler online={navigator.onLine} /> :
          <Box sx={{ pl: 0.7, pt: 0.7 }}>
            <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    ID:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    #00{apprvalID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                    Attachment:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: "pointer", }}>
                      <div onClick={() => { openPdfInNewTab(approvalData?.results[0]?.attachments); }}>
                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                      </div>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Apply Date:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {formattedApplyDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                    year:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {approvalData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                    Status:
                  </Typography>
                  <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                    {approvalData?.results[0]?.status}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Notes:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {approvalData?.results[0]?.notes}
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
                  <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2, }}>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      {data?.designation}
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      |
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(data?.status, theme).backgroundColor, color: getStatusStyle(data?.status, theme).color, }}>
                      {data.status}
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
                {data?.designation == "REPORTING OFFICER" && data?.status == "Approved" && (
                  <Fragment>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Overall Grading:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial">
                            {data?.over_All_grading?.percentile_range}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, border: "1px solid white" }}>
                      <Grid container spacing={0}>
                        <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }}>
                          ID
                        </Grid>
                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                          Category
                        </Grid>
                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                          Max Points
                        </Grid>
                        <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                          System Generated Points
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "0px 4px 0px 0px", }}>
                          Point Earned
                        </Grid>
                      </Grid>
                      {generateInputFields()}
                    </Box>
                  </Fragment>
                )}
                {data?.approving_authority?.id == user_id && data?.status == "In Process" && data?.designation == "COUNTERSIGNING OFFICER" && (
                  <div>
                    <Grid container spacing={0} sx={{ width: "100%", mt: 4, display: 'flex', }}>
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: "center", pr: 3 }} >
                        <Typography sx={{ display: 'flex', mt: 0.8, fontSize: '14px' }} >Honest:</Typography>
                        <Switch size="small" checked={Data.honest} disabled={disableFields} onClick={(e) => { const handleSuperUser = !ishonest; setishonest(handleSuperUser); setData((prevData) => ({ ...prevData, honest: handleSuperUser })); }} name='honest' />
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", mb: 2, justifyContent: "space-between", alignItems: "center" }} >
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 13, fontSize: '14px' }} >Reported as corrupt:</Typography>
                        <Switch size="small" checked={Data.reported_as_corrupt} disabled={disableFields} onClick={(e) => { const handleSuperUser = !isreportedascorrupt; setreportedascorrupt(handleSuperUser); setData((prevData) => ({ ...prevData, reported_as_corrupt: handleSuperUser })); }} name='reported_as_corrupt' />
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: "center", pr: 3 }} >
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 13, fontSize: '14px' }} >Useful:</Typography>
                        <Switch size="small" checked={Data.useful} disabled={disableFields} onClick={(e) => { const handleSuperUser = !isuseful; setuseful(handleSuperUser); setData((prevData) => ({ ...prevData, useful: handleSuperUser })); }} name='useful' />
                      </Grid>
                      <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                        <SimpleDropDown name="service_level" label="Service Level" isShowIcon={true} value={Data.service_level} options={Grading_options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "service_level")} />
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextArea Rows={5} label="Pen Picture" name="pen_picture_countersigning_officer" placeholder="Pen Picture...." value={Data.pen_picture_countersigning_officer} onChange={(event) => handleTextAreaChange(event, "pen_picture_countersigning_officer")} />
                      </Grid>
                    </Grid>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                      <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Approved", data)}>
                        Approve
                      </Button>
                      <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Refer to Competent Authority", data)}>
                        Refer to DG
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
              <Warning color={`${theme.palette.warning[600]}`} /> Do you want to {actionPerformed === "Refer to Competent Authority" ? "Refer to DG" : "Approve"}?
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
