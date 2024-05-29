import { Box, Grid, Switch, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { Btn, CheckBoxDataGrid, InputField, MyTableContainer, SimpleDropDown } from '../../../../Components'
import { useTheme } from '@emotion/react';


const Pay_Code_Group_Apply = () => {

  const theme = useTheme();
  const [formData, setFormData] = useState({ basic_pay_code_group: '', description: '', earning_code: "" });
  const [isFrequency, setIsFrequency] = useState(false);
  const [disableFields, setfieldsDisable] = useState(false);
  const [enablePayCodeGroup, setEnablePayCodeGroup] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevformData) => ({ ...prevformData, [name]: value }));
  }, []);



  const resetForm = useCallback(() => {
    setFormData({ basic_pay_code_group: '', description: '', earning_code: "" });
    setIsFrequency(false);
  }, []);

  const columns = [
    {
      field: "check",
      headerName: '',
      renderCell: (params) => (
        <input
          type="checkbox"
          onChange={(e) => handleCheckboxChange(params.row.id, e)}
        />
      ),
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
      field: 'earning_code',
      headerName: 'Earning Code',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    
  ];

  const data = [
    {
      id: 1,
      basic_pay_code_group: 'Executives',
      description: "Executives",
      earning_code: 'Regular'
    },
    {
      id: 2,
      basic_pay_code_group: 'Executives',
      description: "Executives",
      earning_code: 'Car Allowance'
    }, 
    {
      id: 2,
      basic_pay_code_group: 'Administrative',
      description: "Administrative",
      earning_code: 'Car Allowance'
    },
  ]

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Pay Code Group Apply</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={true} type="save" />
      </Box>
      {/* Form  */}
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="basic_pay_code_group" label="Basic Pay Code Group" placeholder="Enter Pay Code Group" type="text" value={formData.basic_pay_code_group} onChange={handleChange} mandatory />
            <InputField name="description" label="Description" placeholder="Enter Description" type="text" value={formData.description} onChange={handleChange} />

          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="earning_code" label="Earning Code" placeholder="Enter Earning Codes" type="text" value={formData.earning_code} onChange={handleChange} />
          </Grid>
        </Grid>
      </form>

      {/* <MyTableContainer
                columns={columns}
                data={true}
                isAddNewButton={true}
                RowFilterWith="id"
                onRowClick={true}
                customPageSize={15}
                minHeight={'calc(100vh - 380px) '}
            /> */}
      <CheckBoxDataGrid
        columns={columns}
        data={data}
        tableHeading="Apply"
        isAddNewButton={true}
        customPageSize={20}
        RowFilterWith="id"
        minHeight={'550px'}
        onSelectionModelChange={true}
        onFilterModelChange={true}
      />
    </Fragment>
  )
}

export default Pay_Code_Group_Apply