import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme, } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Outlined_eye } from "../../../../Assets/Icons/index.jsx";
import { approvalcellStyle } from "../../../../Utils/cellstyle.js";
import useDateFormat from "../../../../hooks/useDateFormat.js";

const DisciplinaryProcedingDialog = ({ DialogData }) => {
  const theme = useTheme();
  const [user_id, set_user_id] = useState(null);
  const formatDate = useDateFormat();

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  const status = DialogData?.inquiry_status;
  const { backgroundColor, color } = approvalcellStyle(status, theme);

  //function
  const formattedDate = DialogData?.inquiry_start_date
    ? new Date(DialogData?.inquiry_start_date).toISOString().split('T')[0]
    : '';

  const formattedInitiateDate = formatDate(DialogData?.inquiry_start_date)

  // function
  const openPdfInNewTab = (path) => {
    if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
    else window.open(path, "_blank");
  };

  return (
    <div>
      <Box sx={{ p: 1 }}>
        <Grid
          container
          spacing={0}
          sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
        >
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "10px" }}>
                ID:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                #00{DialogData?.id}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "105px" }}>
                Name:
              </Typography>
              <Typography variant="subtitle1" color="initial" >
                {DialogData?.employee.first_name}{" "}{DialogData?.employee.last_name}
              </Typography>
            </Box>
          </Grid>
          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name ?
            <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                  Inquiry Type:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                </Typography>
              </Box>
            </Grid> : <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                  Inquiry Type:
                </Typography>
                <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                  {DialogData?.inquiry_status}
                </Typography>
              </Box>
            </Grid>}
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "180px" }}>
                Inquiry Reason:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {DialogData?.inquiry_reason}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "160px" }}>
                Inquiry Start Date:
              </Typography>
              <Typography variant="subtitle1" color="initial">
                {formattedInitiateDate}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "130px" }}>
                Status:
              </Typography>
              <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                {DialogData?.inquiry_status}
              </Typography>
            </Box>
          </Grid>
          {DialogData?.remarks_for_other_inquiry_reason && (
            <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "300px" }}>
                  Remarks For Other Inquiry Reason:
                </Typography>
                <Typography variant="subtitle1" color="initial">
                  {DialogData?.remarks_for_other_inquiry_reason}
                </Typography>
              </Box>
            </Grid>
          )}
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
                      {data?.designation}
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      |
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: approvalcellStyle(data?.probe_allegation_status ? data?.probe_allegation_status : data?.status, theme).backgroundColor, color: approvalcellStyle(data?.probe_allegation_status ? data?.probe_allegation_status : data?.status, theme).color, }}>
                      {data?.probe_allegation_status ? data?.probe_allegation_status : data?.status}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                    Approval Date: {data?.status_date}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>

                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1}}  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}   >
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}  >
                        Officer Name:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1 }} >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}  >
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        {data?.approving_authority?.first_name +
                          " " +
                          data?.approving_authority?.last_name}{" "}
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
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Attachment:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], mr: 2, cursor: "pointer", }}>
                          <div onClick={() => { openPdfInNewTab(data?.attachment_of_personal_hearing_notice); }}>
                            <Outlined_eye color={`${theme.palette.success[600]}`} />
                          </div>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Personal Hearing Notice Date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.issuance_of_personal_hearing_notice_date}
                        </Typography>
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
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Attachment of Inquiry Report:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, }}>
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

                {data?.designation === "DIRECTOR HR" && data?.attachment_of_final_order  && (
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
                    <Grid container spacing={0}>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Outcome:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                   
                  </Grid> 
                   
                  </Grid>
                )}

                {data?.designation === "DIRECTOR HR" && data?.amount && (
                  <Grid container spacing={0}>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Outcome:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Amount:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.amount}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {data?.designation === "DIRECTOR HR" && data?.start_date && data?.end_date && (
                  <Grid container spacing={0}>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Outcome:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Start Date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.start_date}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          End Date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.end_date}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {data?.designation === "DIRECTOR HR" && data?.amount && (
                  <Grid container spacing={0}>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Outcome:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Amount:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.amount}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {data?.designation === "DG"&& data?.probe_allegation_status!="Pending" && (
                  <Grid container spacing={0}>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Outcome:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.inquiryoutcomes?.inquiry_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                   
                  </Grid>
                )}
                {data?.designation === "DG" && data?.start_date && data?.end_date &&(
                  <Grid container spacing={0}>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Start Date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.start_date}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          End Date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.end_date}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                {data?.designation === "DG" && data?.amount && (
                  <Grid container spacing={0}>
                    <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Inquiry Type:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {DialogData?.inquiry_type?.category_name}
                        </Typography>
                      </Box>
                    </Grid>
                     <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          Amount:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px" }}>
                          {data?.amount}
                        </Typography>
                      </Box>
                      </Grid>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default DisciplinaryProcedingDialog;