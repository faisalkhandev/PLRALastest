import React, { Fragment, useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown } from '../../Components/index';
import { MyTableContainer } from '../../Components/index';


const Noc_Process = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    employee: '', noc_type: '', noc_apply_date: '', noc_middle_body_text: '',
  });
  const [selectRowID, setSelectedRowID] = useState(null);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [nocDialog, setNocDialog] = useState(false);
  const [nocData, setNocData] = useState("");


  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({ employee: '', noc_type: '', noc_apply_date: '', noc_middle_body_text: '' }); setNocData("");
  }

  const nocClickHandler = (selectedRow) => {
    setNocData(selectedRow.noc_type);
    setFormData({ ...formData, noc_type: selectedRow.id });
    setNocDialog(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRowClick = (event) => {
    setIsRowSelected(true)
    setFormData({
      noc_type: event.row.id,
      noc_apply_date: event.row.noc_apply_date,
      noc_middle_body_text: event.row.noc_middle_body_text
    })
    setSelectedRowID(event.row.id);
    setNocData(event.row.noc_type)
  };

  const columns = [
    {
      field: 'noc_type', headerName: 'NOC Type', minWidth: 150,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params); };
        return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
      },
    },
    { field: 'noc_apply_date', headerName: 'NOC Apply Date', minWidth: 200, },
    { field: 'noc_middle_body_text', headerName: 'NOC Middle Body Text', minWidth: 250, },


  ];

  const data = [
    {
      id: 1,
      noc_type: "Permanent",
      noc_apply_date: '20/6/2021',
      noc_middle_body_text: "NOC is Issued in 2021",

    },
    {
      id: 2,
      noc_type: "Temporary",
      noc_apply_date: "09/01/2023",
      noc_middle_body_text: "NOC is Issued in 2023",
    },
    {
      id: 3,
      noc_type: "Fixed",
      noc_apply_date: "29/3/2015",
      noc_middle_body_text: "NOC is Issued in 2015",
    }
  ];

  const Noc_Header = [
    {
      field: "id",
      headerName: "ID",
      flex: true
    },
    {
      field: "noc_type",
      headerName: "NOC Type",
      flex: true
    },
  ]

  return (
    <Fragment>
      <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>

        <Typography variant="h4" sx={{ width: '100%', display: 'flex', color: theme.palette.primary.main, fontWeight: 'bold' }}>NOC Process</Typography>
        <Box sx={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 0.1 }}>
          <Btn type="reset" onClick={resetForm} />
          <Btn type="save" />
        </Box>


        <form action="">
          <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4, py: 2 }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data ?
                <div>
                  <InputField name="noc_type" label="NOC Type" placeholder="Select NOC Type" type="text" value={nocData} isShowIcon={true} mandatory={true} onClick={() => setNocDialog(true)} />
                  <Multi_Dropdown isOpen={nocDialog} onClose={() => setNocDialog(false)} tableHeader={Noc_Header} tableRows={data} onSelect={nocClickHandler} RowFilterWith={"id"} />
                </div> :
                <InputField name="noc_type" label="NOC Type" type="text" placeholder="Select NOC Type" value={employeeData} />}
              <InputField name="noc_apply_date" label="NOC Apply Date" type="date" mandatory={true} value={formData.noc_apply_date} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputField name="noc_middle_body_text" label="Middle Body Text" placeholder="Enter NOC Middle Body Text" type="text" value={formData.noc_middle_body_text} multiline={true} onChange={handleChange} />
            </Grid>
          </Grid>
        </form>

        {data && (
          <MyTableContainer
            columns={columns}
            data={data}
            isAddNewButton={true}
            customPageSize={10}
            RowFilterWith="id"
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </Fragment>
  )
}

export default Noc_Process
