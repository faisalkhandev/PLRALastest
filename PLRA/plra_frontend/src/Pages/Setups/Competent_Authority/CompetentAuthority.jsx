import React, { Fragment, useEffect, useState } from 'react';
import { Typography, Grid, Box, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, MyTableContainer, SimpleDropDown } from '../../../Components/index';
import '../../Styles.css';
import { useDeleteCompetentAuthorityMutation, useGetCompetentAuthorityQuery, useGetEmpPositionQuery, usePostCompetentAuthorityMutation } from '../../../Features/API/SetupApi';
import { toast } from 'react-toastify';




const CompetentAuthority = () => {
  const theme = useTheme();

  // Queries
  const [PostCompetentAuthority] = usePostCompetentAuthorityMutation();

  const { data, isLoading, refetch } = useGetEmpPositionQuery();

  const positionID = data?.results?.map((position) => ({
    id: position.p_rec_id,
    label: position?.position_id,
    value: position?.p_rec_id
  }));

  const { data: competentData, refetch: competentRefetch } = useGetCompetentAuthorityQuery();

  const competent_Data = competentData?.results?.map((data) => ({
    id: data?.id,
    designation: data?.designation,
    employee_position: data?.employee_position?.position_id
  }));

  const [deleteCompetentAuthority] = useDeleteCompetentAuthorityMutation();

  console.log('positionID: ', positionID)
  console.log('competentData:', competentData)


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

  //functions
  async function handleSaveData(e) {
    e.preventDefault();
    if (formData.designation == '' || formData.employee_position == '') {
      toast.error(
        'Fields should not be empty.',
        {
          position: 'top-center',
          autoClose: 3000
        }
      )
    }
    else {
      try {
        const res = await PostCompetentAuthority(formData)
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something went wrong !!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Rating Type Point create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({ rating_model: '', category: '', type: ' ', max_points: '', api_address: ' ', api: false, });
          competentRefetch();
        }

      } catch (error) {
        toast.error('Error Creating Competent Authorithy.', {
          position: 'top-center',
          autoClose: 3000
        })
      }
    }
  }

  function handleRowClick(event) {
    setSelectedRowID(event?.row?.id)
    setIsRowSelected(true);
    setFormData({
      designation: event?.row?.designation || '',
      employee_position: event?.row?.employee_position || ''
    });
    setSelectedDesignation(event?.row?.designation || null);
    setSelectedPosition(event?.row?.employee_position || null);

  }

  function handleReset(event) {
    setFormData({
      designation: '',
      employee_position: ''
    })
    setSelectedDesignation(null)
    setSelectedPosition(null)
  }

  async function handleDelete() {
    if (selectRowID) {
      try {

        const res = await deleteCompetentAuthority(selectRowID)

        if (res.error) {
          toast.error("Failed to delete Competent Authority.", { position: "top-center", autoClose: 3000 });
        }
        else {
          toast.success("Competent Authority deleted successfully.", { position: "top-center", autoClose: 3000 });
          competentRefetch();
          handleReset();
        }
      }
      catch (error) {
        console.error("Error deleting Competent Authority:", error);
        toast.error("Error deleting Competent Authority.", { position: "top-center", autoClose: 3000 });
      }
    } else {
      toast.error("No Competent Authority selected for deletion.", { position: "top-center", autoClose: 3000 });
    }

    console.log('deleted')
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
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SimpleDropDown
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
            />
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
