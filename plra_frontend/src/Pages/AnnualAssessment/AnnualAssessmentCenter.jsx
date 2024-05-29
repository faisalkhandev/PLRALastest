import React, { useRef, useState } from "react";
import { Box, Typography, Button, Select, MenuItem, Grid } from "@mui/material";
import plraLogo from "../AnnualAssessment/PLRA.png";
import { BorderLessInput } from "../../Components";
import { useReactToPrint } from "react-to-print";
import './Style.css'
import { useCcoApprovalByIDQuery } from "../../Features/API/AnnualAssessment";
import './Style.css'
import { useParams } from "react-router-dom";
import { useGetPositionByIdQuery } from "../../Features/API/API";

const AnnualAssessmentCenter = () => {
    const [Grade, setGrade] = useState("");
    const [print, setPrint] = useState(false);
    const { id } = useParams()
    const { data: AnnualApprovalListData, isLoading, refetch: refetch } = useCcoApprovalByIDQuery(id);
    const positionId = AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.position;
    const { data: positiondata, positionisLoading, refetch: positionrefetch } = useGetPositionByIdQuery({ positionId });


    const printPage = useRef();
    const handlePrint =
        useReactToPrint({ content: () => printPage.current });


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
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}> FOR OFFICERS IN PPG 03 & ABOVE</Typography>
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
                <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mt: "15px" }}>For Service Center Incharge &<br />Assistant Service Center Incharge </Typography>
                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                     FOR THE PERIOD {AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process?.year?.hr_celander_starting_date} To {AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process?.year?.hr_celander_ending_date}{" "}
                    </Typography>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        PART I
                    </Typography>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        (SYSTEM GENERATED){" "}
                    </Typography>
                </Box>

                {/* Inputs */}
                <Box sx={{ display: "flex", flexDirection: "column", mt: 4, gap: 2 }}>
                    <BorderLessInput label="1. Name(in block letters)" value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.first_name}  ${AnnualApprovalListData?.results?.[0].approvals[0].aar_process.employee.last_name}`} />
                    <BorderLessInput label="2. S/o, D/o.(In block letters)" value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.father_name} `} />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Grid container xs={12}>
                            <Grid item xs={8}>
                                <BorderLessInput label="3. Date of birth" inputWidth={"70%"} />
                            </Grid>
                            <Grid item xs={4}>
                                <BorderLessInput label="4. Domicile" width={"137px"} sx={{ml:1}}  value={`${AnnualApprovalListData?.results?.[0].approvals[0].aar_process.employee.domicile_district}`} />
                            </Grid>
                        </Grid>
                    </Box>
                    <BorderLessInput label="5. PPG with present pay" value={positiondata?.results?.[0]?.job?.ppg_level} />
                    <BorderLessInput label="6. Post held during the period" value={positiondata?.results?.[0]?.position_desc.charAt(0).toUpperCase() + positiondata?.results?.[0]?.position_desc.slice(1)} />
                    <BorderLessInput label="7. Academic qualifications" />
                    <BorderLessInput label="8. Period served" value={AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.service_duration.charAt(0).toUpperCase() + AnnualApprovalListData?.results?.[0].approvals[0]?.aar_process.employee.service_duration.slice(1)} />
                    <BorderLessInput label="(i). In present post" value={positiondata?.results?.[0]?.position_desc.charAt(0).toUpperCase() + positiondata?.results?.[0]?.position_desc.slice(1)} />
                    <BorderLessInput label="(ii). Under the reporting officer" value={`${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.first_name.charAt(0).toUpperCase()}${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.first_name.slice(1)} ${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.last_name.charAt(0).toUpperCase()}${AnnualApprovalListData?.results?.[0].approvals[0]?.approving_authority?.last_name.slice(1)}`} />
                    <BorderLessInput label="9. Place of posting " value={positiondata?.results?.[0]?.location?.center_name.charAt(0).toUpperCase() + positiondata?.results?.[0]?.location?.center_name.slice(1)} />

                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "start", marginTop: "65px" }}
                    className="print-page"
                >
                    <Typography sx={{ fontWeight: "bold", mt: '45px' }}>
                        10. Postings during Reporting period:
                    </Typography>
                </Box>
                <Box>
                    <Grid container spacing={0} sx={{
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderLeft: '1px solid black', mt: 1
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>No#</Grid>
                        <Grid item xs={3.5} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>Posting Station</Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>Time Duration</Box></Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>Total Stay</Box></Grid>
                    </Grid>

                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}></Grid>
                        <Grid item xs={3.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}></Typography>
                        </Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>From</Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>To</Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                            <Typography sx={{}}></Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>1</Grid>
                        <Grid item xs={3.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}></Typography>
                        </Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}></Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}></Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                            <Typography sx={{}}></Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>2</Grid>
                        <Grid item xs={3.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}></Typography>
                        </Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}></Grid>
                        <Grid item xs={2.25} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}></Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                            <Typography sx={{}}></Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: "flex", mt: "45px", mb: "30px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        3. Brief achievements during the reporting period (if any) filled by Officer:
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
                    value={`${AnnualApprovalListData?.results?.[0].brief_achievements}`}
                    placeholder="Write some description..."
                />

                <Typography variant="h5" sx={{ textAlign: 'center', mt: "35px" }} fontWeight="bold">PART II</Typography>

                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} >
                        (TO BE FILLED IN BY THE  REPORTING OFFICER (85 Marks) ){" "}
                    </Typography>
                </Box>
                <Typography sx={{ fontWeight: "bold", mt: '35px' }}>
                    1. Performance Assessment of the employee (SCI’s) on the basis of routine working / assigned tasks.
                </Typography>
                <Box>
                    <Grid container spacing={0} sx={{
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderLeft: '1px solid black', mt: 2
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>No#</Grid>
                        <Grid item xs={5} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>Criteria for Reporting </Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>Max Rating</Box></Grid>
                        <Grid item xs={3} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>Points Earned</Box></Grid>
                    </Grid>
                    {
                        AnnualApprovalListData?.results?.[0]?.points?.map((point, index) =>

                            <Grid key={index} container spacing={0} sx={{
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }}>
                                <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>{`${point.aar_request_id}`}</Grid>
                                <Grid item xs={5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                                    <Typography sx={{ fontWeight: "bold" }}>{`${point.category}`}</Typography>
                                </Grid>
                                <Grid item xs={3} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>{`${point.max_points
                                    }`}</Grid>
                                <Grid item xs={3} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>{`${point.point_earned}`}</Grid>
                            </Grid>
                        )}

                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "65px" }}
                    className="print-page"
                >
                    <Typography variant="h5" sx={{ textAlign: 'center', mt: '30px' }} fontWeight="bold">PART III</Typography>
                </Box>

                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: "35px" }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        (TO BE FILLED IN BY THE  REPORTING OFFICER (10  Marks) ){" "}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", marginTop: "35px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        1.Comparing him with other employees of the same level and keeping in view the overall score
                        obtained by the employee on account of attributes / professional competencies (part-II)
                        of the form, give your general assessment of the employee by initiating the appropriate box below:
                    </Typography>
                </Box>
                <Box>
                    <Grid container spacing={0} sx={{
                        borderTop: '1px solid black',
                        borderRight: '1px solid black',
                        borderLeft: '1px solid black', mt: '30px'
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>No#</Grid>
                        <Grid item xs={6.5} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}>Percentile </Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', textAlign: 'center', p: 1, fontWeight: 600, }}><Box>Grade </Box></Grid>
                    </Grid>


                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>1</Grid>
                        <Grid item xs={6.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>80% and above</Typography>
                        </Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>Very Good</Grid>
                    </Grid>

                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>2</Grid>
                        <Grid item xs={6.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>60% to 80%</Typography>
                        </Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>Good</Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>3</Grid>
                        <Grid item xs={6.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>40% to 60%</Typography>
                        </Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>Average</Grid>
                    </Grid>
                    <Grid container spacing={0} sx={{
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                    }}>
                        <Grid item xs={1} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>4</Grid>
                        <Grid item xs={6.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>40% and below 40% </Typography>
                        </Grid>
                        <Grid item xs={4.5} sx={{ border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, fontWeight: 600, }}>Below Average</Grid>
                    </Grid>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        marginTop: "45px",
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
                        (TO BE FILLED IN BY THE  COUNTER SIGNING OFFICER (5  Marks) ){" "}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", marginTop: "15px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        1. Integrity Level:
                    </Typography>
                </Box>
                <Select
                    labelId="grade"
                    id="grade"
                    value={`${AnnualApprovalListData?.results?.[0].approvals[1].reporting_officer}`}
                    label="Grade"
                    onChange={handleGradeChange}
                    sx={{ width: "20%", marginTop: "10px" }}
                >
                    <MenuItem value="Very Good">Honest</MenuItem>
                    <MenuItem value="Good">Reported to be corrupt</MenuItem>
                </Select>




                <Box sx={{ display: "flex", marginTop: "35px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        3. Service Level:
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
                        3. Please add a pen picture and if any reports of mall practices against the officer:
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
                    value={`${AnnualApprovalListData?.results?.[0].approvals[1].pen_picture_countersigning_officer}`}
                    placeholder="Write some description..."
                />

                <Box sx={{ display: "flex", marginTop: "35px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        3. USEFULNESS FOR RETENTION / EXTENSION IN CONTRACT
                    </Typography>
                </Box>

                <Select
                    labelId="grade"
                    id="grade"
                    value={`${AnnualApprovalListData?.results?.[0].approvals[1].useful}`}
                    label="Grade"
                    onChange={handleGradeChange}
                    sx={{ width: "20%", marginTop: "10px" }}
                >
                    <MenuItem value="none">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="Very Good">Useful</MenuItem>
                    <MenuItem value="Good">Not Useful</MenuItem>

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
                            label="Name of the counter signing officer"
                            width={"375px"} value={`${AnnualApprovalListData?.results?.[0].approvals[1]?.approving_authority?.first_name} ${AnnualApprovalListData?.results?.[0].approvals[1]?.approving_authority?.last_name}`}
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
                        <BorderLessInput label="Designation" width={"375px"} value={`${AnnualApprovalListData?.results?.[0].approvals[1].designation}`} />
                    </Box>
                    <BorderLessInput label="Date" width={"100px"} />
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

export default AnnualAssessmentCenter;
