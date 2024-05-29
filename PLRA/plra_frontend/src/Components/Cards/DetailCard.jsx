import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Correct the import to use MUI's theme

const DetailCard = ({ data }) => {
    const theme = useTheme();
    const {
        Employee_Image,
        Employee_ID,
        Employee_Name,
        Joining_Date,
        Years_of_Service,
        Primary_Position,
        Wing,
        Center_Name
    } = data;

    return (
        <Box sx={{
            width: '100%',
            margin: 'auto',
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            p: 2,
            borderRadius: '8px',
            borderLeft: '2px solid',
            borderBottom: '2px solid',
            borderColor: theme.palette.primary.main
        }}>
            <Box className="employee_form_dashboard_Img" sx={{
                width: 120,
                height: 120,
                overflow: 'hidden',
                objectFit: 'cover',
                borderRadius: '50%', 
                display:"flex",
                justifyContent:'center',
                alignItems:'center'
            }}>
                <img src={Employee_Image || "/static/profile.png"} alt="Profile Employee Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                    <Typography variant="body1" fontSize='16px'>Employee ID:</Typography>
                    <Typography variant="body1" fontSize='16px'>Employee Name:</Typography>
                    <Typography variant="body1" fontSize='16px'>Joining Date:</Typography>
                    <Typography variant="body1" fontSize='16px'>Years of Service:</Typography>
                    <Typography variant="body1" fontSize='16px'>Primary Position:</Typography>
                    <Typography variant="body1" fontSize='16px'>Wing:</Typography>
                    <Typography variant="body1" fontSize='16px'>Center Name:</Typography>
                </Box>
                <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                    <Typography variant="body1" fontSize='16px'>{Employee_ID || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Employee_Name || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Joining_Date || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Years_of_Service || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Primary_Position || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Wing || " -"}</Typography>
                    <Typography variant="body1" fontSize='16px'>{Center_Name || " - "}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default DetailCard;
