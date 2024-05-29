import { Box, Grid, Switch, Typography } from '@mui/material';
import React, { Fragment, useCallback, useState } from 'react';
import { Btn, InputField, Multi_Dropdown, SimpleDropDown } from '../../../Components';
import { useTheme } from '@emotion/react';
import { PayrollCodeHeader } from '../../../Data/Setup_Data/Setup_Data';

const Payroll_EmployeeForm = () => {
  const theme = useTheme();
  const [isFrequency, setIsFrequency] = useState(false);
  const [classCodeData, setclassCodeData] = useState(null);
  const [classCOdeDialog, setclassCodeDialog] = useState(false);
  //FormData
  const [formData, setFormData] = useState({
    Employee_class_id: '', inactive_date: '', termination_date: '', resignation_date: '', last_working_date: ''
    , pay_method: '', account_no: '', inactive_reason: '', termination_reason: '', resignation_reason: '', endofsettlement_date: '', salary_bank: '', branch_code: '',
  });


  //Functions
  const classCodeClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, ppg_level: selectedRow.classcode_id });
    setclassCodeData(selectedRow.ppg_level);
    setclassCodeDialog(false);
  }, [formData]);


  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };

  const resetForm = useCallback(() => {
    setFormData({ Employee_class_id: '' });
  }, []);

  //Dropdown Options
  const PayMethods = [
    { value: 1, label: "Cash" },
    { value: 2, label: "Bank" },

  ];

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Payroll Employee Form </Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={true} type="save" />

      </Box>
      {/* Form  */}
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <div>
              <InputField name="Employee_class_id" label="Class ID" placeholder="Select Employee Class ID" value={classCodeData} isShowIcon={true} onClick={() => setclassCodeDialog(true)} mandatory />
              <Multi_Dropdown isOpen={classCOdeDialog} onClose={() => setclassCodeDialog(false)} tableHeader={PayrollCodeHeader} onSelect={classCodeClickHandler} RowFilterWith={"classcode_id"} MinimumWidth={'350px'} />
            </div>
            <InputField name="inactive_date" label="In Active Date" placeholder="Enter Date" type="date" value={formData.inactive_date} onChange={handleChange} mandatory />
            <InputField name="termination_date" label="Termination Date" placeholder="Enter Termination Date" type="date" value={formData.termination_date} onChange={handleChange} mandatory />
            <InputField name="resignation_date" label="Resignation Date" placeholder="Enter Resignation Date" type="date" value={formData.resignation_date} onChange={handleChange} mandatory />
            <InputField name="last_working_date" label="Last Working Date" placeholder="Enter Last Working Date" type="date" value={formData.last_working_date} onChange={handleChange} mandatory />
            <SimpleDropDown name="pay_method" label="Pay Method" isShowIcon={true} value={formData.pay_method} options={PayMethods} mandatory onChange={(event) => handleDropDownChange(event, "pay_method")} />
            {formData.pay_method === 2 && (
            <InputField name="account_no" label="Account No" placeholder="Enter Account No" type="text" value={formData.account_no} onChange={handleChange} mandatory /> )}
            </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            <Box className="inputBox" sx={{ width: "100%", display: 'flex' }} >
              <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 12.2, fontSize: '14px' }} >Is Active:
                  <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                </Typography>
              </Box>
              <Box sx={{ width: '20%' }} />
              <Box sx={{ width: "40%", display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 12.2, fontSize: '14px' }} >Gratuity:
                  <Switch size="small" checked={isFrequency} onChange={(e) => { const handleSuperUser = !isFrequency; setIsFrequency(handleSuperUser); setFormData((prevData) => ({ ...prevData, frequency: handleSuperUser })); }} name='frequency' />
                </Typography>
              </Box>
            </Box>
            <InputField name="inactive_reason" label="In Active Reason" placeholder="Enter Cause of Inactivity" type="text" value={formData.inactive_reason} onChange={handleChange} mandatory />
            <InputField name="termination_reason" label="Termination Reason" placeholder="Enter Cause of Termination" type="text" value={formData.termination_reason} onChange={handleChange} mandatory />
            <InputField name="resignation_reason" label="Resignation Reason" placeholder="Enter Cause of Resignation" type="text" value={formData.resignation_reason} onChange={handleChange} mandatory />
            <InputField name="endofsettlement_date" label=" Settlement End Date" placeholder="Enter End of Settlement Date" type="date" value={formData.endofsettlement_date} onChange={handleChange} mandatory />

            {/* salarybank lookup field. A separate Setup is required to be made from where the values will come in this lookup. */}
            {formData.pay_method === 2 && ( <>
             <div>
              <InputField name="salary_bank" label="Salary Bank" placeholder="Select Employee Class ID" value={classCodeData} isShowIcon={true} onClick={() => setclassCodeDialog(true)} mandatory />
              <Multi_Dropdown isOpen={classCOdeDialog} onClose={() => setclassCodeDialog(false)} tableHeader={PayrollCodeHeader} onSelect={classCodeClickHandler} RowFilterWith={"classcode_id"} MinimumWidth={'350px'} />
            </div>
            <InputField name="branch_code" label="Branch Code" placeholder="Enter Branch Code" type="text" value={formData.branch_code} onChange={handleChange} mandatory /> </>)}
          </Grid>
        </Grid>
      </form>

      {/* Table if needed */}

      {/* <MyTableContainer
                columns={columns}
                data={true}
                isAddNewButton={true}
                RowFilterWith="id"
                onRowClick={true}
                customPageSize={15}
                minHeight={'calc(100vh - 380px) '}
            /> */}
    </Fragment>
  );
}

export default Payroll_EmployeeForm;
