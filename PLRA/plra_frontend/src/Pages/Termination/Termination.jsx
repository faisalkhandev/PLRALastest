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

const category = [
  { id: 1, value: 'Compulsory', label: 'Compulsory Retirement' },
  { id: 2, value: 'Removal', label: 'Removal from services' },
  { id: 3, value: 'Dismisal', label: 'Dismisal from services' },
];

const Termination = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 4 }} >
      <Box className="customBox">

        {/* Breadcrumb  */}
        <Box sx={
          { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }
        } >
          <Breadcrumb title="Termination" breadcrumbItem="Employee / Termination" />
          <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
            <Btn type="save" onClick={() => { }} />
            <Btn type="back" onClick={() => window.history.go(-1)} />
          </Box>
        </Box >
        <Grid container columnSpacing={8} sx={{ px: 4 }}>
          <Grid item md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="NoticePeriod" label="Notice Period " placeholder="Nmber of months" type="number" fullWidth />
            <TextArea Rows={8} lable="Reason" placeholder="Write termination reason...." mandatory />
            <TextArea Rows={8} lable="Notes" placeholder="Write termination reason...." />
          </Grid>
          <Grid item md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SimpleDropDown name='Status' placeholder='Select Purpose' label='Status' isShowIcon={true} options={options} mandatory />
            <SimpleDropDown name='category' label='Category' isShowIcon={true} options={category} mandatory />
            <FileInput label='Attachments' />

          </Grid>
        </Grid>
      </Box>

    </Box >







  )
}

export default Termination
