import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Outlined_eye } from "../../../../Assets/Icons/index.jsx";
import { toast } from "react-toastify";

const TransferDialog = ({ DialogData }) => {
  const theme = useTheme();

  console.log(DialogData);

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
  const status = DialogData?.transfer_process?.status;
  const { backgroundColor, color } = getStatusStyle(status, theme);

  // function
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

  return (
    <div>
      <Box sx={{ p: 1 }}>
       



        <Grid
            container
            spacing={0}
            sx={{ width: "100%", border: "1px solid #E4E4E4" }}
          >
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "100px" }}
                >
                  ID:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  #00{DialogData?.id}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "50px" }}
                >
                  Name:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.employee.first_name}{" "}
                  {DialogData?.transfer_process?.employee.last_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "100px" }}
                >
                  Attachment:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      pt: 0.4,
                      borderRadius: "4px",
                      backgroundColor: theme.palette.success[300],
                      color: theme.palette.success[600],
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => {
                        openPdfInNewTab(DialogData?.transfer_process?.attachments);
                      }}
                    >
                      <Outlined_eye color={`${theme.palette.success[600]}`} />
                    </div>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "150px" }}
                >
                  Transfer Category:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_category}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer Apply date:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_apply_date}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "100px" }}
                >
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
                  {DialogData?.transfer_process?.status}{" "}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "150px" }}
                >
                  Transfer Position:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_position?.position_desc}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer Center:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_position?.location?.center_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Transfer District:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_position?.location?.district?.district_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Division:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_position?.location?.division?.division_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "160px" }}
                >
                  Tehsil:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.transfer_position?.location?.tehsil?.t_name}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "110px" }}
                >
                  Wing:
                </Typography>
                <Typography variant="subtitle1" color="initial" sx={{ width: "250px" }}>
                  {DialogData?.transfer_process?.transfer_position?.wing?.wing_name}
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  fontWeight={600}
                  sx={{ width: "100px" }}
                >
                  Remarks:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.transfer_process?.remarks}{" "}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        <Box sx={{ m: 0.7 }}>
          <Typography
            variant="h6"
            color="initial"
            sx={{ mt: 2, mb: 2, fontWeight: 600, pl: 0.6 }}
          >
            Approval:
          </Typography>

          <Accordion key={1}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${1}-content`}
              id={`panel${1}-header`}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="initial"
                    sx={{ fontWeight: 600 }}
                  >
                    {DialogData?.designation}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="initial"
                    sx={{ fontWeight: 600 }}
                  >
                    |
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(DialogData?.status, theme).backgroundColor, color: getStatusStyle(DialogData?.status, theme).color, }}>
                    {DialogData?.status}
                  </Typography>
                </Box>
                <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                  {DialogData.status==='Approved'?'Approval Date':'Rejection Date'}: {DialogData?.transfer_process?.transfer_approval_date}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                      Officer Name:
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
                      {" "}
                      {DialogData?.approving_authority?.first_name +
                        " " +
                        DialogData?.approving_authority?.last_name}{" "}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              {DialogData?.designation === "HR DIRECTOR" &&
                DialogData?.Joining_effective_date && (
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
                          {DialogData?.Joining_effective_date}{" "}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              {DialogData?.notes && (
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
                        {DialogData?.notes}{" "}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </div>
  );
};

export default TransferDialog;