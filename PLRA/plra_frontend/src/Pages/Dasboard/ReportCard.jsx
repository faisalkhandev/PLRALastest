import React from 'react'
import { Box, Typography } from '@mui/material'
import {
    Arrow_trend_up,
    Arrow_trend_down
} from '../../Assets/Icons/index'
import { useTheme } from '@emotion/react'

const ReportCard = ({ analysisFiger, cardTitle, growth }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            width: "100%", minHeight: "80px",
            backgroundColor: theme.palette.white[800],
            borderRadius: "6px",
            boxShadow: "0 0 15px 2px #efefef",
            overflow: 'hidden'
        }}>
            <Box sx={{ p: 2, textAlign: 'center', height:"76px" }}>
                <Typography variant="h5" color="initial" fontWeight={600} >{analysisFiger}</Typography>
                <Typography variant="h6" sx={{ 
                    color: theme.palette.black[600], 
                    display:'flex', alignItems:"center", justifyContent:'center',
                    lineHeight:'16px', ml:{xs: 1.3, md: 2.5},
                    fontSize:{xs: '12px', md:"14px", lg:'16px'}
                    }} >
                    {cardTitle}
                    {
                        growth === '+' ? 
                        <Arrow_trend_up color="#71B66C"/>
                        :
                        <Arrow_trend_down color="#E73737" />
                    }
                    </Typography>
            </Box>
            <Box sx={{
                width: "100%", height: "4px",
                backgroundColor: theme.palette.primary.main
            }}>

            </Box>
        </Box>
    )
}

export default ReportCard
