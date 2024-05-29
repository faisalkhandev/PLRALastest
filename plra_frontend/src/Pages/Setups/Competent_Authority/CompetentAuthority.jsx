import React, { Fragment, useEffect, useState } from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer, SimpleDropDown } from '../../../Components/index';
import '../../Styles.css';
import { useDeleteCompetentAuthorityMutation, useGetCompetentAuthorityQuery, useGetEmpPositionQuery, usePostCompetentAuthorityMutation } from '../../../Features/API/SetupApi';
import { toast } from 'react-toastify';
import { useGetPositionQuery } from '../../../Features/API/API';
import { showToast } from '../../../Components/shared/Toast_Card';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';




const CompetentAuthority = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // Queries
  const [PostCompetentAuthority] = usePostCompetentAuthorityMutation();

  const { data, isLoading, refetch } = useGetEmpPositionQuery();

  const positionID = data?.results?.map((position) => ({
    id: position.p_rec_id,
    label: position?.position_id,
    value: position?.p_rec_id
  }));
  const { data: PositionData, isLoading: Positionloading, isError: PoitionrefreshError, error: PoitionqueryError, Poitionrefetch } = useGetPositionQuery();


  const { data: competentData, refetch: competentRefetch } = useGetCompetentAuthorityQuery();

  const competent_Data = competentData?.results?.map((data) => ({
    id: data?.id,
    designation: data?.designation,
    employee_position: data?.employee_position?.position_id
  }));

  const [deleteCompetentAuthority] = useDeleteCompetentAuthorityMutation();


  const PosHeader = [
    { field: 'position_id', headerName: 'Position ID', minWidth: 300, },
    { field: 'job?.job_title', headerName: 'Job Title', minWidth: 350, valueGetter: (params) => params.row?.job?.job_title || '', },
    { field: 'position_desc', headerName: 'Position Description', minWidth: 400, },
    { field: 'wing', headerName: 'Wing', minWidth: 400, valueGetter: (params) => params.row?.wing?.wing_name || '', },
    { field: 'sub_wing', headerName: 'Sub Wing', minWidth: 400, valueGetter: (params) => params.row?.sub_wing?.sub_wing_name || '', },

  ];

  // States
  const [formData, setFormData] = useState({
    designation: '',
    employee_position: ''
  });
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState('');
  const [adgDialogOpen, setAdgDialogOpen] = useState(false);
  const [dcpDialogOpen, setDcpDialogOpen] = useState(false);
  const [positionName, setpositionName] = useState("");


  //functions
  async function handleSaveData(e) {
    e.preventDefault();
    try {
      const res = await PostCompetentAuthority(formData)
      if (res?.error && res.error.status) {
        setFormErrors(res.error);
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Rating Type Point create successfully`, "success");
        setFormData({ rating_model: '', category: '', type: ' ', max_points: '', api_address: ' ', api: false, });
        competentRefetch();
        setFormErrors({});
      }
    } catch (error) {
      showToast(`Record created Successfully`, "success");
    }
  }

  const adgClickHandler = (selectedRow) => {
    setpositionName(selectedRow.position_desc)
    setFormData((prevData) => ({ ...prevData, employee_position: selectedRow.p_rec_id }))
    setAdgDialogOpen(false);
  }

  function handleRowClick(event) {
    setSelectedRowID(event?.row?.id)
    setIsRowSelected(true);
    console.log("abc", event.row);
    setFormData({
      designation: event?.row?.designation || '',
      employee_position: event?.row?.p_rec_id || ''
    });
    setSelectedDesignation(event?.row?.designation || null);
    setpositionName(event?.row?.employee_position || null)


  }

  function handleReset(event) {
    setFormErrors({});
    setFormData({
      designation: '',
      employee_position: ''
    })
    setpositionName("")

    setSelectedDesignation(null)
    setSelectedPosition(null)
  }

  async function handleDelete() {
    if (selectRowID) {
      try {

        const res = await deleteCompetentAuthority(selectRowID)

        if (res?.error && res.error.status) {
          setFormErrors(res?.error)
          return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        else {
          showToast(`Competent Authority deleted successfully`, "success");
          competentRefetch();
          handleReset();
          setFormErrors()
        }
      }
      catch (error) {
        return showToast(`${error.message}`, "error");
      }
    } else {
      return showToast("No Record Selected", "error");
    }
  }

  const designation = [
    {
      id: 1,
      label: 'DG',
      value: 'DG',
    },
    {
      id: 2,
      label: 'CONCERN OFFICER',
      value: 'CONCERN OFFICER',
    },
    {
      id: 3,
      label: 'HR DIRECTOR',
      value: 'HR DIRECTOR',
    },
    {
      id: 4,
      label: 'HR ADMIN',
      value: 'HR ADMIN',
    },
    {
      id: 5,
      label: 'LEAVE SUPER APPROVAL',
      value: 'LEAVE SUPER APPROVAL',
    },
    {
      id: 6,
      label: 'HR User',
      value: 'HR User',
    },
  ];

  const columns = [
    {
      field: 'designation',
      headerName: 'Designation',
      width: 300,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return <span onClick={onView} className='table_first_column'> {params.value} </span>;
      },
    },
    {
      field: 'employee_position',
      headerName: 'Position',
      width: 300,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return <span onClick={onView} className='table_first_column'> {params.value} </span>;
      },
    },
  ];

  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Competent Authority</Typography>
        <Btn type="reset" onClick={handleReset} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="save" onClick={handleSaveData} />
        <Btn type="delete" onClick={handleDelete} />
      </Box>
      <form action="">
        <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SimpleDropDown
              name='designation'
              label='Designation'
              value={selectedDesignation}
              onChange={(e) => {
                setSelectedDesignation(e.target.value)
                setFormData((preData) => ({
                  ...preData,
                  designation: e.target.value
                }))
              }}

              options={designation}
              placeholder='Select Designation'
              error={formErrors?.data?.designation}
              helperText={formErrors?.data?.designation}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* <SimpleDropDown
              name='positionID'
              label='Position'
              value={selectedPosition || ''}
              onChange={(e) => {
                setSelectedPosition(e.target.value)
                setFormData((preData) => ({
                  ...preData,
                  employee_position: e.target.value,
                }))
              }
              }
              options={positionID || ''}
              placeholder='Select Employee'
            /> */}

            {PositionData && PositionData?.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="employee_position" label="Position" placeholder="Select  Position " value={positionName || ''} type="text" isShowIcon={true} onClick={() => setAdgDialogOpen(true)}   error={formErrors?.data?.employee_position}/>
                <Multi_Dropdown isOpen={adgDialogOpen} onClose={() => setAdgDialogOpen(false)} tableHeader={PosHeader} tableRows={PositionData?.results || PositionData} onSelect={adgClickHandler} RowFilterWith="p_rec_id" />
              </div>
              :
              <InputField name="employee_position" label="Position" placeholder="Select  " value={positionName || ''} type="text" isShowIcon={true} onClick={() => setAdgDialogOpen(true)}  error={formErrors?.data?.employee_position} />
            }
          </Grid>
        </Grid>
      </form>

      <div style={{ width: '100%', position: 'relative', top: 'calc(15vh - 100px)', bottom: 0 }}>
        <MyTableContainer columns={columns} data={competent_Data ? competent_Data : ''} isAddNewButton={true} customPageSize={20} RowFilterWith="id" />
      </div>
    </Fragment>
  );
};

export default CompetentAuthority;
