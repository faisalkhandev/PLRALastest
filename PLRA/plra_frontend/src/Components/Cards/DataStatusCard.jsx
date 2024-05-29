import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { AngleRight } from '../../Assets/Icons'



const DataStatusCard = ({ title, count }) => {
  return (
    <>
      <Box>
        <Typography variant="body1" color="initial">{title}</Typography>
        <Typography variant="h3" color="initial">{count}</Typography>
        <Box sx={{
          width: '50%', height: "12px", borderTop: "2px solid #E0E0E0",
          display: 'flex', justifyContent: 'start', alignItems: 'center',
          mt: 1, pt: 2, cursor: 'pointer'
        }}>
          <AngleRight /><Typography variant="body1" color="#00838f" fontWeight={600}>See More</Typography>
        </Box>
      </Box>
    </>
  )
}

export default DataStatusCard