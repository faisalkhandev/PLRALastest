import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); 
    };

    return (
        <Box sx={{ width: "100%", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
            <Typography variant="body2" color="initial" sx={{ letterSpacing:'4px',  }}>OOP! PAGE NOT FOUND</Typography>
            <Typography variant="h1" color="initial" sx={{ mt:-4,fontSize: "200px", fontWeight: 900, color:theme.palette.error.main, letterSpacing:"10px", opacity: 0.6 }}>404</Typography>
            <Typography variant="h6" color="initial" sx={{ letterSpacing:'2px', width:"40%", textAlign:'center', fontWeight:600, mt:-2 }}>we are sorry, but page you requested was not found.</Typography>

            <button onClick={handleGoBack} style={{ backgroundColor:'green', padding:'6px 10px', width:'160px', color:"#fff",cursor:'pointer', borderRadius:'4px', marginTop:'10px', marginTop:'50px', fontSize:"18px"}}>
                Go Back
            </button>
        </Box>
    )
}

export default PageNotFound
