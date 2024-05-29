import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Select, MenuItem, Grid } from "@mui/material";
import plraLogo from "../AnnualAssessment/PLRA.png";
import { BorderLessInput } from "../../Components";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { useCcoApprovalByIDQuery } from "../../Features/API/AnnualAssessment";


import './Style.css'
import { useGetPositionByIdQuery } from "../../Features/API/API";


const AnnualAssessment = () => {
  const [Grade, setGrade] = useState("");
  const { id } = useParams()
  const { data: AnnualApprovalListData, isLoading, refetch: refetch } = useCcoApprovalByIDQuery(id);
  console.log("dataAnnnnnn", AnnualApprovalListData?.results?.[0]);
  const positionId = AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.position;
  const { data: positiondata, positionisLoading, refetch: positionrefetch } = useGetPositionByIdQuery({ positionId });
  console.log("data", positiondata?.results?.[0]);

  const printPage = useRef();
  const handlePrint = useReactToPrint({ content: () => printPage.current });



  function handleGradeChange(event) { setGrade(event.target.value) }
  console.log(AnnualApprovalListData?.results?.[0]?.approvals[0]?.output_of_work)
  return (
    <Box
      sx={{ width: "70%", margin: "auto" }}
      className="AnnualAssessmentTable"
    >

      <div
        style={{
          margin: "14px 29px",
          padding: "50px",
        }}
        ref={printPage}
        className="print-page"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            textDecoration: "underline ",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>CONFIDENTIAL</Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            PUNJAB LAND RECORDS AUTHORITY
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <img src={"/static/Logo.png"} alt="plra logo" width="150px" height="150px" />
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ANNUAL ASSESSMENT REPORT
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            FOR THE PERIOD {AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process?.year?.hr_celander_starting_date} To {AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process?.year?.hr_celander_ending_date}{" "}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h5" fontWeight="bold">
            PART I
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            (TO BE FILLED IN BY THE OFFICER REPORTED UPON){" "}
          </Typography>
        </Box>

        {/* Inputs */}
        <Box sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}>
          <BorderLessInput
            label="1. Name(in block letters)"
            value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.first_name.toUpperCase()} ${AnnualApprovalListData?.results?.[0].approvals[0].aar_process.employee.last_name.toUpperCase()}`}
          />

          <BorderLessInput label="2. S/o, D/o.(In block letters)" value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.father_name.toUpperCase()}`} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Grid container xs={12}>
              <Grid item xs={8}>
                <BorderLessInput label="3. Designation" inputWidth={"77%"} value={positiondata?.results?.[0]?.position_desc.charAt(0).toUpperCase() + positiondata?.results?.[0]?.position_desc.slice(1)} />
              </Grid>
              <Grid item xs={4}>
                <BorderLessInput label=" CNIC No" width={"137px"} value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.cnic.charAt(0).toUpperCase()}${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.cnic.slice(1)}`} />
              </Grid>
            </Grid>
          </Box>

          <BorderLessInput label="4. Date of birth" />
          <BorderLessInput label="5. Date of joining in PLRA (PMU)" value={AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.date_of_joining.charAt(0).toUpperCase() + AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.date_of_joining.slice(1)} />
          <BorderLessInput label="6. Post held during the period (with PPG)" value={positiondata?.results?.[0]?.position_desc.charAt(0).toUpperCase() + positiondata?.results?.[0]?.position_desc.slice(1) + " " + positiondata?.results?.[0]?.job?.ppg_level?.ppg_level.charAt(0).toUpperCase() + positiondata?.results?.[0]?.job?.ppg_level?.ppg_level.slice(1)} />
          <BorderLessInput label="7. Academic qualifications" />
          <BorderLessInput label="8. Period Served" value={AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.service_duration.charAt(0).toUpperCase() + AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.service_duration.slice(1)} />
          <BorderLessInput label="(i). In present post" value={positiondata?.results?.[0]?.position_desc.charAt(0).toUpperCase() + positiondata?.results?.[0]?.position_desc.slice(1)} />
          <BorderLessInput label="(ii). Under the reporting Officer" value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.first_name.charAt(0).toUpperCase()}${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.first_name.slice(1)} ${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.last_name.charAt(0).toUpperCase()}${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.last_name.slice(1)}`} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "65px" }} className="print-page">
          <Typography variant="h5" fontWeight="bold">PART II</Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }} >
            (TO BE FILLED IN BY THE OFFICER REPORTED UPON){" "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            1. Job Description
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",

          }}
          value={AnnualApprovalListData?.results?.[0].job_description}
        />

        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            2. Brief account of achievements during the period supported by
            statistical data where p and actual performance against such targets
            should be highlighted. Reasons for any, may also be stated.
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].brief_achievements}
        />

        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
          className="print-page"
        >
          <Typography variant="h5" fontWeight="bold">PART III</Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            (EVALUATION BY THE REPORTING OFFICER)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            1. Please comment on the office/s performance on the job as given in
            Part ll (2) with special reference to his knowledge of work, ability
            to plan, organize and supervise, analytical skills, competence to
            take decisions and quality and quantity of output. How far was the
            officer able to achieve the targets? Part ll (2)?
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
            resize: "none"
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.officer_performance}
        />

        <Box>
          <Grid container spacing={0} sx={{
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            borderLeft: '1px solid black', mt: 2
          }}>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}>No.</Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>A</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>B</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>C</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>D</Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}></Grid>
          </Grid>

          <Grid container spacing={0} sx={{
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
          }}>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>1</Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'left', p: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>Quality of work</Typography>
              <Typography sx={{}}>Always produce work of exceptionally high Quality</Typography>
            </Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.quality_of_work === 'A'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.quality_of_work === 'B'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.quality_of_work === 'C'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.quality_of_work === 'D'} /></Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
              <Typography sx={{}}>Generally produces work of poor quality.</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0} sx={{
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
          }}>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', textAlign: 'left', p: 1 }} >2</Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'left', p: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>Output of work</Typography>
              <Typography sx={{}}>Always up-to-date; accumulates no Arrears</Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.output_of_work === 'A'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.output_of_work === 'B'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.output_of_work === 'C'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.output_of_work === 'D'} /></Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', textAlign: 'left', p: 1 }}>
              <Typography sx={{}}>Always behind schedules very slow disposal.</Typography>
            </Grid>
          </Grid>
        </Box>


        <Box sx={{ mt: 6 }}>
          <Typography sx={{ fontWeight: "bold" }}> 2. Integrity (Morality, uprightness and honesty)</Typography>
          <Grid container spacing={0} sx={{
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            borderLeft: '1px solid black', mt: 2
          }}>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}>No.</Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>A</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>B</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>C</Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>D</Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}></Grid>
          </Grid>

          <Grid container spacing={0} sx={{
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
          }}>
            <Grid item xs={1} sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1,
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderTop: '1px solid black',
            }}>1</Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'left', p: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>Integrity</Typography>
              <Typography sx={{ fontWeight: "bold" }}>a. General</Typography>
              <Typography sx={{}}>Irreprochable</Typography>
            </Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_general === 'A'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_general === 'B'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_general === 'c'} /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_general === 'd'} /></Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
              <Typography sx={{ textAlign: 'center' }}>Unscrupulous.</Typography>
            </Grid>
          </Grid>

          <Grid container spacing={0} sx={{
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
          }}>
            <Grid item xs={1} sx={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'left', p: 1,
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderBottom: '1px solid black',
            }} ></Grid>
            <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'left', p: 1 }}>
              <Typography sx={{ fontWeight: "bold" }}>b. Intellectual</Typography>
              <Typography sx={{}}>Honest & straightforwrward</Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_intellectual === 'A'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_intellectual === 'B'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_intellectual === 'C'} /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" checked={AnnualApprovalListData?.results?.[0]?.approvals[0]?.integrity_intellectual === 'D'} /></Box></Grid>
            <Grid item xs={2} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}>
              <Typography sx={{}}>Devious; Sycophant</Typography>
            </Grid>
          </Grid>

        </Box>


        <Box sx={{ display: "flex", marginTop: "35px" }} className="print-page">
          <Typography sx={{ fontWeight: "bold" }}>
            3. Pen picture including the officer's strengths and weaknesses with
            focus on emotional stability, ability to work under pressure,
            communication skills and interpersonal effectiveness. (Weakness will
            not be considered as adverse entry unless intended to be treated as
            adverse)
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "0px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.pen_picture_reporting_officer}
        />

        <Box sx={{ display: "flex", marginTop: "15px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            4. Area and level of professional expertise with suggestions for
            further extension in contract
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.area_and_level_of_expertise}
        />

        <Box sx={{ display: "flex", marginTop: "15px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            5. Training and development needs.
          </Typography>
        </Box>

        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.training_and_development_need ? "Yes" : "No"}
        />
        <BorderLessInput
          label="Overall Grading"
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.overall_grading.charAt(0).toUpperCase() + AnnualApprovalListData?.results?.[0].approvals[0]?.overall_grading.slice(1)}
        />


        <Box sx={{ display: "flex", marginTop: "15px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            7. Fitness for retention/extension in contract:
          </Typography>
        </Box>
        <textarea
          rows={5}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[0]?.fitness_for_retention}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginTop: "15px",
          }}
        >
          <Box style={{ width: "90%" }}>
            <BorderLessInput
              label="Name of the reporting officer"
              width={"375px"}
              value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.first_name} ${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.last_name}`}

            />
          </Box>
          <BorderLessInput label="Signature" width={"100px"} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginTop: "15px",
          }}
        >
          <Box style={{ width: "90%" }}>
            <BorderLessInput label="Designation" width={"375px"} value={AnnualApprovalListData?.results?.[0].approvals[0]?.designation} />
          </Box>
          <BorderLessInput label="Date" width={"100px"} />
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "65px" }}
          className="print-page"
        >
          <Typography variant="h5" fontWeight="bold">
            PART IV
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            (REMARKS OF THE COUNTERSIGNING OFFICER){" "}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold", width: "500px" }}>
            1. How often have you seen the work of the officer reported upon?
          </Typography>
          <BorderLessInput
            label="" value={AnnualApprovalListData?.results?.[0].approvals[1]?.frequency_of_work}
          />
        </Box>


        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            2. How well do you know the officer? lf you disagree with the
            assessment of the reporting officer, please give reasons.
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[1]?.know_the_officer}
        />
        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            3.  Overall Grading
          </Typography>
        <BorderLessInput
          value={AnnualApprovalListData?.results?.[0].approvals[1]?.over_All_grading?.percentile_range.charAt(0).toUpperCase() + AnnualApprovalListData?.results?.[0].approvals[1]?.over_All_grading?.percentile_range.slice(1)}
        />
        </Box>


        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            4. Recommendation for retention / extension in contract:
          </Typography>
        </Box>
        <textarea
          rows={8}
          style={{
            resize: "none",
            width: "100%",
            marginTop: "15px",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "6px",
          }}
          value={AnnualApprovalListData?.results?.[0].approvals[1]?.recommendation_for_retention}
        />
        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold", width: "650px" }}>
            5. Evaluation of the quality of assessment made by the reporting officer
          </Typography>

          <BorderLessInput
            value={AnnualApprovalListData?.results?.[0].approvals[1]?.quality_of_assessment.toUpperCase()}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginTop: "35px",
          }}
        >
          <Box style={{ width: "90%" }}>
            <BorderLessInput
              label="Name of the Countersigning Officer "
              width={"500px"} value={`${AnnualApprovalListData?.results?.[0].approvals[1]?.approving_authority?.first_name} ${AnnualApprovalListData?.results?.[0].approvals[1]?.approving_authority?.last_name}`}
            />
          </Box>
          <BorderLessInput label="Signature" width={"100px"} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            marginTop: "35px",
          }}
        >
          <Box style={{ width: "90%" }}>
            <BorderLessInput label="Designation" width={"500px"} value={AnnualApprovalListData?.results?.[0].approvals[1]?.designation} />
          </Box>
          <BorderLessInput label="Date" width={"100px"} />
        </Box>

        <Box className="print-page paragraph" sx={{ mt: 6 }}>
          <Typography sx={{ fontWeight: "bold", textDecoration: "underLine" }}>GUIDELINES FOR FILLING UP THE AAR</Typography>
          <ul style={{ textAlign: 'justify' }}>
            <li>Parts I and II are to be filled by the officer under report. Part III will be filled by the Reporting Officer, while the Countersigning Officer will fill Part IV.</li>
            <li>The officer under report should fill Part II (2) of the form as objectively as possible and short term and long term targets should be determined/ assigned with utmost care. The targets for each job may be formulated at the beginning of the year wherever possible. In other cases, the work performed during the year needs to be specifically mentioned.</li>
            <li>Assessment by the Reporting Officers should be job-specific and confined to the work done by the officer during the period under report. They should avoid giving a biased or evasive assessment of the officer under report, as the Countersigning Officers would be required to comment on the quality of the assessment made by them.</li>
            <li>The Reporting Officers should carry out their assessment in Part III through comments against each characteristic. Their opinions should represent the result of careful consideration and objective assessment so that, if called upon, they could justify the remarks/comments. They may maintain a record of the work done by the subordinates in this regard.</li>
            <li>The Reporting Officers should be careful in giving the overall and comparative grading. Special care should be taken so that no officer is placed at an undue disadvantage.</li>
            <li>The Countersigning Officers should weigh the remarks of the RO against their personal knowledge of the officer under report, compare him with other officers of the same grade working under different Reporting Officers, but under the same Countersigning Officer, and then give their overall assessment of the officer. In case of disagreement with the assessment done by the Reporting Officer, specific reasons should be recorded by the Countersigning Officers in Part IV (2).</li>
            <li>The Countersigning Officers should make an unbiased evaluation of the quality of performance evaluation made by the RO by categorizing the reports as exaggerated. Fair or biased. This would evoke a greater sense of responsibility from the reporting officers.</li>
            <li>The Countersigning Officers should underline, in red ink, remarks which in their opinion are adverse and should be communicated to the officer reported upon. All adverse remarks whether remediable or irremediable should be communicated to the officer under report, with a copy of communication placed in the official record. Reporting Officers should ensure that they properly counsel the officer under report before adverse remarks are recorded.</li>
            <li>The Reporting and Countersigning Officers should be clear, direct, objective and unambiguous in their remarks. Vague impressions based on inadequate knowledge or isolated incidents should be avoided. Reports should be consistent with the pen picture, overall grading and comparative grading.</li>
          </ul>

          <Box className="print-page">
            <Typography sx={{ fontWeight: "bold", textDecoration: "underLine", mt: 2 }}>IMPORTANT</Typography>
            <ul>
              <li>The officer/official to be reported upon should submit the AAR Form after completing Part-1 & II to the Reporting Officer on 1st day of July.</li>
              <li>The Reporting Officer should record his remarks in relevant parts by the 15th of July and pass on the report to the Countersigning Officer.</li>
              <li>The Countersigning Officer should record his remarks by the end of July i.e. 31st of July.</li>
              <li>In the event of non-submission of AAR Form by the officer / official to be reported upon within stipulated time, he/she shall not be considered for contract extension and for financial incentives if any.</li>
              <li>For Annual Assessment Reports of Assistant Directors & above in Head Office, Reporting Officer would be ADG (Admin. / Technical) whereas, reports would be countersigned by DG PLRA.</li>
              <li>For Annual Assessment Reports of Office Assistants / Computer Operators and below in the Head Office, Additional Directors / Deputy Directors concerned would be Reporting Officers, whereas, reports would be countersigned by concerned Directors.</li>
            </ul>
          </Box>
        </Box>




        {/* Print Button */}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handlePrint} sx={{ p: 2 }}>
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default AnnualAssessment;