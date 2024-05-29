import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import Breadcrumb from '../../Components/Common/BreadCrumb'
import { Btn, FileInput, InputField, TextArea } from '../../Components'
import { useTheme } from '@emotion/react'
import { Multi_Dropdown, SimpleDropDown } from "../../Components"


const options = [
  { id: 1, value: 'inProcess', label: 'In process' },
  { id: 2, value: 'close', label: 'Close' }
];

const Resignation = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 4 }} >
      <Box className="customBox">

        {/* Breadcrumb  */}
        <Box sx={
          { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }
        } >
          <Breadcrumb title="Resignation" breadcrumbItem="Employee / Resignation" />
          <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
            <Btn type="save" onClick={() => { }} />
            <Btn type="back" onClick={() => window.history.go(-1)} />
          </Box>
        </Box >

        <Grid container columnSpacing={8} sx={{ px: 4 }}>
          <Grid item md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="NoticePeriod" label="Notice Period " placeholder="Nmber of months" type="number" fullWidth />
            <TextArea Rows={8} lable="Reason" placeholder="Write resignation reason...." mandatory />
            <TextArea Rows={8} lable="Notes" placeholder="Write resignation reason...." />
          </Grid>
          <Grid item md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <Multi_Dropdown RowFilterWith={"id"} isOpen={employeeDialog} tableHeader={EmployeeHeader} tableRows={employee_data.results} onSelect={employeeClickHandler} /> */}
            <SimpleDropDown name='Status' placeholder='Select Purpose' label='Status' isShowIcon={true} options={options} />
            <InputField name="Resignation_date" label="Resignation Date" placeholder="" type="date" fullWidth />
            <FileInput label='Attachment' />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Resignation
