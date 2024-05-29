import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlined_eye, Warning, } from "../../../../../../Assets/Icons/index.jsx";
import { Btn, ErrorHandler, Loader, SimpleDropDown } from "../../../../../../Components/index.js";
import { useAllRatingTypeQuery, useCcoApprovalByIDQuery, useCorApprovalsPutMutation, useCoroAllRatingQuery, useRatingPutMutation } from "../../../../../../Features/API/AnnualAssessment.js";
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
  const [checked, setchecked] = useState(false);
  const [formData, setFormData] = useState({ aar_process: apprvalID, status: "Approved", over_All_grading: "" });
  const [inputData, setInputData] = useState({});
  const formatDate = useDateFormat();


  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(apprvalID);
  console.log(id);

  //  Query 
  const { data: approvalData, isLoading: approvalLoading, isError: approvalisError, error: approvalError, refetch, } = useCcoApprovalByIDQuery(apprvalID);
  const [horApprovalsPut] = useCorApprovalsPutMutation();
  const { data: RatingData, isLoading: RatingLoading, isError: RatingisError, error: RatingError, refetch: RatingRefectch, } = useCoroAllRatingQuery(apprvalID);
  const { data: RatingType, isLoading: RatingTypeLoading, isError: RatingTypeisError, error: RatingTypeError, refetch: RatingTypeRefectch, } = useAllRatingTypeQuery();
  const [ratingPut] = useRatingPutMutation();

  useEffect(() => { refetch(); RatingRefectch(); RatingTypeRefectch(); }, [actionPerformed, refetch, RatingRefectch, RatingTypeRefectch]);
  console.log(RatingData);
  console.log(RatingType);

  useEffect(() => {
    if (RatingData?.results) {
      setInputData(RatingData?.results.reduce((acc, result) => {
        return {
          ...acc,
          [result.id]: {
            ...result,
            point_earned: result?.point_earned,
          },
        };
      }, {}));
    }
  }, [RatingData]);


  //Function
  const formattedDate = approvalData?.results[0]?.aar_apply_Date
    ? new Date(approvalData?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(approvalData?.results[0]?.aar_apply_Date)


  console.log(RatingData);
  console.log(inputData);

  const Grading_options = RatingType?.results?.map(item => ({
    value: item?.id,
    label: item?.percentile_range
  }));

  console.log(Grading_options);

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

  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const handleSubmit = async () => {
    console.log("Form Data on Submit:", formData);
    setReasonDialogOpen(false);
    if (formData.over_All_grading === "") {
      toast.error(`Please fill all fields`, { position: "top-center", autoClose: 3000, });
      return;
    }
    setFormData({
      over_All_grading: formData.over_All_grading,
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
        showToast(`Updated Successfully`, "success")
        setTimeout(() => { navigate("/approval/annualassesment/center/reportingOfficer"); }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
    }
  };

  const generateInputFields = () => {
    const inputFields = [];
    for (let i = 0; i < RatingData?.results.length; i++) {
      inputFields.push(
        <Grid container spacing={0} key={i}>
          <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, pt: 2, }} name="sr_no">
            {i + 1}
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
          <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
            <TextField
              name="point_earned"
              placeholder="Enter Marks"
              type="number"
              value={inputData[RatingData?.results[i]?.id]?.point_earned || ""}
              onChange={(event) => handleInputChange(event, RatingData?.results[i]?.id, RatingData?.results[i]?.max_points)}
              fullWidth
            />
          </Grid>

        </Grid>
      );
    }
    return inputFields;
  };

  const handleInputChange = (event, index, points) => {
    const { name, value } = event.target;
    if (name === 'point_earned' && (parseInt(value) > points || parseInt(value) < 1)) {
      // Display an error message or handle the invalid input as needed
      toast.error("Points earned should be between 1 and max points", { position: "top-center", autoClose: 3000 });
      return;
    }
    setInputData(prevInputData => ({
      ...prevInputData,
      [index]: {
        ...prevInputData[index],
        [name]: value
      }
    }));
  };


  const handleSave = async () => {
    console.log(inputData);
    const savedData = Object.values(inputData).map((data) => ({
      id: data?.id,
      category: data?.category,
      max_points: data?.max_points,
      aar_request_id: apprvalID,
      point_earned: data.point_earned,
    }));
    console.log(savedData);
    if (savedData.length === 0) { toast.error("No steps added. Please add at least one step."); return; }
    if (savedData.length !== RatingData?.results.length) { toast.error(`Number of steps should be ${RatingData?.count}. Please provide values for each step.`); return; }
    savedData.forEach(async (data) => {
      const { id, point_earned, category, max_points, aar_request_id } = data;
      console.log(data);
      try {
        await ratingPut({ formData: { point_earned, category, max_points, aar_request_id }, id, });
        toast.success("Updated Successfully", { position: "top-center", autoClose: 1000, });
      } catch (error) {
        toast.error(`Failed to update: ${error}`); return;
      }
    });
  };

  useEffect(() => { console.log("inputData: ", inputData); }, [inputData]);

  return (
    <Box>
      {approvalLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
        <Loader />
      </Box>
        : approvalisError ? <ErrorHandler online={navigator.onLine} /> :
          <Box sx={{ pl: 0.7, pt: 0.7 }}>
            <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}
            >
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    ID:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    #00{apprvalID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
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
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                    <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                      <div onClick={() => { openPdfInNewTab(approvalData?.results[0]?.attachment); }}>
                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                      </div>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Apply Date:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {formattedApplyDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    year:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {approvalData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
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
                      color: color
                    }}
                  >
                    {approvalData?.results[0]?.status}{" "}
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
        <Typography
          variant="h6"
          color="initial"
          sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}
        >
          Approvals :
        </Typography>

        {approvalData?.results[0]?.approvals.map(
          (data, index) =>
            data?.approving_authority?.id !== user_id && (
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
                  {data?.approving_authority?.id == user_id &&
                    data?.status == "In Process" && (
                      <>
                        <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, justifyContent: "end", alignItems: "center", }}>
                          <Btn type="save" onClick={handleSave} />
                        </Box>

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
                            <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                              Points Earned
                            </Grid>
                          </Grid>
                          {generateInputFields()}
                        </Box>
                        <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                          <Grid item xs={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                            <SimpleDropDown name="over_All_grading" label="Overall Grading" isShowIcon={true} value={formData.over_All_grading} options={Grading_options} mandatory sx={{ marginRight: 2 }} onChange={(event) => handleDropDownChange(event, "over_All_grading")} />
                          </Grid>
                        </Grid>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 2, gap: 2, }}>
                          <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2, }} onClick={() => handleButtonClick("Approved", data)}>
                            Submit
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
