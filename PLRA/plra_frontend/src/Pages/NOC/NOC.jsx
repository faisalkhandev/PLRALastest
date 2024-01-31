import React, { useState } from 'react'
import { useUpdatePersonalDocumentsMutation } from '../../Features/API/EmployeeMasterDataAPI'

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
    console.log("response : ", res);



  }

  return (
    <div>
      <form action="" onSubmit={callAPi}>
        <input type="file" onChange={imgHandler} name="attachment" required />
        <button type='submit' style={{ border: '1px solid #000' }}>Upload Picture</button>
      </form>
    </div>
  )
}

export default NOC
