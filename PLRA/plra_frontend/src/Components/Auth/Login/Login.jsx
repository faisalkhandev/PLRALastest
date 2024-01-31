import React, { useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import Logo from '../../../Assets/png/Logo1.png'
import InputMask from 'react-input-mask';
import { faEye, faEyeSlash } from '../../../Assets/Icons/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@emotion/react';
import { Link } from 'react-router-dom'
import '../../../Pages/Styles.css'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../../../Features/API/Authentication';
import Cookies from 'js-cookie';
 
const Login = ({ onStepChange }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const [loginUser] = useLoginMutation();


  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.username === '' || formData.password === '') {
      toast.error(`Mandatory fields should not be empty.`, { position: 'top-center', autoClose: 3000 });
    } else {
      try {
        const csrftoken = Cookies.get('csrftoken');
        const cnicWithoutDashes = formData.username.replace(/-/g, '');
  
        const data = {
          username: cnicWithoutDashes,
          password: formData.password,
        };
  
        const res = await loginUser({ data, csrftoken });
        if (res.error) {
          if (res.error.status === 400) {
            toast.error('Provide Correct Username and Password!', { position: 'top-center', autoClose: 3000 });
          }
        } else {
          onStepChange(2);
          toast.success('Check Your Email.', { position: 'top-center', autoClose: 3000 });
          setFormData({ username: '', password: '' });
          refetch();
        }
      } catch (err) {
        console.error('Error creating Center:', err, { position: 'top-center', autoClose: 3000 });
      }
    }
  };
  

  return (
    <Box sx={{ with: '100%', height: "100vh", overflow: 'hidden', mt: 0 }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} sx={{ width: "100%", height: "107vh", display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: theme.palette.primary[200] }}>
          <img src={Logo} alt="" style={{ width: "450px" }} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: "100%", height: "107vh", display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', px: 2 }}>
          <Box sx={{ width: "60%", height: "100vh", display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="initial" sx={{ fontWeight: 600, fontSize: '35px', color: theme.palette.primary.main }}>Login to your Account</Typography>
            <Typography variant="body1" color="initial" sx={{ width: "80%", fontSize: "16px", textAlign: 'center', opacity: "0.5" }}>Enter to continue and explore within your grasp</Typography>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 0.3 }}>
              <label htmlFor="" style={{ fontSize: "16px" }}>CNIC</label>
              <InputMask mask="99999-9999999-9" maskChar="" type="text" className="input" placeholder="XXXXX-XXXXXXX-X" style={{ letterSpacing: "px" }} value={username} onChange={(e) => { setUsername(e.target.value); setFormData((prevData) => ({ ...prevData, username: e.target.value })) }} />
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column', gap: 0.3, }}>
              <label htmlFor="" style={{ fontSize: "16px" }}>Password</label>
              <Box sx={{ width: "100%", display: "flex", position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className='input' placeholder='*********' value={password} onChange={(e) => { setPassword(e.target.value); setFormData((prevData) => ({ ...prevData, password: e.target.value })); }} />
                <Box sx={{ position: 'absolute', right: 7, top: 12, cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                  {showPassword ? <FontAwesomeIcon icon={faEye} size={35} /> : <FontAwesomeIcon icon={faEyeSlash} size={35} />}
                </Box>
              </Box>
              <Box sx={{ width: '100%', textAlign: 'right', textDecoration: 'underline', cursor: "pointer", "&:hover": { color: theme.palette.primary.main } }}>
                <Link to='/forgetpassword' style={{ color: `${theme.palette.primary.main}` }}>
                  Forget Password?
                </Link>
              </Box>
            </Box>

            <button className='loginButton' onClick={handleSaveData}>Login</button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Login


