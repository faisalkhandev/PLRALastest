import React from 'react';
import { Typography, Card, Box } from '@mui/material';
import { AngleRight } from '../../Assets/Icons';
import { useTheme } from "@emotion/react";

const StatsCard = ({ name, count }) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 1, width: '180px', backgroundColor: '#fff', color: '#000', borderLeft: '2px solid', boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
      <Typography sx={{ fontSize: "16px", fontWeight: 'light', height: '50px' }}>{name}</Typography>
      <Typography sx={{ fontSize: "32px", fontWeight: 'light', height: '50px' }}>{count}</Typography>
    </Card>
  )
}

export default StatsCard;
