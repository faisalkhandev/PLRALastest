import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Accordion,AccordionDetails,AccordionSummary,Box,Grid,Typography,useTheme,} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Outlined_eye } from "../../../../Assets/Icons";
import { useCcoApprovalByIDQuery } from "../../../../Features/API/AnnualAssessment";
const HeadOfficeDialog = ({ apprvalID }) => {
  const [user_id, set_user_id] = useState(null);
  const { data: DialogData } = useCcoApprovalByIDQuery(apprvalID);

  const theme = useTheme();
  useEffect(() => {
    const id = Cookies.get("user_id");
      set_user_id(id);
  }, [user_id]);

  //function

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
  const status = DialogData?.results[0]?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };

  return (
    <div>
      <Box sx={{ p: 1 }}>
      <Grid container spacing={0} sx={{ border: "1px solid #E4E4E4", m: -0.7 }}>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                ID:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                #00{DialogData?.results?.[0]?.id}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                Job Description:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.results?.[0]?.job_description}
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
                  <div onClick={() => { openPdfInNewTab(DialogData?.results?.[0]?.attachments); }}>
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
                {DialogData?.results[0]?.aar_apply_Date}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                Year:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                status:
              </Typography>
              <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                {DialogData?.results[0]?.status}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                Notes:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.results[0]?.notes}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6" color="initial" sx={{ mt: 2 }}>
            Approvals:
          </Typography>
          {DialogData?.results[0]?.approvals.map(
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
                  <Grid item xs={3} sx={{border: "1px solid #E4E4E4",p: 1,borderBottom: "none",}}>
                    <Box sx={{display: "flex",alignItems: "center",justifyContent: "start",}}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                        Officer Name:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{border: "1px solid #E4E4E4",p: 1,borderBottom: "none",}}>
                    <Box sx={{display: "flex",alignItems: "center",justifyContent: "start",}}>
                      <Typography variant="subtitle1" color="initial">
                        {data?.approving_authority?.first_name +" " +data?.approving_authority?.last_name}
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
                                  officer performance:
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
                                  pen picture reporting officer:
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
                                  area & level of expertise:
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
                                  fitness for retention:
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
                                  training & development need:
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
                                  {data?.training_and_development_need}
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
                                  overall grading:
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
                    {data?.designation === "COUNTER-SIGNING-OFFICER" &&
                      data?.status === "Approved" || data?.status === "Refer to Competent Authority" && (
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
                                  frequency of work:
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
                                  know the officer:
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
                                  recommendation:
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
                  </AccordionDetails>
                </Accordion>
              )
          )}
        </Box>
      </Box>
    </div>
  );
};

export default HeadOfficeDialog;
