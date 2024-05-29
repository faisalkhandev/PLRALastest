import React, { Fragment, useCallback, useState } from 'react'
import { Typography, Box, Grid } from '@mui/material'
import { useTheme } from '@emotion/react'
import { InputField, SimpleDropDown, MyTableContainer, Btn } from '../../../Components/index'


const Payroll_Setup = () => {
  const theme = useTheme();

  //states
  const [formData, setFormData] = useState({
    Create_a_Journal_Entry_Per: "", per_day_salary_factor: "",
  });
  const [journalState, setJournalState] = useState("");

  // functions
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const JournalEntry = [
    {
      id: 1,
      value: 'employee',
      label: 'Employee',
    },
    {
      id: 2,
      value: 'main_account',
      label: 'Main Account',
    }
  ]
  const columns = [
    {
      field: 'Create_a_Journal_Entry_Per',
      headerName: 'Journal Entry',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'per_day_salary_factor',
      headerName: 'Per Day Salary Factor',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ];

  const handleDropDownChange = (event, field) => {
    setJournalState(event.target.value);
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const resetForm = useCallback(() => {
    setFormData({
      Create_a_Journal_Entry_Per: "", per_day_salary_factor: "",
    });
    setJournalState("")

  }, []);

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Payroll Setup</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="save" />
        <Btn type="delete" />
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <SimpleDropDown name="Create_a_Journal_Entry_Per" label="Journal Entry Per" value={journalState} options={JournalEntry} onChange={(event) => handleDropDownChange(event, "pay_method")} type="text" fullWidth />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="per_day_salary_factor" label="Per Day Salary Factor" value={formData.per_day_salary_factor} onChange={handleChange} placeholder="Enter Per Day Salary Factor" type="text" />
          </Grid>
        </Grid>
      </form>
      <MyTableContainer
        columns={columns}
        data={true}
        customPageSize={10}
        RowFilterWith="id"
        outerCSS={{ mt: 4 }}
        minHeight={"calc(100vh - 330px)"}
      />
    </Fragment>
  )
}
export default Payroll_Setup