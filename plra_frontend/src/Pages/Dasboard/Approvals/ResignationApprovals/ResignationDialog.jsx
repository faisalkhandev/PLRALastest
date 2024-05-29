import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme, } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlined_eye } from "../../../../Assets/Icons/index.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Btn } from "../../../../Components/index.js";
import Cookies from "js-cookie";

const ResignationDialog = ({ DialogData }) => {
  const theme = useTheme();
  const [user_id, set_user_id] = useState(null)
  console.log("Dialog Data History Tab" , DialogData );
  console.log("Dialog Data History Tab" , DialogData?.approvals[0]?.approving_authority_designation );

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  console.log(DialogData);

  
  // function
  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };
  
  const getStatusStyle = (status, theme) => {
    let backgroundColor, color;

    switch (status) {
      case "Approved":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Proved":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Closed":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Refer to Competent Authority":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Refer to DG":
        backgroundColor = theme.palette.primary[200];
        color = theme.palette.primary.main;
        break;
      case "Refer to Director HR":
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
        case "Unapproved":
        backgroundColor = theme.palette.error[300];
        color = theme.palette.error[600];
        break;
      default:
        backgroundColor = "black";
        color = "black";
    }

    return { backgroundColor, color };
  };
  const status = DialogData?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  return (
    <div>
      {DialogData?.status === "Approved" && DialogData?.approvals[1]?.approving_authority_designation === "HR DIRECTOR" && ( 
      <Link to={`/resignationreport/${DialogData.id}`} style={{ float: 'right', marginBottom: '10px' }}> 
        <Btn type="Generate Report" />
      </Link>
    )}

      <Box sx={{ p: 1 }}>
        <Grid
          container
          spacing={0}
          sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
        >
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                Resignation ID:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData.id}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width
                : "100px" }}>
                Name:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData.employee.first_name} {DialogData.employee.last_name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                Attachment:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: "pointer", }}>
                  <div onClick={() => { openPdfInNewTab(DialogData?.attachment); }}>
                    <Outlined_eye color={`${theme.palette.success[600]}`} />
                  </div>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "95px" }}>
                Date:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.case_initiation_date}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                Notice Period:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.notice_period} Months
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "105px" }}>
                Status:
              </Typography>
              <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                {DialogData?.status}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px", pt: 1 }}>
                Reason:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.resignation_reason}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2 }}>
            Approvals Status:
          </Typography>
          {DialogData?.approvals.map((data, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2, }}>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      {data?.approving_authority_designation}
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      |
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(data?.status, theme).backgroundColor, color: getStatusStyle(data?.status, theme).color, }}>
                      {data?.status}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                    Approval Date: {data?.status_date}
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
                {data?.approving_authority_designation === "HR DIRECTOR" && (
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
                          {data?.resignation_effective_date}{" "}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
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
                        {data?.comments}{" "}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ResignationDialog;