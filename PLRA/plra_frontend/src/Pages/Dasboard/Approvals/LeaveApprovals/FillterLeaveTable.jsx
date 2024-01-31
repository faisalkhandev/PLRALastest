import React, { useState } from 'react';
import { GoBack } from '../../../../Assets/Icons/index'
import { useTheme, Typography, Box, Grid, Dialog } from '@mui/material';
import { Link } from 'react-router-dom';
import LeaveDialog from './LeaveDialog';
import { useGetCasualMedicalLeaveQuery } from '../../../../Features/API/SetupApi';
import Loader from './../../../../Components/shared/Loader';


const FillterLeaveTable = ({ fillter, onCasualClick }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const theme = useTheme();
  const { data: filterData, isError, Loader, refetch } = useGetCasualMedicalLeaveQuery(fillter);



  const handleCloseDialog = () => setOpenDialog(false);
  const handleCasualClick = (label) => {
    if (onCasualClick) {
      onCasualClick(label);
    }
  };
  const openDetailsDialog = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", alignItems: 'center' }}>
        <Box sx={{
          width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
          transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
          boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
        }} onClick={() => handleCasualClick("")}><GoBack /></Box>
        <Typography variant="h6" color="initial" sx={{ fontWeight: 600 }}>{fillter} Leaves</Typography>
      </Box>


      <Box sx={{ mx: 1, mt: 1 }}>
        <Box sx={{ width: '100%', mt: 1 }}>
          <Box
            sx={{
              width: "100%", height: "calc(100vh - 295px)",
              backgroundColor: theme.palette.white[800],
              borderRadius: "6px", overflow: 'hidden',
              boxShadow: "0 0 15px 2px #efefef",
            }}>
            {/* Header  */}
            <Box
              sx={{
                height: '30px', width: "100%",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.white[800],
                display: 'flex', alignItems: 'center', px: 1,
              }}>
              <Grid container spacing={0}>
                <Grid item xs={1} sx={{ textAlign: 'center' }}>Leave ID</Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>Leave Type</Grid>
                <Grid item xs={1.5} sx={{ textAlign: 'center' }}>Application Date</Grid>
                <Grid item xs={1.5} sx={{ textAlign: 'center' }}>Start Date</Grid>
                <Grid item xs={1.5} sx={{ textAlign: 'center' }}>End Date</Grid>
                <Grid item xs={1.5} sx={{ textAlign: 'center' }}>Duration</Grid>
              </Grid>
            </Box>
            {/* Body  */}
            <Box sx={{
              height: "calc(100vh - 220px)", width: "100%",
              display: 'flex', alignItems: 'start', overflow: 'scroll',
              justifyContent: 'start', flexDirection: "column",
            }}>
              {filterData?.results?.map((record, id) => (
                <Link
                  onClick={() => openDetailsDialog(record)}
                  style={{
                    padding: "4px 0", width: "100%", color: '#000',
                    borderBottom: `1px solid ${theme.palette.gray[400]}`,
                    '&:hover': { bgcolor: theme.palette.gray[200], cursor: 'pointer' }
                  }}>
                  <Grid key={id} container spacing={0} >
                    <Grid item xs={1} sx={{ textAlign: 'center' }}>{record?.leave_deduction_bucket_id || 'NoID'}</Grid>
                    <Grid item xs={2} sx={{ textAlign: 'center' }}>{record?.leave_type?.leave_type}</Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}>{record?.apply_date && new Date(record.apply_date).toLocaleDateString('en-GB')}</Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}>{new Date(record?.from_date).toLocaleDateString('en-GB')}</Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}>{new Date(record?.to_date).toLocaleDateString('en-GB')}</Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }}>{record?.days_count}</Grid>
                  </Grid>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ width: '800px', p: 2, height: "70vh", overflow: 'scroll' }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: 'center', mb: 2 }}>Leave Detail</Typography>
          <LeaveDialog leaveData={selectedRecord} />
        </Box>
      </Dialog>
    </>
  );
};

export default FillterLeaveTable;
