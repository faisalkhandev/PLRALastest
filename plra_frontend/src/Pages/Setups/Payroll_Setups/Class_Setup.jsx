import { Box, Grid, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { Btn, InputField, MyTableContainer } from '../../../Components'
import { useTheme } from '@emotion/react';

const Class_Setup = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ class_id: '', salary_payable: '', description: '', bonus_payable: '', staff_incentive_payable_Account: '' });
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ class_id: '', salary_payable: '', description: '', bonus_payable: '', staff_incentive_payable_Account: '' });
  }, []);
  const columns = [
    {
      field: 'class_id',
      headerName: 'Class ID ',
      minWidth: 150,
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
      field: 'salary_payable',
      headerName: 'Salary Payable',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'bonus_payable',
      headerName: 'Bonus Payable',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'staff_incentive_payable_Account',
      headerName: 'Staff Incentive Payable Account',
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
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Class Setup</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={true} type="save" />

      </Box>
      {/* Form  */}
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="class_id" label="Class ID" placeholder="Enter Class ID" type="text" value={formData.class_id} onChange={handleChange} mandatory />
            <InputField name="salary_payable" label="Salary Payable Account" placeholder="Enter Salary payable Account" value={formData.salary_payable} mandatory onChange={handleChange} />
            <InputField name="staff_incentive_payable_Account" label="Staff Incentive Payable Account" placeholder="Enter Staff Incentive Paybale Account" type="text" value={formData.staff_incentive_payable_Account} onChange={handleChange} mandatory />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="description" label="Description" placeholder="Enter Description" type="text" value={formData.description} onChange={handleChange} />
            <InputField name="bonus_payable" label="Bonus Payable Account" placeholder="Enter Bonus payable Account" value={formData.bonus_payable} mandatory onChange={handleChange} />
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
        minHeight={'calc(100vh - 430px) '}
      />
    </Fragment>
  )
}

export default Class_Setup






