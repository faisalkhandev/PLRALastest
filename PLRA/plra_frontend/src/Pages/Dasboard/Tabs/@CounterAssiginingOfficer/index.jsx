import React from 'react'
import { useDashboardProcessCountQuery } from '../../../../Features/API/DashboardApi.js'
import { Box, MenuItem, Select, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import ApprovalCard from '../../Approvals/ApprovalCard.jsx'
import DepartmentCard from '../../MyDepartment/DepartmentCard.jsx'
import attendanceData from '../../../../Data/Charts/attendanceData.json'
import EmployeeCategoryData from '../../../../Data/Charts/EmployeeCategoryData.json'
import { StatusCard, LeaveAnalysisCard } from '../../../../Components'


const index = () => {
  const { data: processData, isLoading: loading, isError: refreshError, error: queryError, refetch } = useDashboardProcessCountQuery();

  const processDataLength = {
    NocLength: processData?.results[0]?.process_counts?.NOC?.length > 0,
    ResignationLength: processData?.results[0]?.process_counts?.Resignation?.length > 0,
    TerminationLength: processData?.results[0]?.process_counts?.Termination?.length > 0,
    ProgressionLength: processData?.results[0]?.process_counts?.Progression?.length > 0,
    ElevationLength: processData?.results[0]?.process_counts?.Elevation?.length > 0,
    AdministrativeTransferLength: processData?.results[0]?.process_counts?.Administrative_Transfer?.length > 0,
    ETransferLength: processData?.results[0]?.process_counts?.E_Transfer?.length > 0,
    AnnualAssessmentLength: processData?.results[0]?.process_counts?.Annual_Assessment?.length > 0,
    DisciplinaryLength: processData?.results[0]?.process_counts?.Disciplinary?.length > 0,
  }


  return (
    <div>
      <Box sx={{ py: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>

            <Grid item xs={12} >
              <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Leave</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {processData?.results[0]?.process_counts?.Leave?.map((item) => (
                  <LeaveAnalysisCard key={item?.name} name={item?.leave_type} count={item?.bucket_size} RecordData={item} redirectLink="/" bgcolor={'#00838f'} />
                ))}
              </Box>
            </Grid>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {processDataLength?.DisciplinaryLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Disciplinary Proceedings</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Disciplinary?.map((item) => (
                      <StatusCard key={item?.name} name={item?.name} count={item?.count} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid> : null}

              {processDataLength.NocLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>NOC</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Noc?.map((item) => (
                      <StatusCard key={item?.name} name={item?.name} count={item?.count} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid> : null}

              {processDataLength?.ResignationLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Resignation</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Resignation?.map((item) => (
                      <StatusCard name={item?.name} count={item?.count} key={item?.name} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid>
                :
                null}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {processDataLength?.ProgressionLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Progression</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Progression?.map((item) => (
                      <StatusCard name={item?.name} count={item?.count} key={item?.name} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid> : null}

              {processDataLength?.ElevationLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Elevation</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Elevation?.map((item) => (
                      <StatusCard name={item?.name} count={item?.count} key={item?.name} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid> : null}

              {processDataLength?.TerminationLength ?
                <Grid item xs={4}>
                  <Typography variant="h5" color="initial" sx={{ fontWeight: 'semi-' }}>Termination</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {processData?.results[0]?.process_counts?.Termination?.map((item) => (
                      <StatusCard name={item?.name} count={item?.count} key={item?.name} redirectLink="/" bgcolor={'#00838f'} />
                    ))}
                  </Box>
                </Grid> : null}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ py: 1, mt: 1 }}>
        {/* <Typography sx={{ fontSize: '18px', pt: '20px', mb: '20px' }}>My Department</Typography> */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={4} lg={3} >
            <DepartmentCard title={"Today Attendance"} sourceData={attendanceData} />
          </Grid>
          <Grid item xs={12} md={4} lg={3} sx>
            <DepartmentCard title={"All Employee"} sourceData={EmployeeCategoryData} />
          </Grid>
        </Grid>
      </Box>
    </div >
  )
}

export default index
