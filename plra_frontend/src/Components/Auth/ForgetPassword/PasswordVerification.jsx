import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Logo from '../../../Assets/png/Logo1.png';
import { useTheme } from '@emotion/react';
import Btn from '../../Common/Btn'
import {Link} from 'react-router-dom'

const PasswordVerification = ({ onStepChange }) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');

  const handleSubmit = () => {
    onStepChange(3);
  };

  return (
    <Box sx={{ with: '100%', height: '100vh', overflow: 'hidden', mt: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} sx={{ width: '100%', height: '107vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: theme.palette.primary[200] }}>
          <img src={"static/Logo.png"} alt="" style={{ width: '450px' }} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 2 }}>
          <Box sx={{ width: '60%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="initial" sx={{ fontWeight: 700, fontSize: '35px', color: theme.palette.primary.main }}>Reset Password</Typography>
            <Typography variant="body1" color="initial" sx={{ width: '80%', fontSize: '16px', textAlign: 'center', opacity: '0.5' }}>Rest Your password.</Typography>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 0.3, mt:4 }}>
              <label htmlFor="" style={{ fontSize: "16px" }}>New Password</label>
              <input type='text' className='input' placeholder='*********' />
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 0.3 }}>
              <label htmlFor="" style={{ fontSize: "16px" }}>Confirm Password</label>
              <input type='text' className='input' placeholder='*********' />
            </Box>

            <Link to='/login' style={{ width:'100%', textAlign:'center' }}>
            <button className="loginButton" onClick={handleSubmit}>Updata Password</button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordVerification;
