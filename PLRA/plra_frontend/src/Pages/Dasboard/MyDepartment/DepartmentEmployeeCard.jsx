import React, { useEffect, useState } from 'react'
import { defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography, Paper } from '@mui/material'
import { AngleRight } from '../../../Assets/Icons';
import { useTheme } from '@emotion/react';
import { FilterDropDown } from '../../../Components';
import DepartmentDropDownData from './DepartmentDropDownData.jsx'
import {
    useGetCenterQuery, useGetRegionQuery, useGetWingQuery, useGetSubWingQuery,
    useGetDivisionQuery, useGetDistrictQuery, useGetTehsilQuery
} from '../../../Features/API/API';
import { useDashboardCardQuery } from '../../../Features/API/DashboardApi.js'

defaults.maintainAspectRatio = false;
defaults.responsive = true;


const DepartmentEmployeeCard = ({ title, sourceData }) => {
    const [optionsData, setOptionsData] = useState([
        { main: 'Region', subs: [] },
        { main: 'Division', subs: [] },
        { main: 'District', subs: [] },
        { main: 'Tehsil', subs: [] },
        { main: 'Center', subs: [] },
        { main: 'Wing', subs: [] },
        { main: 'SubWing', subs: [] },
    ])
    const [name, setName] = useState('all');
    const [id, setId] = useState(1);
    const [chartData, setChartData] = useState({
        total: 0,
        sourceData: [
            { label: 'Absent', value: 0 },
            { label: 'On Leave', value: 0 }
        ]
    });



    const { data: dashboardData, error: chartError, refetch} = useDashboardCardQuery({ name, id });
    const { data: centerData, error: centerError } = useGetCenterQuery();
    const { data: regionData, error: regionError } = useGetRegionQuery();
    const { data: wingData, error: wingError } = useGetWingQuery();
    const { data: subWingData, error: subWingError } = useGetSubWingQuery();
    const { data: divisionData, error: divisionError } = useGetDivisionQuery();
    const { data: districtData, error: districtError } = useGetDistrictQuery();
    const { data: tehsilData, error: tehsilError } = useGetTehsilQuery();

    useEffect(() => {

        if (tehsilData && tehsilData?.results.length > 0) {
            const tehsil = tehsilData?.results?.map((data) => ({
                id: data.t_rec_id,
                name: data.t_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'Tehsil') {
                    return { ...option, subs: tehsil };
                }
                return option;
            }));
        }

        if (districtData && districtData?.results.length > 0) {
            const district = districtData?.results?.map((data) => ({
                id: data.district_rec_id,
                name: data.district_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'District') {
                    return { ...option, subs: district };
                }
                return option;
            }));
        }

        if (divisionData && divisionData?.results.length > 0) {
            const division = divisionData?.results?.map((data) => ({
                id: data.d_rec_id,
                name: data.division_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'Division') {
                    return { ...option, subs: division };
                }
                return option;
            }));
        }

        if (subWingData && subWingData?.results.length > 0) {
            const subWing = subWingData?.results?.map((data) => ({
                id: data.sw_rec_id,
                name: data.sub_wing_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'SubWing') {
                    return { ...option, subs: subWing };
                }
                return option;
            }));
        }

        if (regionData && regionData?.results.length > 0) {
            const region = regionData?.results?.map((data) => ({
                id: data.r_rec_id,
                name: data.region_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'Region') {
                    return { ...option, subs: region };
                }
                return option;
            }));
        }

        if (centerData && centerData?.results.length > 0) {
            const center = centerData?.results?.map((data) => ({
                id: data.c_rec_id,
                name: data.center_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'Center') {
                    return { ...option, subs: center };
                }
                return option;
            }));
        }

        if (wingData && wingData.results.length > 0) {
            const Wings = wingData?.results?.map((wing) => ({
                id: wing.w_rec_id,
                name: wing.wing_name
            }));

            setOptionsData(prev => prev.map(option => {
                if (option.main === 'Wing') {
                    return { ...option, subs: Wings };
                }
                return option;
            }));
        }


    }, [centerData, regionData, wingData, subWingData, divisionData, districtData, tehsilData]);

    useEffect(() => {
        if (centerError) console.error('Error fetching Center Data:', centerError);
        if (regionError) console.error('Error fetching Region Data:', regionError);
        if (wingError) console.error('Error fetching Wing Data:', wingError);
        if (subWingError) console.error('Error fetching SubWing Data:', subWingError);
        if (divisionError) console.error('Error fetching Division ID Data:', divisionError);
        if (districtError) console.error('Error fetching District ID Data:', districtError);
        if (tehsilError) console.error('Error fetching Tehsil ID Data:', tehsilError);
    }, [centerError, regionError, wingError, subWingError, divisionError, districtError, tehsilError]);

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
        console.log("Selected Option:", selectedOption);
        let name = selectedOption?.name;
        let id = selectedOption?.id;
        refetch({name: id})
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
                    <FilterDropDown options={optionsData} onOptionSelected={handleOptionSelected} NextTitle={title} />
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
    )
}

export default DepartmentEmployeeCard