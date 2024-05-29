import React from 'react'
import { Typography, Box, Grid, Dialog } from "@mui/material";
import { Warning } from '../../Assets/Icons';
import Btn from './Btn';
import { useTheme } from '@emotion/react';


const DialogBox = ({ open, onClose, title, sureClick, closeClick }) => {
    const theme = useTheme();
    return (
        <>
            <Dialog open={open} onClose={onClose} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '500px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center' }}><Warning />{title}</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={sureClick} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                        <Btn type="close" onClick={closeClick} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default DialogBox
