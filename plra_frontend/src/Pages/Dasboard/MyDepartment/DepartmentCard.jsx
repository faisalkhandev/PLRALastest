import React from 'react'
import { defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography, Paper } from '@mui/material'
import { AngleRight } from '../../../Assets/Icons';
import { useTheme } from '@emotion/react';



defaults.maintainAspectRatio = false;
defaults.responsive = true;


const DepartmentCard = ({ title, sourceData }) => {
    const theme = useTheme();
    return (
        <Box sx={{ height:'375px', borderRadius: '6px', borderLeft: '2px solid', boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Paper elevation={3} sx={{ height:'373px',p: 2, width: "100%" }}>
                <Typography variant="body1" color="initial" sx={{ fontWeight: 600, fontSize: '18px', mb: 3 }}>{title}</Typography>
                <Box sx={{ width: '100%', height: '200px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Doughnut
                        data={{
                            labels: sourceData.map((data) => data.label),
                            datasets: [
                                {
                                    label: "Count",
                                    data: sourceData.map((data) => data.value),
                                    backgroundColor: [
                                        "rgba(255,174,73,255)",
                                        "rgba(68,165,194,255)",
                                        "rgba(122,48,171,255)"
                                    ],
                                    borderColor: [
                                        "rgba(255,174,73,255)",
                                        "rgba(68,165,194,255)",
                                        "rgba(122,48,171,255)"
                                    ],
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: "Revenue Sources",
                                },
                            },
                        }} */}
                    {/* /> */}
                </Box>
                <Box sx={{
                    width: '100%', height: "12px", borderTop: "2px solid #E0E0E0",
                    display: 'flex', justifyContent: 'start', alignItems: 'center',
                    mt: 1, pt: 2, cursor: 'pointer', pb: 1
                }}>
                    <AngleRight /><Typography variant="body1" color="#00838f" fontWeight={600}>See More</Typography>
                </Box>

            </Paper>
        </Box>
    )
}

export default DepartmentCard