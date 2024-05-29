
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Typography } from "@mui/material";
import { Btn } from "../../Components";
import { GoBack } from "../../Assets/Icons";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { useGetNocDialogBoxQuery } from "../../Features/API/NocAPI";
 
const NOCReport = () => {
    const theme = useTheme();
    const printPage = useRef();
    const handlePrint = useReactToPrint({ content: () => printPage.current });
    const { nocId } = useParams();
    const { data } = useGetNocDialogBoxQuery(nocId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    const [editState, setEditState] = useState(false);
 
    // Function to handle printing
    const handlePrintClick = () => {
        handlePrint();
    };
   
      // Function to handle edit button click
      const handleEditClick = () => {
        setEditState(!editState);
    };
 
    // Suppress the contentEditable warning
    if (editState) {
        console.error = () => {}; // Suppress console.error temporarily
    }
 
    return (
        <>
            <Box
                sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "rotate(180deg)",
                    cursor: "pointer",
                    m: 1,
                    borderRadius: "6px",
                    backgroundColor: `${theme.palette.white[800]}`,
                    boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,
                }}
                onClick={() => window.history.go(-1)}
            >
                <GoBack />
            </Box>
 
            {/* NOC REPORT  */}
            <Box sx={{ width: "70%", margin: "auto", mt: 4 }} className="AnnualAssessmentTable">
                <Box sx={{ display: "flex", justifyContent: "end", mr: 7 }}>
                    <Box sx={{ display: "flex", justifyContent: "end", mr: -1, gap: 2 }}>
                    {editState ?
                    <Btn type="save" onClick={handleEditClick} /> :
                    <Btn type="Edit" onClick={handleEditClick} />
                    }
                        <Btn type="Print" onClick={handlePrintClick} />
                    </Box>
                </Box>
                <div ref={printPage} style={{ padding: "30px 30px" }} className="print-page-HR">
                    <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2  }}>
                        <img src={"/static/Logo.png"} alt="plra logo" width="120px" height="120px" style={{ marginTop: "35px" }} />
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "35px", textAlign: "center" }}>
                            <Typography sx={{ fontWeight: "bold", fontSize: "15px" }}>
                                Government Of the Punjab <br /> Punjab Land Records Authority <br /> (HR.Wing) <br /> Lahore, Dated: {formattedDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", mx: 2,justifyContent: "center", alignItems: "center", marginTop: "35px" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {data?.results[0]?.noc_type?.noc_type}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
                            To Whom It May Concern
                        </Typography>
                    </Box>
                    <Box sx={{mx: 2}}>
                        <Typography variant="h6" sx={{ fontWeight: "semibold", ml: 2, mt: 4 }}>
                            <b>
                                <span  >
                                    No. PLRA/(HR)/{data?.results[0]?.noc_apply_date.split('-')[0]}/______
                                </span>
                            </b>{" "}
                            This is to certify that{" "}
                            <span style={{ fontWeight: "bold", outline: "none" }}>
                                {data?.results[0]?.employee?.first_name} {data?.results[0]?.employee?.last_name}
                            </span>{" "}
                            S/O{" "}
                            <span  style={{ fontWeight: "bold", outline: "none" }}>
                                {data?.results[0]?.employee?.father_name}
                            </span>{" "}
                            bearing CNIC No{" "}
                            <span style={{ fontWeight: "bold", outline: "none" }}>
                                {data?.results[0]?.employee?.cnic}
                            </span>{" "}
                            having the NOC Type{" "}
                            <span c >
                                <b>{data?.results[0]?.noc_type?.noc_type}</b>  </span> working as a{" "}
                            <span  style={{ fontWeight: "bold", outline: "none" }}>
                                {data?.results[0]?.employee?.position?.job?.job_title}
                            </span>{" "}
                            in the Punjab Land Record Authority{" "}
                            <span  style={{ fontWeight: "bold", outline: "none" }}>
                                {data?.results[0]?.employee?.date_of_joining}
                            </span>
                            <span  >
                                . This Organization has no objection upon his Application.
                            </span>
                            <span contentEditable={editState}  >
                            </span>
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", textAlign: "center", marginTop: "35px", pt: 10, position: "relative", right: "0", mx: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                _____________________
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Director HR
                            </Typography>  
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Punjab Land Records Authority
                            </Typography>
                        </Box>
                    </Box>
                </div>
            </Box>
        </>
    );
};
 
export default NOCReport;
 