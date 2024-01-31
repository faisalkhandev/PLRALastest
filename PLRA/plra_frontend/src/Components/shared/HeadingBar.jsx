import React from 'react'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'

const HeadingBar = ({ title }) => {
  return (
    <Box sx={{  display: 'flex', flexDirection:'column', justifyContent:'start',  my: 2 }}>
      <Typography variant="h6" color="initial" sx={{ mb:1, mt:2, fontWeight:600 }} >{title} :</Typography>
    </Box>
  )
}

export default HeadingBar