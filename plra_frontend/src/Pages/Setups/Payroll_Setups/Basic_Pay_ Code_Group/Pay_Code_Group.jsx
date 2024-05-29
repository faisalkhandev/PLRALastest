import { Box, Grid, Switch, Typography } from '@mui/material'
import React, { Fragment, useCallback, useState } from 'react'
import { useTheme } from '@emotion/react';
import { Breadcrumb, Btn, MyTableContainer } from '../../../../Components';
import { Link } from 'react-router-dom';
import Pay_Code_Group_Apply from './Pay_Code_Group_Apply';
import Job from '../../Employee_Setup/Job';


const Pay_Code_Group = () => {
  const theme = useTheme();



  const columns = [
    {
      field: 'basic_pay_code_group',
      headerName: 'Basic Pay Code Group',
      minWidth: 250,
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}  >
        <Breadcrumb title="Pay Code Group" breadcrumbItem="Payroll / Pay Code Group" />
        <Link to="pay_code_group_apply">
          <Btn type="Apply" />
        </Link>
      </Box>
      <MyTableContainer
        columns={columns}
        data={true}
        RowFilterWith="id"
        customPageSize={21}
        minHeight={"calc(100vh - 220px)"}
        onRowClick={true}
      />
    </Fragment>
  )
}

export default Pay_Code_Group
