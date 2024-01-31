import React, { useRef, useState } from "react";
import { Box, Typography, Button, Select, MenuItem, Grid } from "@mui/material";
import plraLogo from "../AnnualAssessment/PLRA.png";
import { BorderLessInput } from "../../Components";
import { useReactToPrint } from "react-to-print";
import './Style.css'

const AnnualAssessment = () => {
  const [Grade, setGrade] = useState("");

  const printPage = useRef();
  const handlePrint = useReactToPrint({ content: () => printPage.current });

  function handleGradeChange(event) { setGrade(event.target.value) }

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
            justifyContent: "space-around",
            textDecoration: "underline ",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            FOR OFFICERS IN PPG 03 & ABOVE
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            CONFIDENTIAL
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "75px" }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            PUNJAB LAND RECORDS AUTHORITY
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
        >
          <img src={plraLogo} alt="plra logo" width="150px" height="150px" />
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
            FOR THE PERIOD DatePicker to DatePicker{" "}
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
          <BorderLessInput label="1. Name(in block letters)" />
          <BorderLessInput label="2. S/o, D/o.(In block letters)" />
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box style={{ width: "90%" }}>
              <BorderLessInput label="3. Designation" width={"375px"} />
            </Box>
            <BorderLessInput label="CNIC No." width={"100px"} />
          </Box>
          <BorderLessInput label="4. Date of birthday" />
          <BorderLessInput label="5. Date of joining in PLRA" />
          <BorderLessInput label="6. Post held during the period" />
          <BorderLessInput label="7. Academic qualifications" />
          <BorderLessInput label="8. Period Served" />
          <BorderLessInput label="(i). In present post" />
          <BorderLessInput label="(ii). Under the reporting Officer" />
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
          placeholder="Write the job description..."
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
          placeholder="Write the job description..."
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
          placeholder="Write the job description..."
        />

        <Box>
          <Grid container spacing={0} sx={{
            borderTop: '1px solid black',
            borderRight: '1px solid black',
            borderLeft: '1px solid black', mt: 2
          }}>
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}>No#</Grid>
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
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
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
              <Typography sx={{ fontWeight: "bold" }}>Quality of work</Typography>
              <Typography sx={{}}>Always up-to-date; accumulates no Arrears</Typography>
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
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
            <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1 }}>No#</Grid>
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
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
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
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', p: 1, fontWeight: 600, }}><Box><input type="checkbox" /></Box></Grid>
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
          placeholder="Write the description..."
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
          placeholder="Write the description..."
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
          placeholder="Write the description..."
        />

        <Box sx={{ display: "flex", marginTop: "15px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            6. Overall grading
          </Typography>
        </Box>
        <Select
          labelId="grade"
          id="grade"
          value={Grade}
          label="Grade"
          onChange={handleGradeChange}
          sx={{ width: "20%", marginTop: "10px" }}
        >
          <MenuItem value="none">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Very Good">Very Good</MenuItem>
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Average">Average</MenuItem>
          <MenuItem value="Below Average">Below Average</MenuItem>
        </Select>

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
          placeholder="Write the description..."
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
            <BorderLessInput label="Designation" width={"375px"} />
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
          <Typography sx={{ fontWeight: "bold" }}>
            1. How often have you seen the urork ot the officer reported upon?
          </Typography>
        </Box>
        <Select
          labelId="grade"
          id="grade"
          value={Grade}
          label="Grade"
          onChange={handleGradeChange}
          sx={{ width: "20%", marginTop: "10px" }}
        >
          <MenuItem value="none">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Very Good">Very Good</MenuItem>
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Average">Average</MenuItem>
          <MenuItem value="Below Average">Below Average</MenuItem>
        </Select>

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
          placeholder="Write the description..."
        />

        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            3. Overall grading
          </Typography>
        </Box>

        <Select
          labelId="grade"
          id="grade"
          value={Grade}
          label="Grade"
          onChange={handleGradeChange}
          sx={{ width: "20%", marginTop: "10px" }}
        >
          <MenuItem value="none">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Very Good">Very Good</MenuItem>
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Average">Average</MenuItem>
          <MenuItem value="Below Average">Below Average</MenuItem>
        </Select>

        <Box sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}>
          <BorderLessInput
            label="4. Recommendation for retention / extension in contract:"
            width="80%"
          />
        </Box>

        <Box sx={{ display: "flex", marginTop: "35px" }}>
          <Typography sx={{ fontWeight: "bold" }}>
            5. Evaluation of the quality of assessment made by the reporting officer
          </Typography>
        </Box>

        <Select
          labelId="grade"
          id="grade"
          value={Grade}
          label="Grade"
          onChange={handleGradeChange}
          sx={{ width: "20%", marginTop: "10px" }}
        >
          <MenuItem value="none">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Exaggerated">Exaggerated</MenuItem>
          <MenuItem value="Fair">Fair</MenuItem>
          <MenuItem value="Biased">Biased</MenuItem>
        </Select>

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
              label="Name of the reporting officer"
              width={"375px"}
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
            <BorderLessInput label="Designation" width={"375px"} />
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
