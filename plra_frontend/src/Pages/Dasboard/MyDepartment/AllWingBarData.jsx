import React, { useState, useEffect } from 'react';
import { Typography, Card, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useTheme } from "@emotion/react";
import { useGetWingQuery } from '../../../Features/API/API';

const AllWingBarData = () => {
    const theme = useTheme();
    const [optionsData, setOptionsData] = useState([]);

    const { data: wingData, error: wingError } = useGetWingQuery();

    console.log("optionsData",optionsData);
    useEffect(() => {
        if (wingData && wingData.results.length > 0) {
            const Wings = wingData.results.map((wing) => ({
                id: wing.w_rec_id,
                name: wing.wing_name
            }));
            setOptionsData(Wings);
        }
    }, [wingData]);

    // Log errors if any
    useEffect(() => {
        if (wingError) console.error('Error fetching Wing Data:', wingError);
    }, [wingError]);

    const chartColors = [
        "rgba(255,174,73,255)",
        "rgba(68,165,194,255)",
        "rgba(122,48,171,255)",
        "rgba(212,75,250,255)"
    ];

    // Map over optionsData to create data structure for the chart
    const chartData = {
        labels: optionsData.map(wing => wing.name),
        datasets: [
            {
                label: 'Wing Count',
                data: optionsData.map(wing => wing.id), 
                backgroundColor: chartColors,
                borderRadius: 5,
                borderWidth: 1,
                barPercentage: 0.9,
                barThickness: 20,
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
                        size: 11,
                    },
                },
            },
            y: {
                grid: {
                    display: false
                },
                max: 10, 
            }
        }
    };

    return (
        <Card sx={{ height:"300px", width: '100%', backgroundColor: '#fff', color: '#000', borderLeft: '2px solid', boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 'light', height: '50px' }}>Wing Data</Typography>
            <Box sx={{ width: 'auto', height: '200px', mt:4 }}>
                <Bar data={chartData} options={chartOptions} />
            </Box>
        </Card>
    );
}

export default AllWingBarData;
