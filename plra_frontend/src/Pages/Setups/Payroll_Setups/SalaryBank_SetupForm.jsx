import { Box, Grid, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Btn, InputField, MyTableContainer } from '../../../Components';
import { useTheme } from '@emotion/react';

const SalaryBank_SetupForm = () => {

    const theme = useTheme();
    const [formData, setFormData] = useState({ bank_id: '', bank_name: '' });
    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({ bank_id: '', bank_name: '' });
    }, []);

    const columns = [

        {
            field: 'bank_id',
            headerName: 'Bank ID',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            minWidth: 250,
            renderCell: (params) => {
                const onView = () => { handleRowClick(params) };
                return (
                    <span onClick={onView} className='table_first_column'>{params.value}</span>
                );
            },
        },
    ];

    return (
        <>
            <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Salary Bank Setup</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={true} type="save" />

            </Box>
            {/* Form  */}
            <form action="">
                <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <InputField name="bank_id" label="Bank ID" placeholder="Enter Bank ID" value={formData.bank_id} mandatory onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField name="bank_name" label="Bank Name" placeholder="Enter Bank Name" type="text" value={formData.bank_name} mandatory onChange={handleChange} />

                    </Grid>
                </Grid>
            </form>

            <MyTableContainer
                columns={columns}
                data={true}
                isAddNewButton={true}
                RowFilterWith="id"
                onRowClick={true}
                customPageSize={14}
                minHeight={'calc(100vh - 335px) '}
            />
        </>
    );
}

export default SalaryBank_SetupForm;
