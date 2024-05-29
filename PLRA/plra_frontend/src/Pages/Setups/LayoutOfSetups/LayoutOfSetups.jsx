import { useTheme } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import React from 'react';

const LayoutOfSetups = () => {
    const theme = useTheme();
    return (
        <Box sx={{
            height: 'calc(100vh - 200px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
        }}>
            <Typography variant="h1" sx={{ color: theme.palette.primary.main, fontWeight: '500' }}>
                SETUPS
            </Typography>
        </Box>
    );
}

export default LayoutOfSetups;
