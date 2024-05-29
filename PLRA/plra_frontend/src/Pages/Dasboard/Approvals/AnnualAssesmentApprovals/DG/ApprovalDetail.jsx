import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import { useApprovalsannualassessmentPutMutation, useCcoApprovalByIDQuery } from '../../../../../Features/API/AnnualAssessment';
import { useApprovalsByIdQuery } from '../../../../../Features/API/SetupApi';
import { ErrorHandler, Loader } from '../../../../../Components';
import { Outlined_eye, Warning } from '../../../../../Assets/Icons';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { showToast } from '../../../../../Components/shared/Toast_Card';
import useDateFormat from '../../../../../hooks/useDateFormat';


const ApprovalDetail = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id, apprvalID } = useParams();
  const formatDate = useDateFormat();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [dataOject, setDataObject] = useState({})
  const [actionPerformed, setActionPerformed] = useState("");
  const [reason, setReason] = useState("");
  const [user_id, set_user_id] = useState(null)
  const currentURL = window.location.href;
  const urlParts = currentURL.split('/');
  const id_aar = urlParts[urlParts.length - 1];

  useEffect(() => {
    const id = Cookies.get('user_id');
    set_user_id(id)
  }, [user_id])


  const { data: DG_Data, isLoading: DG_Loading, isError: DG_RefreshError, error: DG_QueryError, refetch } = useCcoApprovalByIDQuery(apprvalID);
  console.log(DG_Data)
  const [ApprovalsPut] = useApprovalsannualassessmentPutMutation();

  //Function
  const formattedDate = DG_Data?.results[0]?.aar_apply_Date
    ? new Date(DG_Data?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(DG_Data?.results[0]?.aar_apply_Date)


  const openPdfInNewTab = (path) => {
    if (!path) {
      toast.error("No Attachment", {
        position: "top-center",
        autoClose: 3000,
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
  const status = DG_Data?.results[0]?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  const handleSubmit = async () => {
    const formData = {
      compentent_authority_remarks: reason,
      status: actionPerformed,
      aar_process: dataOject?.aar_process?.id,
      competent_authority: dataOject?.competent_authority,
      aar_process: apprvalID,
      // status: dataOject?.status,
      approving_authority: dataOject?.approving_authority?.id,
    }
    try {
      const res = await ApprovalsPut({ formData, id });
      if (res?.data?.id) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        toast.success("Updated Successfully", { position: "top-center", autoClose: 1000, });
        setTimeout(() => { navigate("/approval/annualassesment/center/competentauthority"); }, 3000);
      }
    } catch (error) {
      toast.error(`Error submitting form: ${error}`, { position: "top-center", autoClose: 3000, });
    }
    setReasonDialogOpen(false)
  }

  const headers = [
    { label: "id", size: 2 },
    { label: "Category", size: 3 },
    { label: "Max Points", size: 3 },
    { label: "Point Earned", size: 4 },
  ];

  return (
    <Box sx={{}}>
      {DG_Loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Loader />
        </Box>
      ) : DG_RefreshError ? (
        <ErrorHandler online={navigator.onLine} />
      ) : (
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
                  {DG_Data?.results[0]?.employee?.first_name + " " + DG_Data?.results[0]?.employee?.last_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Attachment:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: "pointer", }}>
                    <div onClick={() => { openPdfInNewTab(DG_Data?.results[0]?.attachments); }}>
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
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  year:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DG_Data?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
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
                  {DG_Data?.results[0]?.status}{" "}
                </Typography>
              </Box>
            </Grid>
            {DG_Data?.results[0]?.is_head_office === true && (
              <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                    Job Description:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {DG_Data?.results[0]?.job_description}
                  </Typography>
                </Box>
              </Grid>
            )}
            {DG_Data?.results[0]?.is_head_office === true && (
              <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                  <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                    Brief Achievements:
                  </Typography>
                  <Typography variant="subtitle1" color="initial">
                    {DG_Data?.results[0]?.brief_achievements}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Notes:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DG_Data?.results[0]?.notes}{" "}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      <Box sx={{ m: 0.7 }}>
        <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 1, fontWeight: 600, pl: 0.6 }}>Approvals :</Typography>
        {DG_Data?.results[0]?.is_head_office === true && DG_Data?.results[0]?.approvals.map(
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
                {data?.designation === "REPORTING OFFICER" && data?.status === "Approved" && (
                  <>
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
                            Officer Performance:
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
                            {data?.officer_performance}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                            Pen Picture Reporting Officer:
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
                            {data?.pen_picture_reporting_officer}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                            Area & Level of Expertise:
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
                            {data?.area_and_level_of_expertise}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                            Fitness for Retention:
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
                            {data?.fitness_for_retention}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                            Training & Development Need:
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
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.training_and_development_need ? "green" : 'red' }}>
                            {data?.training_and_development_need ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
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
                            Overall Grading:
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
                            {data?.overall_grading}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box>
                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderTop: "1px solid black",
                          borderRight: "1px solid black",
                          borderLeft: "1px solid black",
                          mt: 2,
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        >
                          No#
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        ></Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>A</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>B</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>C</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>D</Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        ></Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                          }}
                        >
                          1
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            Quality of work
                          </Typography>
                          <Typography sx={{}}>
                            Always produce work of exceptionally high
                            Quality
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.quality_of_work === "A"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.quality_of_work === "B"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.quality_of_work === "C"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.quality_of_work === "D"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                          }}
                        >
                          <Typography sx={{}}>
                            Generally produces work of poor quality.
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          2
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            Output of work
                          </Typography>
                          <Typography sx={{}}>
                            Always up-to-date; accumulates no Arrears
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.output_of_work === "A"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.output_of_work === "B"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.output_of_work === "C"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.output_of_work === "D"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          <Typography sx={{}}>
                            Always behind schedules very slow disposal.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 6 }}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        {" "}
                        2. Integrity (Morality, uprightness and honesty)
                      </Typography>
                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderTop: "1px solid black",
                          borderRight: "1px solid black",
                          borderLeft: "1px solid black",
                          mt: 2,
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        >
                          No#
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        ></Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>A</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>B</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>C</Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>D</Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        ></Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            borderTop: "1px solid black",
                          }}
                        >
                          1
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            Integrity
                          </Typography>
                          <Typography sx={{ fontWeight: "bold" }}>
                            a. General
                          </Typography>
                          <Typography sx={{}}>Irreprochable</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.integrity_general === "A"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.integrity_general === "B"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.integrity_general === "C"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={data?.integrity_general === "D"}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 1,
                          }}
                        >
                          <Typography sx={{ textAlign: "center" }}>
                            Unscrupulous.
                          </Typography>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={0}
                        sx={{
                          borderLeft: "1px solid black",
                          borderRight: "1px solid black",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "left",
                            p: 1,
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            borderBottom: "1px solid black",
                          }}
                        ></Grid>
                        <Grid
                          item
                          xs={5}
                          sx={{
                            border: "1px solid black",
                            textAlign: "left",
                            p: 1,
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            b. Intellectual
                          </Typography>
                          <Typography sx={{}}>
                            Honest & straightforwrward
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={
                                data?.integrity_intellectual === "A"
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={
                                data?.integrity_intellectual === "B"
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={
                                data?.integrity_intellectual === "C"
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            p: 1,
                            fontWeight: 600,
                          }}
                        >
                          <Box>
                            <input
                              type="checkbox"
                              checked={
                                data?.integrity_intellectual === "D"
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            border: "1px solid black",
                            textAlign: "center",
                            p: 1,
                          }}
                        >
                          <Typography sx={{}}>
                            Devious; Sycophant
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
                {data?.designation === "COUNTERSIGNING OFFICER" &&
                  data?.status === "Approved" && (
                    <>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Frequency of Work:
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
                              {data?.frequency_of_work}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Over All Grading
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
                              {data?.over_All_grading?.percentile_range}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Know the Officer:
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
                              {data?.know_the_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Know the Officer:
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
                              {data?.know_the_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Recommendation:
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
                              {data?.recommendation_for_retention}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                {data?.designation === "COUNTERSIGNING OFFICER" &&
                  data?.status === "Refer to Competent Authority" && (
                    <>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Frequency of Work:
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
                              {data?.frequency_of_work}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Over All Grading
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
                              {data?.over_All_grading?.percentile_range}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Know the Officer:
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
                              {data?.know_the_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Know the Officer:
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
                              {data?.know_the_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
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
                              Recommendation:
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
                              {data?.recommendation_for_retention}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}

                {data?.approving_authority?.id == user_id && data?.designation === "COMPETENT AUTHORITY" && (
                  <>
                    <Box sx={{ display: "flex", alignItems: 'start', p: 1, mt: 3 }}>
                      <Typography variant="body2" color="initial" sx={{ width: '100px' }}>Notes: </Typography>
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
                        placeholder="Write a note..."
                      />
                    </Box>
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                      <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                        onClick={() => handleButtonClick("Approved", data)}>Submit</Button>
                    </Box>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          )
        )}
        {/* For False */}
        {DG_Data?.results[0]?.is_head_office === false && DG_Data?.results[0]?.approvals.map(
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
                {data?.designation === "REPORTING OFFICER" &&
                  data?.status === "Approved" && (
                    <>
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
                              {data?.over_All_grading?.percentile_range}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* Points */}
                      <>
                        {/* Render Headers */}
                        <Grid container spacing={0}>
                          {headers.map((header, index) => (
                            <Grid item xs={header.size} key={index} style={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", padding: 0.6, fontWeight: 600, backgroundColor: theme.palette.primary.main, color: '#fff ' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{header.label}</Typography>
                            </Grid>
                          ))}
                        </Grid>
                        {/* Map Data */}
                        {DG_Data?.results[0]?.points?.map((item, index) => (
                          <Grid container spacing={0} key={index}>
                            <Grid item xs={2} style={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", padding: 0.6 }}>
                              {item.id}
                            </Grid>
                            <Grid item xs={3} style={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", padding: 0.6 }}>
                              {item.category}
                            </Grid>
                            <Grid item xs={3} style={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", padding: 0.6 }}>
                              {item.max_points}
                            </Grid>
                            <Grid item xs={4} style={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", padding: 0.6 }}>
                              {item.point_earned !== null ? item.point_earned : 'N/A'}
                            </Grid>
                            {/* Additional columns as needed */}
                          </Grid>
                        ))}
                      </>
                    </>
                  )}
                {data?.designation === "COUNTERSIGNING OFFICER" &&
                  data?.status === "Approved" && (
                    <>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Reported As Corrupt:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.reported_as_corrupt ? "True" : "False"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Usefull:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.useful ? "True" : "False"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Service Level:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.service_level}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Pen Picture Countersigning Officer:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.pen_picture_countersigning_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                {data?.designation === "COUNTERSIGNING OFFICER" &&
                  data?.status === "Refer to Competent Authority" && (
                    <>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Reported As Corrupt:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.reported_as_corrupt ? "True" : "False"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Usefull:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.useful ? "True" : "False"}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Service Level:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.service_level}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container spacing={0}>
                        <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                              Pen Picture Countersigning Officer:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                            <Typography variant="subtitle1" color="initial">
                              {data?.pen_picture_countersigning_officer}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                {data?.approving_authority?.id == user_id && data?.designation === "COMPETENT AUTHORITY" && (
                  <>
                    <Box sx={{ display: "flex", alignItems: 'start', p: 1, mt: 3 }}>
                      <Typography variant="body2" color="initial" sx={{ width: '100px' }}>Notes: </Typography>
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
                        placeholder="Write a note"
                      />
                    </Box>
                    <Box sx={{ width: "100%", display: 'flex', justifyContent: 'end', mt: 2, gap: 2 }}>
                      <Button sx={{ backgroundColor: theme.palette.success[300], color: theme.palette.success[600], borderRadius: "4px", fontSize: "14px", fontWeight: 500, p: 2 }}
                        onClick={() => handleButtonClick("Approved", data)}>Approve</Button>
                    </Box>
                  </>
                )}
              </AccordionDetails>
            </Accordion >
          )
        )}
      </Box >

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
    </Box >
  )
}

export default ApprovalDetail
