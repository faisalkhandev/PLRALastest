import React, { Fragment, useState } from 'react';
import { Typography, Grid, Checkbox,Box,Switch } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer } from '../../../Components/index';
import '../../Styles.css';
import { useGetRatingModelTypesQuery, usePostRatingModelTypesMutation, useUpdateRatingModelTypesMutation } from '../../../Features/API/API';

const rowsData = [
  {
    id: 1,
    name: 'Ahmed Ali',
  },
  {
    id: 2,
    name: 'Abdullah Nazar',
  },
  {
    id: 3,
    name: 'Shehwaiz Ahmed',
  },
];

const columns = [
  {
    field: 'name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return ( <span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },

];

function RatingModelTypes() {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ name: '' });
   // Queries
   const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetRatingModelTypesQuery();
   const [postRatingModelTypes] = usePostRatingModelTypesMutation();
   const [updateRatingModelTypes] = useUpdateRatingModelTypesMutation();
   //Function
  const reset =()=>{
    setFormData({name: ''})
  }
  return (
    <Fragment style={{ position: 'relative', overflowY: 'scroll' }}>
  <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}> Rating Model Types</Typography>
  <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
  <Btn type="reset" outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} onClick={reset} />
    <Btn  type="save" />
  </Box>
    
  <form action="">
  <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4}} >
    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <InputField name="name" label="Name" placeholder="Enter Your Name" type="text" />
    </Grid>
  </Grid>
  </form>
  
  <div style={{ width: '100%', position: 'relative', top: 'calc(15vh - 100px)', bottom: 0 }}>
    <MyTableContainer
      columns={columns}
      data={rowsData}
      isAddNewButton={true}
      customPageSize={10}
      RowFilterWith="id"
    />
  </div>
  </Fragment>
  )
}

export default RatingModelTypes