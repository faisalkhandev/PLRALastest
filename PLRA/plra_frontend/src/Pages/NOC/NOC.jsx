import React, { useState } from 'react'
import { useUpdatePersonalDocumentsMutation } from '../../Features/API/EmployeeMasterDataAPI'
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
const NOC = () => {



  const [ApiData, setAPiData] = useState({
    document_type: 'Degree',
    document_name: 'Matric Degree',
    issuance_authority: 'RWP Board',
    effective_date: '2023-10-01',
    expiration_date: '2023-10-28',
    renewal_require: true,
    renewal_date: '2023-10-19',
    verified: true,
    attachment: '',
    employee: 3
  })

  const [updatePersonalDocuments] = useUpdatePersonalDocumentsMutation();
  const selectRowID = 1;

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setAPiData({ ...ApiData, [name]: value })
  }
  const imgHandler = (e) => { setAPiData({ ...ApiData, attachment: e.target.files[0] }) }

  const callAPi = async (e) => {
    e.preventDefault();
    let { name } = ApiData;
    let formD = new FormData();

    formD.append('document_type', ApiData.document_type);
    formD.append('employee', ApiData.employee);
    formD.append("document_name", ApiData.document_name);
    formD.append("issuance_authority", ApiData.issuance_authority);
    formD.append("effective_date", ApiData.effective_date);
    formD.append("expiration_date", ApiData.expiration_date);
    formD.append("renewal_require", ApiData.renewal_require);
    formD.append("renewal_date", ApiData.renewal_date);
    formD.append("attachment", ApiData.attachment);
    formD.append("verified", ApiData.verified);

    const res = await updatePersonalDocuments({ selectRowID, formD })
  }

  return (
    <>
    <div>
      <form action="" onSubmit={callAPi}>
        <input type="file" onChange={imgHandler} name="attachment" required />
        <button type='submit' style={{ border: '1px solid #000' }}>Upload Picture</button>
      </form>
    </div>
    
    <Box sx={{ width: "70%", margin: "auto", mt: 10 }} className="AnnualAssessmentTable" >
      <div>
        <Box sx={{ display: "flex", justifyContent: "space-between", }} >
          <img src={"/static/Logo.png"} alt="plra logo" width="150px" height="150px" />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "35px", textAlign: "center" }}>
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
            <b> No.PLRA/(HR)/2023/______ </b> This is to certify that Mr. Iftikhar Ahmed S/O Muzamil Hussain bearing CNIC no. 36836-73895671-3
            working as aservice center in the Punjab Land Record Authority since 22-08-2024. This Office has no objection upon his application
            for the post of Lecturer Computer Science in University of Agriculture, Faisalabad.
          </Typography>
        </Box>
        <Box sx={{  display: "flex", justifyContent: "end", alignItems: "center", textAlign: "center", marginTop: "35px" , pt:10 , position:"relative" , right :"0" }}>
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

export default NOC
