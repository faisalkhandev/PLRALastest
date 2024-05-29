import React from 'react';
import { Typography, Card, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import optionsData from '../../../Data/Charts/Employee.json'; // Assuming the correct path
import { AngleRight } from '../../../Assets/Icons'

const PositionCard = () => {
    const theme = useTheme();
    const chartColors = [
        "rgba(255,174,73,255)",
        "rgba(68,165,194,255)",
        "rgba(122,48,171,255)",
        "rgba(212,75,250,255)"
    ];

    const chartData = {
        labels: optionsData.map(data => data.label),
        datasets: [
            {
                label: 'Positions',
                data: optionsData.map(data => data.value),
                backgroundColor: chartColors,
                borderRadius: 5,
                borderWidth: 1,
                barPercentage: 0.9,
                barThickness: 50,
                categoryPercentage: 0.8,
                clip: { left: 10, top: false, right: -2, bottom: 0 },
                hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)', // Orange
                hoverBorderColor: 'rgba(255, 159, 64, 1)'
            }
        ]
    };

    const chartOptions = {
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
                        size: 14,
                    },
                },
            },
            y: {
                grid: {
                    display: false
                },
                beginAtZero: true,
                suggestedMax: Math.max(...optionsData.map(data => data.value)) + 5, // Ensure there is padding above the highest bar
            }
        }
    };

    return (
        <Card sx={{ height: "370px", width: '100%', backgroundColor: '#fff', color: '#000', borderLeft: '2px solid', boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <Typography variant="body1" color="initial" sx={{ width: 'auto', fontWeight: 600, fontSize: '18px' }}>Employe</Typography>
                <Typography variant="body1" color="initial" sx={{ width: 'auto', fontSize: '18px' }}> <span style={{ fontSize: '12px', color: 'gray' }}>Total:</span> 142</Typography>
            </Box>
            <Box sx={{ width: 'auto', height: '200px', mt: 4, p: 2, mx:2 }}>
                <Bar data={chartData} options={chartOptions} />
            </Box>
            <Box sx={{
                width: '95%', height: '12px', borderTop: '2px solid #E0E0E0',
                display: 'flex', justifyContent: 'start', alignItems: 'center',
                mt: 4.4, pt: 2, cursor: 'pointer', pb: 1, mx: 2
            }}>
                <AngleRight /><Typography variant="body1" color="#00838f" fontWeight={600}>See More</Typography>
            </Box>
        </Card>
    );
}

export default PositionCard;
