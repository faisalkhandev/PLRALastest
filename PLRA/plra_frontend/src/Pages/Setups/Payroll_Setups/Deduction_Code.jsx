import { Box, Grid, Switch, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { Btn, InputField, MyTableContainer, SimpleDropDown } from '../../../Components'
import { useTheme } from '@emotion/react';

const Deduction_Code = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({ Deduction_code: '', description: '', frequency: false, rate_basis: " ", basic_pay_code_group: " ", factor: " ", amount: " ", });
    const [isFrequency, setIsFrequency] = useState(true);
    // const [isBatchEntry, setIsBatchEntry] = useState(true);
    // const [isSalaryEntry, setIsSalaryEntry] = useState(true);
    // const [isBenefit, setIsBenefit] = useState(true);
    // const [isLeave, setIsLeave] = useState(true);
    // const [isLoan, setIsLoan] = useState(true);

    // const [disableFields, setfieldsDisable] = useState(false);
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
        setFormData({ Deduction_code: '', description: '', frequency: false, rate_basis: " ", basic_pay_code_group: " ", factor: " ", amount: " ", Batch_Entry: true });
        setIsFrequency(false);
    }, []);

    const columns = [
        {
            field: 'deduction_code',
            headerName: 'Deduction Code',
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
            field: 'factor',
            headerName: 'Factor',
            minWidth: 150,
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
        { value: "flat_amount", label: "Flat Amount" },
        { value: "factor_of_paycode", label: "Factor of  Paycode" },
        { value: "loan", label: "Loan" },
        { value: "tax", label: "Tax" },
        { value: "absent", label: "Absent" },
    ];

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Deduction Code</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={true} type="save" />
            </Box>
            {/* Form  */}
            <form action="">
                <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                        <InputField name="Deduction_code" label="Deduction code" placeholder="Enter Pay Code" type="text" value={formData.Pay_code} onChange={handleChange} mandatory />
                        <InputField name="description" label="Description" placeholder="Enter Description" type="text" value={formData.description} onChange={handleChange} />
                        <InputField name="basic_pay_code_group" label="Pay Code Group" placeholder="Enter Pay Code Group" type="text" value={formData.basic_pay_code_group} onChange={handleChange} />
                        <div>
                            <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 10, fontSize: '14px' }} >Batch Entry:
                                <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
                        <SimpleDropDown name="rate_basis" label="Rate Basis" isShowIcon={true} value={formData.rate_basis} options={RateBasisOptions} mandatory onChange={(event) => handleDropDownChange(event, "rate_basis")} />
                        <InputField name="amount" label="Amount" placeholder="Enter Amount" type="number" value={formData.amount} onChange={handleChange} />
                        <InputField name="factor" label="Factor" placeholder="Enter Factor" type="number" value={formData.factor} onChange={handleChange} />
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
                minHeight={'calc(100vh - 450px) '}
            />
        </Fragment>
    )
}

export default Deduction_Code