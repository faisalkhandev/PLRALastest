import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import './HR_Calender.css'
import { Btn } from "../../Components";
import { GoBack } from "../../Assets/Icons";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { useGetNocDialogBoxQuery } from "../../Features/API/NocAPI";


const HR_Calendar = () => {
  const theme = useTheme();
  const printPage = useRef();
  const handlePrint = useReactToPrint({ content: () => printPage.current });
  const handleBack = () => onStepChange(1);
  const { nocId } = useParams();
  const { data } = useGetNocDialogBoxQuery(nocId);

  console.log("NOC ID :", nocId);
  console.log("NOC ID DATA :", data);
  console.log("NOC ID id :", data?.results[0]?.id);

  return (
    <>

      <Box sx={{
        width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center", transform: "rotate(180deg)",
        cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
        boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
      }} onClick={() => window.history.go(-1)}>
        <GoBack />
      </Box>


      {/* JOB NOC  */}
      <Box sx={{ width: "70%", margin: "auto", mt: 4 }} className="AnnualAssessmentTable" >
        <Box sx={{ display: 'flex', justifyContent: 'end', mr: 7 }}>
          {/* <Button variant="contained" onClick={handlePrint} sx={{ p: 2 }}>
                  Print
                </Button> */}
          <Box sx={{ display: 'flex', justifyContent: 'end', mr: -1 }}>
            <Btn type="Print" onClick={handlePrint} />
          </Box>
        </Box>
        <div ref={printPage} style={{ padding: '30px 30px' }} className="print-page-HR">
          <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }} >
            <img src={"/static/Logo.png"} alt="plra logo" width="120px" height="120px" style={{ marginTop: '35px' }} />
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "35px", textAlign: "center" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: '15px' }}>
                Government Of the Punjab <br /> Punjab Land Records Authority <br /> (HR.Wing) <br /> Lahore, Dated 31 May, 2024
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "35px" }}  >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Job NOC <br />
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline " }}>
              To Whom It May Concern
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "semibold", ml: 2, mt: 4 }}>
              <b> No.PLRA/(HR)/2023/______ </b> This is to certify that {data?.results[0]?.employee?.first_name + " " + data?.results[0]?.employee?.last_name} S/O {data?.results[0]?.employee?.last_name} bearing CNIC no. 36836-73895671-3
              having the NOC Type {data?.results[0]?.noc_type?.noc_type + " "}working as a service center in the Punjab Land Record Authority since 22-08-2024. This Office has no objection upon his application
              for the post of Lecturer Computer Science in University of Agriculture, Faisalabad.
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
};

export default HR_Calendar;





{/* RESIGNATION REPORT */ }
// <Box sx={{ width: "70%", margin: "auto", mt: 4 }} className="AnnualAssessmentTable" >
//   <div ref={printPage} style={{ padding: '30px 30px' }}
//     className="print-page-HR">
//     <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }} >
//       <img src={"/static/Logo.png"} alt="plra logo" width="120px" height="120px" style={{ marginTop: '35px' }} />
//       <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "35px", textAlign: "center" }}>
//         <Typography sx={{ fontWeight: "bold", fontSize: '15px' }}>
//           Government Of the Punjab <br /> Punjab Land Records Authority <br /> (HR.Wing) <br /> Lahore, Dated 31 May, 2024
//         </Typography>
//       </Box>
//     </Box>
//     <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "35px" }}  >
//       <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//         Resignation NOC <br />
//       </Typography>
//       <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: "underline " }}>
//         To Whom It May Concern
//       </Typography>

//     </Box>
//     <Box>
//       <Typography variant="h6" sx={{ fontWeight: "semibold", ml: 2, mt: 4 }}>
//         <b />
//         No.PLRA/(HR)/2023/______ This is to certify that Mr. Iftikhar Ahmed S/O Muzamil Hussain bearing CNIC no. 36836-73895671-3, who has been working as a service center at the Punjab Land Record Authority since 22-08-2024, has submitted his resignation. This Office has no objection to issuing him a No Objection Certificate (NOC) upon the completion of his resignation formalities.
//       </Typography>
//     </Box>
//     <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", textAlign: "center", marginTop: "35px", pt: 10, position: "relative", right: "0", mx: 2 }}>
//       <Box>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           _____________________
//         </Typography>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           Director HR <br />
//         </Typography>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           Punjab Land Records Authority <br />
//         </Typography>
//       </Box>
//     </Box>
//   </div>
// </Box>