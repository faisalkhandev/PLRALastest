import React from 'react';
import { Typography, Card, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useTheme } from "@mui/material/styles";

const LeaveAnalysisCard = ({ name, count, RecordData }) => {
    const theme = useTheme();
    const chartColors = [
        "rgba(255,174,73,255)",
        "rgba(68,165,194,255)",
        "rgba(122,48,171,255)",
        "rgba(212,75,250,255)"
    ];

    const ShowRecordData = [
        { label: "Approved", value: RecordData?.Approved },
        { label: "Available", value: RecordData?.Available },
        { label: "Balance", value: RecordData?.Balance },
        // { label: "Historical", value: RecordData?.Historical },
    ];

    return (
        <Card sx={{ p: 1, width: '180px', backgroundColor: '#fff', color: '#000', borderLeft: '2px solid', boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 'light', height: '50px' }}>{name} Leave</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 'bold', height: '50px' }}>{count}</Typography>
            </Box>

            <Box sx={{ width: 'auto', height: '200px' }}>
                <Bar
                    data={{
                        labels: ShowRecordData.map((data) => data.label),
                        datasets: [
                            {
                                label: 'Leave',
                                data: ShowRecordData.map((data) => data.value),
                                backgroundColor: chartColors,
                                borderRadius: 5,
                                borderWidth: 1,
                                barPercentage: 0.9,
                                barThickness: 20,
                                categoryPercentage: 0.8,
                                hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)', // Orange
                                hoverBorderColor: 'rgba(255, 159, 64, 1)'
                            }
                        ]
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: false
                            },
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    font: {
                                        size: 11,
                                    },
                                },
                            },
                            y: {
                                grid: {
                                    display: false
                                },
                                max: Math.max(...ShowRecordData.map(data => data.value)) + 10, // Adjust to add padding on top
                                beginAtZero: true,
                            }
                        },
                        layout: {
                            padding: {
                                top: 20 // Add padding to the top
                            }
                        },
                    }}
                />
            </Box>
        </Card>
    );
};

export default LeaveAnalysisCard;
