import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, TextField, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme, } from '@mui/material';
import Cookies from 'js-cookie';
import React, { Fragment, useEffect, useState } from 'react';
import { Outlined_eye } from '../../../../../Assets/Icons/index.jsx';
import { useCoroAllRatingQuery } from "../../../../../Features/API/AnnualAssessment.js";
import { Link } from 'react-router-dom';
import { Btn } from '../../../../../Components/index.js';
import { FaCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import useDateFormat from '../../../../../hooks/useDateFormat.js';


const CenterDialog = ({ DialogData }) => {
  const [user_id, set_user_id] = useState(null);
  const formatDate = useDateFormat();
  const theme = useTheme();
  const [inputData, setInputData] = useState([]);
  const { data: RatingData, isLoading: RatingLoading, isError: RatingisError, error: RatingError, refetch: RatingRefectch, } = useCoroAllRatingQuery(DialogData?.results[0]?.id);
  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
    RatingRefectch();
  }, [user_id, RatingRefectch]);

  //Function

  const formattedDate = DialogData?.results[0]?.aar_apply_Date
    ? new Date(DialogData?.results[0]?.aar_apply_Date).toISOString().split('T')[0]
    : '';

  const formattedApplyDate = formatDate(DialogData?.results[0]?.aar_apply_Date)



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
      case "Completed":
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
    <div>
      <Box sx={{ p: 1 }}>
        {DialogData?.results[0]?.status === "Completed" && (
          <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mb: 2, pr: 1 }}>
            <Link to={`/AnnualAssessment/center/${DialogData?.results?.[0]?.id}`}>
              <Btn type="Generate Report" />
            </Link>
          </Box>
        )}
        <Grid container spacing={0} sx={{ border: "1px solid #E4E4E4", m: -0.7 }}>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                ID:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                #00{DialogData?.results?.[0]?.id}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                Employee Name:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.results[0]?.employee?.first_name + " " + DialogData?.results[0]?.employee?.last_name}
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
                  <div onClick={() => { openPdfInNewTab(DialogData?.results?.[0]?.attachments); }}>
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
                Year:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                Status:
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
          <Typography variant="h6" color="initial" sx={{ mt: 2 }}>Status:</Typography>
          {DialogData?.results?.[0]?.approvals.map((data, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Box sx={{ width: "70%", display: "flex", alignItems: "center", gap: 2, }}>
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
                {data?.designation == "REPORTING OFFICER" && data?.status == "Approved" && (
                  <>
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
                    <Fragment>
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
                            Earned Point
                          </Grid>
                        </Grid>
                        {generateInputFields()}
                      </Box>
                    </Fragment>
                  </>
                )}
                {data?.designation == "COUNTERSIGNING OFFICER" && data?.status == "Approved" && (
                  <>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Honest:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.honest ? "green" : 'red' }}>
                            {data?.honest ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Pen Picture:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial">
                            {data?.pen_picture_countersigning_officer}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Reported as Corrupt:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.reported_as_corrupt ? "green" : 'red' }}>
                            {data?.reported_as_corrupt ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Service Level:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
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
                            Useful:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.useful ? "green" : 'red' }}>
                            {data?.useful ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}

                {data?.designation == "COUNTERSIGNING OFFICER" && data?.status == "Refer to Competent Authority" && (
                  <>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Honest:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.honest ? "green" : 'red' }}>
                            {data?.honest ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Pen Picture:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial">
                            {data?.pen_picture_countersigning_officer}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Reported as Corrupt:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.reported_as_corrupt ? "green" : 'red' }}>
                            {data?.reported_as_corrupt ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Service Level:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial">
                            {data?.service_level}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            useful:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" style={{ whiteSpace: "pre-wrap", color: data?.useful ? "green" : 'red' }}>
                            {data?.useful ? <FaCheck /> : <RxCross2 />}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}

                {
                  data?.designation === "COMPETENT AUTHORITY" && data?.status == "Approved" && (
                    <Grid container spacing={0}>
                      <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                            Compentent Authority  Remarks:
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                          <Typography variant="subtitle1" color="initial">
                            {data?.compentent_authority_remarks}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )
                }
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default CenterDialog;
