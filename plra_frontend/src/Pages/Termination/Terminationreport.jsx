import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Btn } from "../../Components";
import { GoBack } from "../../Assets/Icons";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { useGetTerminationQuery } from "../../Features/API/Termination";

const Terminationreport = () => {
    const theme = useTheme();
    const printPage = useRef();
    const handlePrint = useReactToPrint({ content: () => printPage.current });
    const handleBack = () => onStepChange(1);
    const { terminationId } = useParams();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


    const { data: terminationData, isLoading, isError, refetch } = useGetTerminationQuery(terminationId);
    console.log("DATA ", terminationData);


    return (
        <>
            <Box sx={{
                width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)",
                cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
            }} onClick={() => window.history.go(-1)}>
                <GoBack />
            </Box>

            {/* Termination Report */}
            <Box sx={{ width: "70%", margin: "auto", mt: 4 }} className="AnnualAssessmentTable" >
                <Box sx={{ display: 'flex', justifyContent: 'end', mr: 7 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'end', mr: -1 }}>
                        <Btn type="Print" onClick={handlePrint} />
                    </Box>
                </Box>

                <div ref={printPage}   style={{ padding: '30px 30px' }} className="print-page-HR">
                    <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }} >
                        <img src={"/static/Logo.png"} alt="plra logo" width="120px" height="120px" style={{ marginTop: '35px' }} />
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "35px", textAlign: "center" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: '15px' }}>
                                Government Of the Punjab <br /> Punjab Land Records Authority <br /> (HR.Wing) <br /> Lahore, Dated: {formattedDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "35px" }}  >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Termination <br />
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline " }}>
                            To Whom It May Concern
                        </Typography>
 
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: "semibold", ml: 2, mt: 4 }}>
                            <b />
                            No.PLRA/(HR)/{terminationData?.results[0]?.case_initiation_date.split('-')[0]}/______ This is to inform that the services of <b>{terminationData?.results[0]?.employee?.first_name + " "}
                            {terminationData?.results[0]?.employee?.last_name} </b>  S/O <b>{terminationData?.results[0]?.employee?.father_name}</b> having ID <b> {terminationData?.results[0]?.id} </b> having catagory of
                            <b> {terminationData?.results[0]?.termination_category} </b> , have been terminated with a notice period of <b>{terminationData?.results[0]?.notice_period}</b> months {" "}
                            <b>{terminationData?.results[0]?.termination_reason ? `having Reason ${terminationData?.results[0]?.termination_reason + ". "}` : ''}</b>
                            This Organization has no objection to Accept a Termination Notice of Completion upon the fulfillment of all necessary procedures.
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", textAlign: "center", marginTop: "35px", pt: 10, position: "relative", right: "0", mx: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                _____________________
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Director HR <br />
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Punjab Land Records Authority <br />
                            </Typography>
                        </Box>
                    </Box>
                </div>

            </Box>
        </>
    )
}

export default Terminationreport




