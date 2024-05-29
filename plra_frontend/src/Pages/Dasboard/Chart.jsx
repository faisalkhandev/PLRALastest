import React from 'react'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../Data/Charts/sourceData.json";
import revenueData from "../../Data/Charts/revenueData.json";
import { Box } from '@mui/material'


defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Chart = () => {
    return (
        <div>
            {/* <Box sx={{ width: '120px', height: '200px' }}>
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
            </Box> */}
            {/* <Box sx={{ display: "flex", justifyContent: "center", width: '500px', height: '200px' }}>
                <Line
                    data={{
                        labels: revenueData.map((data) => data.label),
                        datasets: [
                            {
                                label: "Revenue",
                                data: revenueData.map((data) => data.revenue),
                                backgroundColor: "#064FF0",
                                borderColor: "#064FF0",
                            },
                            {
                                label: "Cost",
                                data: revenueData.map((data) => data.cost),
                                backgroundColor: "#FF3030",
                                borderColor: "#FF3030",
                            },
                        ],
                    }}
                    options={{
                        elements: {
                            line: {
                                tension: 0.5,
                            },
                        },
                        plugins: {
                            title: {
                                text: "Monthly Revenue & Cost",
                            },
                        },
                    }}
                />
            </Box> */}
            <Box sx={{ display: "flex", justifyContent: "center", width: '300px', height: '300px' }}>
                <Doughnut
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
                                ],
                                borderColor: [
                                    "rgba(43, 63, 229, 0.8)",
                                    "rgba(250, 192, 19, 0.8)",
                                    "rgba(253, 135, 135, 0.8)",
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
                    }}
                />
            </Box>
        </div>
    )
}

export default Chart