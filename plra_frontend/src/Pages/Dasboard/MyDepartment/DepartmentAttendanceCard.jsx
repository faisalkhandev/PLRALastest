import React, { useEffect, useState } from 'react';
import { defaults } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';
import { AngleRight } from '../../../Assets/Icons';
import { useTheme } from '@emotion/react';
import { FilterDropDown } from '../../../Components';
import { useDashboardCardQuery } from '../../../Features/API/DashboardApi.js';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const DepartmentAttendanceCard = ({ title }) => {
    const [name, setName] = useState('all');
    const [id, setId] = useState(1);
    const [chartData, setChartData] = useState({
        total: 0,
        sourceData: [
            { label: 'Absent', value: 0 },
            { label: 'On Leave', value: 0 }
        ]
    });

    const { data: dashboardData, error: dashboardError, refetch: dashboardRefetch } = useDashboardCardQuery({ name, id });

    useEffect(() => {
        if (dashboardData) {
            setChartData({
                total: dashboardData[0]?.total_employees || 0,
                sourceData: [
                    { label: 'Absent', value: dashboardData[0]?.absent_employees || 0 },
                    { label: 'On Leave', value: dashboardData[0]?.employees_on_leave || 0 }
                ]
            });
        }
    }, [dashboardData]);
    

    const handleOptionSelected = (selectedOption) => {
        let selectedName = selectedOption?.main || 'all';
        let selectedId = selectedOption?.id || 1;
        setName(selectedName);
        setId(selectedId);
        dashboardRefetch({ name: selectedName, id: selectedId });
    };

    const theme = useTheme();
    return (
        <Box sx={{ borderRadius: '6px', borderLeft: '2px solid', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" color="initial" sx={{ width: 'auto', fontWeight: 600, fontSize: '18px' }}>{title}</Typography>
                    <Typography variant="body1" color="initial" sx={{ width: 'auto', fontSize: '18px' }}> <span style={{ fontSize: '12px', color: 'gray' }}>Total:</span> {chartData.total}</Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2, cursor: 'pointer', my: 3 }}>
                    <FilterDropDown onOptionSelected={handleOptionSelected} NextTitle={title} />
                </Box>
                <Box sx={{ width: '100%', height: '200px', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Doughnut
                        data={{
                            labels: chartData.sourceData.map(data => data.label),
                            datasets: [
                                {
                                    label: 'Count',
                                    data: chartData.sourceData.map(data => data.value),
                                    backgroundColor: [
                                        'rgba(255,174,73,255)',
                                        'rgba(68,165,194,255)',
                                        'rgba(122,48,171,255)'
                                    ],
                                    borderColor: [
                                        'rgba(255,174,73,255)',
                                        'rgba(68,165,194,255)',
                                        'rgba(122,48,171,255)'
                                    ],
                                },
                            ],
                        }}
                        options={{
                            plugins: {
                                title: {
                                    text: 'Revenue Sources',
                                },
                            },
                        }}
                    />
                </Box>
                <Box sx={{
                    width: '100%', height: '12px', borderTop: '2px solid #E0E0E0',
                    display: 'flex', justifyContent: 'start', alignItems: 'center',
                    mt: 1, pt: 2, cursor: 'pointer', pb: 1
                }}>
                    <AngleRight /><Typography variant="body1" color="#00838f" fontWeight={600}>See More</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default DepartmentAttendanceCard;
