import { Box, Grid, Switch, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { Btn, InputField, MyTableContainer, SimpleDropDown } from '../../../Components'
import { useTheme } from '@emotion/react';

const Pay_Code = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({ pay_code: '', description: '', frequency: false, rate_basis: " ", basic_pay_code_group: " ", factor: " ", amount: " " });
    const [isFrequency, setIsFrequency] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false);
    const [enablePayCodeGroup, setEnablePayCodeGroup] = useState(false);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prevformData) => ({ ...prevformData, [name]: value }));
    }, []);


    const handleDropDownChange = (event, field) => {
        setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value }));
        if (field === 'rate_basis' && event.target.value === 'percent_of_earnings') {
            setEnablePayCodeGroup(true);
        } else {
            setEnablePayCodeGroup(false);
        }
    };

    const resetForm = useCallback(() => {
        setFormData({ Pay_code: '', description: '', frequency: false, rate_basis: " ", basic_pay_code_group: " ", factor: " ", amount: " " });
        setIsFrequency(false);
    }, []);

    const columns = [
        {
            field: 'pay_code',
            headerName: 'Pay Code',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'description',
            headerName: 'Description',
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
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'rate_basis',
            headerName: 'Rate Basis',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'basic_pay_code_group',
            headerName: 'Pay Code Group',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'amount',
            headerName: 'Amount',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
    ];

    const RateBasisOptions = [
        { value: "hourly", label: "Hourly" },
        { value: "daily", label: "Daily" },
        { value: "loan", label: "Loan" },
        { value: "taxable", label: "Taxable" },
        { value: "batch_entry", label: "Batch Entry" },
        { value: "flat_amount", label: "Flat Amount" },
        { value: "end_of_service", label: "End of Service (EOS)" },
        { value: "yearly_increment", label: "Yearly Increment" },
        { value: "percent_of_earnings", label: "Percent of Earnings" },
        { value: "depends_on_job_level", label: "Depends on Job Level" },
        { value: "additional_position_salary", label: "Additional Position Salary" },
    ];

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Pay Code</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={true} type="save" />
            </Box>
            {/* Form  */}
            <form action="">
                <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <InputField name="pay_code" label="Pay Code" placeholder="Enter Pay Code" type="text" value={formData.Pay_code} onChange={handleChange} mandatory />
                        <InputField name="description" label="Description" placeholder="Enter Description" type="text" value={formData.description} onChange={handleChange} />
                        <div>
                            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 8, fontSize: '14px' }} >Staff Incentive:
                                <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                            </Typography>
                        </div>
                        <Box className="inputBox" sx={{ width: "100%", display: 'flex' }} >
                            <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 13, fontSize: '14px' }} >Taxable:
                                    <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                                </Typography>
                            </Box>
                            <Box sx={{ width: '20%' }} />
                            <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 10.5, fontSize: '14px' }} >Batch Entery:
                                    <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <SimpleDropDown name="rate_basis" label="Rate Basis" isShowIcon={true} value={formData.rate_basis} options={RateBasisOptions} mandatory onChange={(event) => handleDropDownChange(event, "rate_basis")} />
                        {enablePayCodeGroup && (
                            <InputField name="basic_pay_code_group" label="Pay Code Group" placeholder="Enter Pay Code Group" type="text" value={formData.basic_pay_code_group} onChange={handleChange} />
                        )}
                        <InputField name="amount" label="Amount" placeholder="Enter Amount" type="number" value={formData.amount} onChange={handleChange} />
                        <InputField name="factor" label="Factor" placeholder="Enter Factor" type="number" value={formData.factor} onChange={handleChange} />

                        <Box className="inputBox" sx={{ width: "100%", display: 'flex' }} >
                            <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 5.5, fontSize: '14px' }} >Yearly Increment:
                                    <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                                </Typography>
                            </Box>
                            <Box sx={{ width: '20%' }} />
                            <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 15, fontSize: '14px' }} >Bonus:
                                    <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                                </Typography>
                            </Box>
                        </Box>
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
                minHeight={'calc(100vh - 470px) '}
            />
        </Fragment>
    )
}

export default Pay_Code