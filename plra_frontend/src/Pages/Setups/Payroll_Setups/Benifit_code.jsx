import React, { Fragment, useCallback, useState } from 'react'
import { Typography, Box, Grid, Switch } from '@mui/material'
import { useTheme } from '@emotion/react'
import { InputField, TextArea, SimpleDropDown, MyTableContainer, Btn } from '../../../Components/index'


const Benifit_code = () => {
  const theme = useTheme();

  //states
  const [formData, setFormData] = useState({
    Benefit_Code: "", Gratuity: false, Contribution_basis: false,
    Factor: "", Contribution_basis: "", Basic_Earning_code_Group: "", Amount: "", Description: "", Frequency: "", Batch_Entry: ""
  });
  const [isActive, setIsActive] = useState(true);
  const [isGratuity, setIsGratuity] = useState(true);
  const [contributionState, setContributionState] = useState("");
  const [frequency, setFrequency] = useState("");



  // functions
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const columns = [
    {
      field: 'Benefit_Code',
      headerName: 'Benefit Code',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'Contribution_basis',
      headerName: 'Contribution Basis',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'Batch_Entry',
      headerName: 'Batch Entry',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'Amount',
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
      field: 'Description',
      headerName: 'Description',
      minWidth: 250,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ];

  const ContributionBasis = [
    {
      id: 1,
      value: 'Flat amount',
      label: 'Flat amount',
    },
    {
      id: 2,
      value: 'gratuity',
      label: 'Gratuity',
    },
    {
      id: 2,
      value: 'earned leaves',
      label: 'Earned Leaves',
    },
    {
      id: 2,
      value: 'pension',
      label: 'Pension',
    }
  ];

  const handleContribution = (e) => {
    setContributionState(e.target.value);
    setFormData({
      ...prevData, Contribution_basis: e.target.value
    })
  }

  const resetForm = useCallback(() => {
    setFormData({
      Benefit_Code: "", Gratuity: false, Contribution_basis: false,
      Factor: "", Contribution_basis: "", Basic_Earning_code_Group: "", Amount: "", Description: "", Frequency: "", Batch_Entry: ""
    });
    setIsActive(false)
    setIsGratuity(false)
    setFrequency("")
    setContributionState("")

  }, []);
  return (
    <Fragment>

      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Benefit Code</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="save" />
      </Box>

      <form action="">
        <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <InputField name="Benefit_Code" label="Benefit Code" placeholder="Enter Benifit Code" type="text" value={formData.Benefit_Code} onChange={handleChange} />
            <SimpleDropDown name="Contribution_basis" label="Contribution Basis" value={contributionState} options={ContributionBasis} onChange={handleContribution} type="text" fullWidth />
            <InputField name="Amount" label="Amount" placeholder="Enter Amount" type="text" value={formData.Amount} onChange={handleChange} />
            <div>
              <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 8.5, fontSize: '14px' }} >Batch Entry:
                <Switch size="small" checked={isActive} onChange={(e) => {
                  const handleIsActive = !isActive; setIsActive(handleIsActive);
                  setFormData((prevData) => ({ ...prevData, Batch_Entry: handleIsActive }));
                }} name='frequency' />
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            <TextArea Rows={6} name="Description" value={formData.Description} label="Description" placeholder="Write Some Description...." onChange={handleChange} />
          </Grid>
        </Grid>
      </form>



      <MyTableContainer
        columns={columns}
        data={true}
        customPageSize={10}
        RowFilterWith="id"
        outerCSS={{ mt: 4 }}
        minHeight={"calc(100vh - 450px)"}
      />

    </Fragment>
  )
}
export default Benifit_code