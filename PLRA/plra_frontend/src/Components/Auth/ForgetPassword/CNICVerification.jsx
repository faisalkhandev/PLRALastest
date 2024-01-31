import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Logo from '../../../Assets/png/Logo1.png'
import { useTheme } from '@emotion/react';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom'


const CNICVerification = ({ onStepChange }) => {
  const theme = useTheme();
  const handleSubmit = () => onStepChange(2)


  return (
    <Box sx={{ with: '100%', height: "100vh", overflow: 'hidden', mt: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} sx={{ width: "100%", height: "107vh", display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: theme.palette.primary[200] }}>
          <img src={Logo} alt="" style={{ width: "450px" }} />
        </Grid>


        <Grid item xs={12} md={6} sx={{ width: "100%", height: "100vh", display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', px: 2 }}>
          <Box sx={{ width: "60%", height: "100vh", display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="initial" sx={{ fontWeight: 600, fontSize: '35px', color: theme.palette.primary.main }}>Forget Password</Typography>
            <Typography variant="body1" color="initial" sx={{ width: "80%", fontSize: "16px", textAlign: 'center', opacity: "0.5" }}>Enter your CNIC for reset your password.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 0.3, mt: 4 }}>
              <label htmlFor="" style={{ fontSize: "16px" }}>CNIC</label>
              <InputMask mask="99999-9999999-9" maskChar="" type="text" className="input" placeholder="XXXXX-XXXXXXX-X" style={{ letterSpacing: "2px" }} />
            </Box>

            <Box sx={{ width: '100%', textAlign: 'right', textDecoration: 'underline', cursor: "pointer", "&:hover": { color: theme.palette.primary.main }, mt: '-10px' }}>
              <Link to='/login' style={{ color: `${theme.palette.primary.main}` }}>
                Login Your Account?
              </Link>
            </Box>
            <button className='loginButton' onClick={handleSubmit}>Send Code</button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CNICVerification
