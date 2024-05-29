import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import OTPInput from 'react-otp-input';
import Btn from '../../Common/Btn'
import { useOtpMutation } from '../../../Features/API/Authentication';
import { toast } from 'react-toastify'
import Cookies from 'js-cookie';

const OPTVerification = ({ onStepChange }) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(100);
  const [loading, setLoading] = useState(false);
  const [otpVerification] = useOtpMutation()
  const navigate = useNavigate();


  useEffect(() => {
    const countdown = setInterval(() => { setTimer(prevTimer => prevTimer - 1) }, 1000);
    if (timer === -1) { onStepChange(1); }
    return () => clearInterval(countdown);
  }, [timer, onStepChange]);
  const handleSaveData = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (otp === '') {
      toast.error(`Mandatory fields should not be empty.`, {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);  // Start loading
    try {
      const csrftoken = Cookies.get('csrftoken');
      const formdata = { otp: otp };
      const res = await otpVerification({ formdata, csrftoken });

      if (res.error) {
        if (res.error.status === 400) {
          toast.error('Provide Enter Correct OTP!', { position: 'top-center', autoClose: 2000 });
        }
      } else {
        const authToken = res.data?.Authorization;
        if (authToken) {
          // Perform additional actions if needed
        }
        onStepChange(3);
        toast.success('Login Successfully', { position: 'top-center', autoClose: 3000 });
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      toast.error('Error verifying OTP', { position: 'top-center', autoClose: 3000 });
    } finally {
      setLoading(false);  // Stop loading irrespective of outcome
    }
  };

  const handleBack = () => onStepChange(1)


  return (
    <Box sx={{ with: '100%', height: '100vh', overflow: 'hidden', mt: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} sx={{ width: '100%', height: '107vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: theme.palette.primary[200] }}>
          <img src={"/static/Logo.png"} alt="" style={{ width: '450px' }} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 2 }}>
          <Box sx={{ width: "100%", mt: 3, ml: "-50px" }} onClick={handleBack}>
            <Btn type="back" />
          </Box>
          <Box sx={{ width: '60%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="initial" sx={{ fontWeight: 700, fontSize: '35px', color: theme.palette.primary.main }}>Verify OTP</Typography>
            <Typography variant="body1" color="initial" sx={{ width: '80%', fontSize: '16px', textAlign: 'center', opacity: '0.5' }}>You have received OTP on your register email.</Typography>

            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              separator={<span>-</span>}
              isInputNum={true}
              shouldAutoFocus={true}
              containerStyle={{ marginTop: '30px' }}
              inputContainerStyle={{ margin: '0 10px', padding: '10px', borderRadius: '5px', border: `1px solid ${theme.palette.primary.main}` }}
              inputStyle={{ width: '40px', height: '40px', fontSize: '18px', textAlign: 'center', margin: "0 10px", borderRadius: '6px', boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.15)" }}
              // Make sure renderInput prop is correctly defined
              renderInput={(inputProps, index) => (
                <input {...inputProps} />
              )}
            />
            <Typography variant="body1" color="initial" sx={{ fontSize: '16px', textAlign: 'center', opacity: '0.5', marginTop: '10px' }}>
              Remaining Time: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </Typography>
            <button
              className="loginButton"
              onClick={handleSaveData}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#379237', // '#ccc' is a light gray color
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OPTVerification;
