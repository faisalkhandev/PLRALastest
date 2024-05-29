import { Box, Grid, Switch, Typography } from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer, SimpleDropDown } from '../../../Components';
import { useTheme } from '@emotion/react';
import { PayrollCodeHeader } from '../../../Data/Setup_Data/Setup_Data';

const Payroll_EmployeeForm = () => {
  const theme = useTheme();;
  //FormData
  const [formData, setFormData] = useState({
    employee_no: '', year: '', tax_claim_request_date: '', tex_credit_claim_amount: '', status: ''
    , tax_claim_approval_date: '',
  });

  // Columns
  const columns = [
    {
      field: 'employee_no',
      headerName: 'Employee No',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'year',
      headerName: 'Year',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'tax_claim_request_date',
      headerName: 'Tax Claim Request',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'tex_credit_claim_amount',
      headerName: 'Amount',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'tax_claim_approval_date',
      headerName: 'Tax Claim Approval',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ];


  //Functions

  const handleFileChange = (e) => {
    const fieldName = e.target.name;
    console.log(e.target.name, e.target.file);

    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size / 1024;
      console.log(fileSize);
      if (fileSize <= 1000) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: e.target.files[0],
        }));
        setisattachmentselected(true)
        const selectedFilename = e.target.files[0].name;
        const selectedPath = URL.createObjectURL(e.target.files[0]);
        const fileObject = { url: selectedPath, name: selectedFilename };
        e.target.value = null;
        setSelectedImagePaths(prevPaths => [...prevPaths, fileObject]);
      }
      else {
        toast.error("Image size exceeds 100KB", { position: "top-center", autoClose: 3000 })
      }
    }
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const resetForm = useCallback(() => {
    setFormData({   employee_no: '', year: '', tax_claim_request_date: '', tex_credit_claim_amount: '', status: ''
    , tax_claim_approval_date: '', });
  }, []);

  //Dropdown Options
  const StatusOptions = [
    { value: 1, label: "In Process" },
    { value: 2, label: "Approved" },
  ];

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Tax Credit Claim </Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={true} type="save" />

      </Box>
      {/* Form  */}
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="employee_no" label="Employee No" placeholder="Enter Employee No" type="text" value={formData.employee_no} onChange={handleChange} mandatory />
            <InputField name="year" label="Year" placeholder="Enter Year" type="text" value={formData.year} onChange={handleChange} mandatory />
            <InputField name="tax_claim_request_date" label="Tax Claim Request" placeholder="Enter Tax Claim Request Date" type="date" value={formData.tax_claim_request_date} onChange={handleChange} mandatory />
            <InputField name="attachment" mandatory={true} label="Attachment" onChange={handleFileChange} type="file" fullWidth />

          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <InputField name="tex_credit_claim_amount" label="Amount" placeholder="Enter Tax Credit Claim Amount" type="text" value={formData.tex_credit_claim_amount} onChange={handleChange} mandatory />
            <SimpleDropDown name="status" label="Status" isShowIcon={true} value={formData.status} options={StatusOptions} mandatory onChange={(event) => handleDropDownChange(event, "status")} />
            <InputField name="tax_claim_approval_date" label="Tax Claim Approval" placeholder="Enter Tax Claim Approval Date" type="date" value={formData.tax_claim_approval_date} onChange={handleChange} mandatory />
          </Grid>
        </Grid>
      </form>
      <MyTableContainer
        columns={columns}
        data={true}
        customPageSize={10}
        RowFilterWith="id"
        outerCSS={{ mt: 4 }}
        minHeight={"calc(100vh - 470px)"}
      />
    </Fragment>
  );
}

export default Payroll_EmployeeForm;
