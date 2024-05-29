import React, { Fragment, useState } from 'react';
import { Typography, Grid,Box, Button} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer } from '../../../Components/index';
import '../../Styles.css';

const rows = [
  {
    id: 1,
    Employee: 'Ahmed Ali ',
  },
  {
    id: 2,
    Employee: 'Abdullah Nazar',
  },
  {
    id: 3,
    Employee: 'Mudassir Hussain',
  },
  // Add more data objects as needed
];

const columns = [
  {
    field: 'Employee', headerName: 'Employee Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return ( <span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
];

const Competent_Authority = () => {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ employee: '' });

  return (
    <Fragment>
    <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}> Competent Authority</Typography>
    <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
    <Btn type="reset" outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
    <Btn type="save" />
    </Box>
    <form action="">
    <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4}} >
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <InputField name="employee" label="Employee" placeholder="Select Employee" type="text" isShowIcon={true}   />
      </Grid>
    </Grid>
      </form>
      
    <div style={{ width: '100%', position: 'relative', top: 'calc(15vh - 100px)', bottom: 0 }}>
      <MyTableContainer
        columns={columns}
        data={rows}
        isAddNewButton={true}
        customPageSize={10}
        RowFilterWith="id"
      />
      </div>
    </Fragment>
  )
}

export default Competent_Authority
