import React from 'react'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../Data/Charts/sourceData.json";
import { Box } from '@mui/material'


const BarChart = () => {
    return (
        <div>
            <Box sx={{ width: '200px', height: '200px' }}>
                <Bar
                    data={{
                        labels: sourceData.map((data) => data.label),
                        datasets: [
                            {
                                label: "Count",
                                data: sourceData.map((data) => data.value),
                                backgroundColor: [
                                    "rgba(43, 63, 229, 0.8)",
                                    "rgba(250, 192, 19, 0.8)",
                                    "rgba(253, 135, 135, 0.8)",
                                    "rgba(253, 135, 135, 0.8)"
                                ],
                                borderRadius: 5,
                                barThickness: 20,
                                borderColor: "rgba(0, 0, 0, 0.1)",
                                borderWidth: 1,
                                barPercentage: 0.9,
                                barThickness: 15,
                                categoryPercentage: 0.8,
                                clip: { left: 10, top: false, right: -2, bottom: 0 },
                                grouped: false,
                                hoverBackgroundColor: "rgba(255, 99, 132, 0.8)",
                                hoverBorderColor: "rgba(255, 99, 132, 1)",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                text: "Revenue Source",
                            },
                        },
                    }}
                />
            </Box>
        </div>
    )
}

export default BarChart