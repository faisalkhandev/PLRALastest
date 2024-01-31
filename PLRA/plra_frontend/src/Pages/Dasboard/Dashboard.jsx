import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import ReportCard from './ReportCard'

import ApprovalCard from './Approvals/ApprovalCard'


const Dashboard = () => {
  const theme = useTheme();





  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h5" sx={{ margin: 0, fontWeight: "bold", mb: 2 }}>Dashboard</Typography>
      <Grid container spacing={2} >
        <Grid item xs={2}><ReportCard analysisFiger={'3000'} cardTitle={"Total Employee's"} growth={"+"} /></Grid>
        <Grid item xs={2}><ReportCard analysisFiger={'30'} cardTitle={"Total Leave"} growth={"+"} /></Grid>
        <Grid item xs={2}><ReportCard analysisFiger={'3000'} cardTitle={"Total Employee's"} growth={"-"} /></Grid>
        <Grid item xs={2}><ReportCard analysisFiger={'3000'} cardTitle={"Total Employee's"} growth={"+"} /></Grid>
        <Grid item xs={2}><ReportCard analysisFiger={'3000'} cardTitle={"Total Employee's"} growth={"-"} /></Grid>

        {/* Leave Approval Card  */}
        <Grid item xs={4}>
          <ApprovalCard />
        </Grid>
      </Grid>


    </Box>
  )
}

export default Dashboard