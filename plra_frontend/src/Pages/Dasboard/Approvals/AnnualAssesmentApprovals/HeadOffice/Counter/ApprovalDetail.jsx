import { useTheme } from "@emotion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlined_eye, Warning } from "../../../../../../Assets/Icons/index.jsx";
import { ErrorHandler, Loader, SimpleDropDown, TextArea } from "../../../../../../Components/index.js";
import { useAllRatingTypeQuery, useCcoApprovalByIDQuery, useHocApprovalsPutMutation } from "../../../../../../Features/API/AnnualAssessment";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { showToast } from "../../../../../../Components/shared/Toast_Card.jsx";
import useDateFormat from "../../../../../../hooks/useDateFormat.js";

const ApprovalDetail = () => {
  const [Grade, setGrade] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();
  const { id, apprvalID } = useParams();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [dataOject, setDataObject] = useState({});
  const [actionPerformed, setActionPerformed] = useState("");
  const [reason, setReason] = useState("");
  const [user_id, set_user_id] = useState(null);
  const [Data, setData] = useState({ aar_process: apprvalID, status: "", frequency_of_work: "", know_the_officer: "", recommendation_for_retention: "", quality_of_assessment: "", over_All_grading: "" });
  const formatDate = useDateFormat();


  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  const { data: approvalData, isLoading: approvalLoading, isError: approvalisError, error: approvalError, refetch, } = useCcoApprovalByIDQuery(apprvalID);
  const { data: RatingType, isLoading: RatingTypeLoading, isError: RatingTypeisError, error: RatingTypeError, refetch: RatingTypeRefectch, } = useAllRatingTypeQuery();
  console.log(approvalData);
  const [horApprovalsPut] = useHocApprovalsPutMutation();

  useEffect(() => { refetch(); RatingTypeRefectch() }, [actionPerformed, refetch, RatingTypeRefectch]);

  //Function
  const formattedDate = approvalData?.results[0]?.aar_apply_Date
    ? new Date(approvalData?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(approvalData?.results[0]?.aar_apply_Date)


  const Grading_options = RatingType?.results?.map(item => ({
    value: item?.id,
    label: item?.percentile_range
  }));

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
    console.log(action);
    setActionPerformed(action);
    setReasonDialogOpen(true);
  };

  const handleDropDownChange = (event, field) => {
    setData((prevData) => ({ ...prevData, [field]: event.target.value, }));
  };

  const handleTextAreaChange = (event, field) => {
    setData((prevData) => ({ ...prevData, [field]: event.target.value, }));
  };

  const handleSubmit = async () => {
    console.log("Form Data on Submit:", Data);
    setReasonDialogOpen(false);
    console.log(actionPerformed);
    if (Data.frequency_of_work === "" || Data.quality_of_assessment === "" || Data.over_All_grading === "") {
      toast.error(`Please fill all fields`, { position: "top-center", autoClose: 3000, });
      return;
    }
    const formData = {
      aar_process: apprvalID,
      status: actionPerformed,
      frequency_of_work: Data.frequency_of_work,
      know_the_officer: Data.know_the_officer,
      recommendation_for_retention: Data.recommendation_for_retention,
      quality_of_assessment: Data.quality_of_assessment,
      over_All_grading: Data.over_All_grading
    };

    console.log(Data);
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
        setTimeout(() => { navigate("/approval/annualassesment/headoffice/counter"); }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
    }
    setReasonDialogOpen(false);
  };

  const options = [
    { value: "very frequently", label: "Very Frequently", },
    { value: "frequently", label: "Frequently", },
    { value: "rarely", label: "Rarely", },
    { value: "never", label: "Never", },
  ];

  const qualityofassessment = [
    { value: "exaggerated", label: "Exaggerated", },
    { value: "fair", label: "Fair", },
    { value: "biased", label: "Biased", },
  ];

  return (
    <Box>
      {approvalLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", }}>
        <Loader />
      </Box>
        : approvalisError ? <ErrorHandler online={navigator.onLine} /> :
          <Box sx={{ pl: 0.7, pt: 0.7 }}>
            <Grid container spacing={0} sx={{ width: "100%", border: "1px solid #E4E4E4" }}>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    ID:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    #00{apprvalID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Apply Date:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {formattedApplyDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Year:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {approvalData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
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
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
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
                {data?.designation === "REPORTING OFFICER" &&
                  data?.status === "Approved" && (
                    <>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Officer Performance:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.officer_performance}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Pen Picture Reporting Officer:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.pen_picture_reporting_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Area & Level of Expertise:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.area_and_level_of_expertise}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Fitness for Retention:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.fitness_for_retention}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Training & Development Need:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.training_and_development_need ? "green" : 'red' }}>
                              {data?.training_and_development_need ? <FaCheck /> : <RxCross2 />}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Overall Grading:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.overall_grading}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box>
                        <Grid container spacing={0} sx={{ borderTop: "1px solid black", borderRight: "1px solid black", borderLeft: "1px solid black", mt: 2, }}>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}>
                            No
                          </Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}></Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>A</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>B</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>C</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>D</Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}></Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", }}>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, }}>
                            1
                          </Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "left", p: 1, }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Quality of work
                            </Typography>
                            <Typography sx={{}}>
                              Always produce work of exceptionally high
                              Quality
                            </Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.quality_of_work === "A"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.quality_of_work === "B"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.quality_of_work === "C"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.quality_of_work === "D"} />
                            </Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, }}>
                            <Typography sx={{}}>
                              Generally produces work of poor quality.
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", }}>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", textAlign: "left", p: 1, }}>
                            2
                          </Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "left", p: 1, }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Output of work
                            </Typography>
                            <Typography sx={{}}>
                              Always up-to-date; accumulates no Arrears
                            </Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.output_of_work === "A"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.output_of_work === "B"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.output_of_work === "C"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.output_of_work === "D"} />
                            </Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", textAlign: "left", p: 1, }}>
                            <Typography sx={{}}>
                              Always behind schedules very slow disposal.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ mt: 6 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          2. Integrity (Morality, uprightness and honesty)
                        </Typography>
                        <Grid container spacing={0} sx={{ borderTop: "1px solid black", borderRight: "1px solid black", borderLeft: "1px solid black", mt: 2, }}>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}>
                            No
                          </Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}></Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>A</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>B</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>C</Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", textAlign: "center", p: 1, fontWeight: 600, }}>
                            <Box>D</Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}></Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", }}>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1, borderLeft: "1px solid black", borderRight: "1px solid black", borderTop: "1px solid black", }}>
                            1
                          </Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "left", p: 1, }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Integrity
                            </Typography>
                            <Typography sx={{ fontWeight: "bold" }}>
                              a. General
                            </Typography>
                            <Typography sx={{}}>Irreprochable</Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_general === "A"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_general === "B"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_general === "C"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_general === "D"} />
                            </Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", display: "flex", justifyContent: "center", alignItems: "center", p: 1, }}>
                            <Typography sx={{ textAlign: "center" }}>
                              Unscrupulous.
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", }}>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "left", p: 1, borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", }}></Grid>
                          <Grid item xs={5} sx={{ border: "1px solid black", textAlign: "left", p: 1, }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              b. Intellectual
                            </Typography>
                            <Typography sx={{}}>
                              Honest & straightforwrward
                            </Typography>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_intellectual === "A"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_intellectual === "B"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_intellectual === "C"} />
                            </Box>
                          </Grid>
                          <Grid item xs={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid black", p: 1, fontWeight: 600, }}>
                            <Box>
                              <input type="checkbox" checked={data?.integrity_intellectual === "D"} />
                            </Box>
                          </Grid>
                          <Grid item xs={2} sx={{ border: "1px solid black", textAlign: "center", p: 1, }}>
                            <Typography sx={{}}>
                              Devious; Sycophant
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  )}
                {data?.approving_authority?.id == user_id && data?.status === "In Process" && data?.designation == "COUNTERSIGNING OFFICER" && (
                  <div>
                    <Grid container spacing={0} sx={{ width: "100%", mt: 4 }}>
                      <Grid item xs={6} sx={{ p: 1, mt: 1 }}>
                        <SimpleDropDown labelWidth={"260px"} name="quality_of_assessment" label="Quality of Assessment" isShowIcon={true} value={Data.quality_of_assessment} options={qualityofassessment} sx={{ ml: 1 }} mandatory onChange={(event) => handleDropDownChange(event, "quality_of_assessment")} />
                      </Grid>
                      <Grid item xs={6} sx={{ p: 1, mt: 1 }}>
                        <SimpleDropDown labelWidth={"280px"} name="frequency_of_work" label="Frequency of Work" isShowIcon={true} value={Data.frequency_of_work} options={options} mandatory sx={{ ml: 1 }} onChange={(event) => handleDropDownChange(event, "frequency_of_work")} />
                      </Grid>
                      <Grid item xs={6} sx={{ p: 1, mt: 1 }}>
                        <SimpleDropDown labelWidth={"260px"} name="overall_grading" label="Overall Grading" isShowIcon={true} value={Data.over_All_grading} options={Grading_options} mandatory sx={{ ml: 1 }} onChange={(event) => handleDropDownChange(event, "over_All_grading")} />
                      </Grid>
                      <Grid item xs={12} sx={{ p: 1, mt: 1 }}>
                        <TextArea Rows={5} label="Know the Officer" name="know_the_officer" value={Data.know_the_officer} onChange={(event) => handleTextAreaChange(event, "know_the_officer")} />
                      </Grid>
                      <Grid item xs={12} sx={{ p: 1, mt: 1 }}>
                        <TextArea Rows={5} label="Recommendation for Retention" name="recommendation_for_retention" value={Data.recommendation_for_retention} onChange={(event) => handleTextAreaChange(event, "recommendation_for_retention")} />
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
