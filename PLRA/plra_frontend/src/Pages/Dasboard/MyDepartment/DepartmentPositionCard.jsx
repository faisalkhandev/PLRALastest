import React, { useEffect, useState } from 'react';
import { defaults } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { Button, Menu, MenuItem, TextField, Box, Typography, Paper } from '@mui/material';
import { AngleRight } from '../../../Assets/Icons';
import { useTheme } from '@mui/material/styles';
import {
    useGetCenterQuery, useGetRegionQuery, useGetWingQuery, useGetSubWingQuery,
    useGetDivisionQuery, useGetDistrictQuery, useGetTehsilQuery
} from '../../../Features/API/API';
import { useDashboardCardQuery } from '../../../Features/API/DashboardApi';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const DepartmentCard = ({ title }) => {
    const [optionsData, setOptionsData] = useState([
        { main: 'Region', subs: [] },
        { main: 'Division', subs: [] },
        { main: 'District', subs: [] },
        { main: 'Tehsil', subs: [] },
        { main: 'Center', subs: [] },
        { main: 'Wing', subs: [] },
        { main: 'SubWing', subs: [] },
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedSub, setSelectedSub] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [name, setName] = useState('all');
    const [id, setId] = useState(1);
    const [chartData, setChartData] = useState({
        total: 0,
        sourceData: [
            { label: 'Vacant', value: 0 },
            { label: 'Occupied', value: 0 }
        ]
    });

    const { data: dashboardData, error: chartError, refetch } = useDashboardCardQuery({ name, id });
    const { data: centerData, error: centerError } = useGetCenterQuery();
    const { data: regionData, error: regionError } = useGetRegionQuery();
    const { data: wingData, error: wingError } = useGetWingQuery();
    const { data: subWingData, error: subWingError } = useGetSubWingQuery();
    const { data: divisionData, error: divisionError } = useGetDivisionQuery();
    const { data: districtData, error: districtError } = useGetDistrictQuery();
    const { data: tehsilData, error: tehsilError } = useGetTehsilQuery();

    useEffect(() => {
        const updateOptionsData = (data, mainKey, subsKey, idKey, nameKey) => {
            if (data && data.results.length > 0) {
                const updatedSubs = data.results.map((item) => ({
                    id: item[idKey],
                    name: item[nameKey],
                }));
                setOptionsData((prev) => prev.map((option) => {
                    if (option.main === mainKey) {
                        return { ...option, subs: updatedSubs };
                    }
                    return option;
                }));
            }
        };

        updateOptionsData(tehsilData, 'Tehsil', 'subs', 't_rec_id', 't_name');
        updateOptionsData(districtData, 'District', 'subs', 'district_rec_id', 'district_name');
        updateOptionsData(divisionData, 'Division', 'subs', 'd_rec_id', 'division_name');
        updateOptionsData(subWingData, 'SubWing', 'subs', 'sw_rec_id', 'sub_wing_name');
        updateOptionsData(regionData, 'Region', 'subs', 'r_rec_id', 'region_name');
        updateOptionsData(centerData, 'Center', 'subs', 'c_rec_id', 'center_name');
        updateOptionsData(wingData, 'Wing', 'subs', 'w_rec_id', 'wing_name');
    }, [tehsilData, districtData, divisionData, subWingData, regionData, centerData, wingData]);

    useEffect(() => {
        const errors = [
            { error: centerError, message: 'Center Data' },
            { error: regionError, message: 'Region Data' },
            { error: wingError, message: 'Wing Data' },
            { error: subWingError, message: 'SubWing Data' },
            { error: divisionError, message: 'Division Data' },
            { error: districtError, message: 'District Data' },
            { error: tehsilError, message: 'Tehsil Data' }
        ];
        errors.forEach(({ error, message }) => {
            if (error) console.error(`Error fetching ${message}:`, error);
        });
    }, [centerError, regionError, wingError, subWingError, divisionError, districtError, tehsilError]);

    useEffect(() => {
        if (dashboardData) {
            setChartData({
                total: dashboardData[0]?.total_positions || 0,
                sourceData: [
                    { label: 'Vacant', value: dashboardData[0]?.vacant_positions || 0 },
                    { label: 'Occupied', value: dashboardData[0]?.occupied || 0 }
                ]
            });
        }
    }, [dashboardData]);

    const handleSelect = (option, sub) => {
        setSelectedOption(option.main);
        setSelectedSub(sub.name);
        handleClose();
        setName(sub.name);
        setId(sub.id);
        refetch({ name: sub.name, id: sub.id });
    };

    const theme = useTheme();

    return (
        <Box sx={{ borderRadius: '6px', borderLeft: '2px solid', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderBottom: '2px solid', borderColor: theme.palette.primary.main }}>
            <Paper elevation={3} sx={{ p: 2, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '18px' }}>{title}</Typography>
                    <Typography variant="body1" sx={{ fontSize: '18px' }}>
                        <span style={{ fontSize: '12px', color: 'gray' }}>Total:</span> {chartData.total}
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2, cursor: 'pointer', my: 3 }}>
                    <TextField
                        label="Options"
                        value={selectedOption ? `${selectedOption}: ${selectedSub}` : ''}
                        onClick={handleClick}
                        fullWidth
                        readOnly
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <Button onClick={handleClick}>▼</Button>
                            )
                        }}
                        sx={{ cursor: 'pointer' }}
                    />
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        sx={{
                            '& .MuiMenu-paper': {
                                maxHeight: '300px',
                                overflowY: 'auto',
                            }
                        }}
                    >
                        {optionsData.map((option) => (
                            <div key={option.main}>
                                <MenuItem disabled sx={{ fontSize: '16px', fontWeight: 900, color: '#000' }}>
                                    {option.main}
                                </MenuItem>
                                {option.subs.map((sub) => (
                                    <MenuItem key={sub.id} onClick={() => handleSelect(option, sub)} sx={{ ml: 1, color: '#000' }}>
                                        {sub.name}
                                    </MenuItem>
                                ))}
                            </div>
                        ))}
                    </Menu>
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
                                    display: true,
                                    text: 'Position Status'
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

export default DepartmentCard;
