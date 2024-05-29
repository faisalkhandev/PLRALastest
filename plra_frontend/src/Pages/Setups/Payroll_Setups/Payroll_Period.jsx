import { Box, Grid, Switch, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { Btn, InputField, MyTableContainer, SimpleDropDown } from '../../../Components'
import { useTheme } from '@emotion/react';

const Payroll_Period = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({ pay_cycle: '', starting_month: '', first_period_start_from: '', year_id: '', });
    const [isFrequency, setIsFrequency] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false);


    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);


    const handleDropDownChange = (event, field) => {
        setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
    };

    const resetForm = useCallback(() => {
        setIsFrequency(false);
        setFormData({ pay_cycle: '', starting_month: '', first_period_start_from: '', year_id: '', });
    }, []);

    const columns = [
        {
            field: 'payroll_period',
            headerName: 'Payroll Period',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'starting_month',
            headerName: 'Starting Month',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'frequency',
            headerName: 'Frequency',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
    ];

    const MonthsList = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Payroll Period</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={true} type="save" />

            </Box>
            {/* Form  */}
            <form action="">
                <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <InputField name="pay_cycle" label="Pay Cycle" placeholder="Enter Pay Cycle" type="text" value={formData.pay_cycle} onChange={handleChange} mandatory />
                        <SimpleDropDown name="starting_month" label="Starting Month" isShowIcon={true} value={formData.starting_month} options={MonthsList} mandatory onChange={(event) => handleDropDownChange(event, "starting_month")} />
                        <InputField name="year_id" label="Year ID" placeholder="Enter Year ID" type="text" value={formData.year_id} onChange={handleChange} mandatory />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <InputField name="first_period_start_from" label="First Period Start" placeholder="Enter Payroll Period" type="date" value={formData.first_period_start_from} onChange={handleChange} mandatory />
                        <div>
                            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 12.2, fontSize: '14px' }} >Status:
                                <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                            </Typography>
                            <Typography sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5, gap: 12.2, fontSize: '14px' }} >
                                <Btn type="Generate Pay Periods"></Btn>
                            </Typography>

                        </div>
                    </Grid>
                </Grid>
            </form>

            <MyTableContainer
                columns={columns}
                data={true}
                isAddNewButton={true}
                RowFilterWith="id"
                onRowClick={true}
                customPageSize={15}
                minHeight={'calc(100vh - 420px) '}
            />
        </Fragment>
    )
}

export default Payroll_Period