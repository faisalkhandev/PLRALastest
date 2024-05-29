import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, DialogBox, HeadingBar, InputField } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import SimpleDropdown from '../../../../Components/Common/SimpleDropDown'
import { useGetFamilyInformationQuery, usePostFamilyInformationMutation, useUpdateFamilyInformationMutation, useDeleteFamilyInformationMutation } from '../../../../Features/API/API.js';
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard';
import { useParams } from 'react-router-dom';
import { showToast } from '../../../../Components/shared/Toast_Card.jsx';
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx';


const Relationship_Single_Dropdown = [{
  id: '1',
  "value": "father",
  "label": "Father"
},
{
  id: '2',
  value: 'mother',
  label: 'Mother'
},
{
  id: '3',
  value: 'sibling',
  label: 'Sibling'
},
{
  id: '4',
  value: 'spouse',
  label: 'Spouse'
},
{
  id: '5',
  value: 'other',
  label: 'Other'
},
]

const Family_Information = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});

  //States
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [formData, setFormData] = useState({
    full_name: null, birth_Date: null, relation: null, is_dependent: false, employee: id
  });
  const [selectRowID, setSelectedRowID] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [disableFields, setfieldsDisable] = useState(false)

  //Queries
  const { data: familyData, isLoading: familyLoaading, isError: familyrefreshError, error: familyqueryError, refetch: familyrefetch } = useGetFamilyInformationQuery(id);
  const [familyUpdate] = useUpdateFamilyInformationMutation();
  const [familyPost] = usePostFamilyInformationMutation();
  const [familyDelete] = useDeleteFamilyInformationMutation();
  //Functions

  useEffect(() => {
    familyrefetch();
  }, [])

  const resetForm = () => {
    setFormErrors({});
    setSelectedRowID(null);
    setIsRowSelected(false);
    setActiveBoxIndex(null);
    setfieldsDisable(false);
    setFormData({
      full_name: "", birth_Date: '', relation: '', is_dependent: false, employee: id
    })
  };

  const handleBoxClick = (record, index) => {
    setIsRowSelected(true)
    setActiveBoxIndex(index);
    setfieldsDisable(true)
    setSelectedRowID(record.fimaly_rec_id)
    setfieldsDisable(true)
    setFormData({
      full_name: record.full_name, birth_Date: record.birth_Date,
      relation: record.relation, is_dependent: record.is_dependent,
      employee: record.employee
    });
  };

  // const UpdateDialogHandler = () => {
  //   if (isRowSelected) {

  //   else { toast.error("Record not selected", { position: "top-center", autoClose: 3000 }) }
  // }
  const handlePostData = async (e) => {
    if (isRowSelected) {
      try {
        const res = await familyUpdate({ selectRowID, updateFamilyInformation: formData });
        if (res?.error && res.error.status) {
          if (res?.error?.status === 422 && res?.error?.data?.code) {
            return (showToast(`${res?.error?.data?.detail}`, "error"));
          }
          if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
            return showToast(`${res?.error?.data?.non_field_errors}`, "error");
          }
          setFormErrors(res?.error)
          return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        } else {
          showToast(`Record updated Successfully`, "success");
          setFormData({ full_name: "", birth_Date: '', relation: '', is_dependent: false, employee: id })
          familyrefetch();
          resetForm();
        }
      }
      catch (err) {
        return showToast(`${err.message}`, "error");
      }
    }
    else {
      try {
        const res = await familyPost(formData);
        if (res?.error && res.error.status) {
          if (res?.error?.status === 422 && res?.error?.data?.code) {
            return (showToast(`${res?.error?.data?.detail}`, "error"));
          }
          if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
            return showToast(`${res?.error?.data?.non_field_errors}`, "error");
          }
          // Handle API errors here
          setFormErrors(res?.error)
          return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        } else {

          showToast(`Record created Successfully`, "success");
          setFormData({
            full_name: "", birth_Date: '', relation: '', is_dependent: false, employee: id
          })
          familyrefetch();
          resetForm();
        }
      }
      catch (err) {
        return showToast(`${err.message}`, "error");
      }
    }
  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleDeleteData = async (e) => {
    try {
      // call api
      const res = await familyDelete({ selectRowID });
      // error handling 
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      // success call 
      showToast(`Record Deleted Successfully`, "success");
      setFormData({
        full_name: "", birth_Date: '', relation: '', is_dependent: false, employee: id
      })
      familyrefetch();
      resetForm();
      setIsRowSelected(false)

    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }

  return (


    <div className='customBox'>
      <Box Box className='headContainer' >
        <Breadcrumb title=" Family Information" breadcrumbItem="Employee / Family Info" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Btn type="new" onClick={resetForm} />
          <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
          {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
          {
            deleteDialog ?
              <DialogBox
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                closeClick={() => setDeleteDialog(false)}
                sureClick={() => { handleDeleteData(); setDeleteDialog(false); }}
                title={"Are you sure you want to delete the record?"}
              /> : ''
          }
        </Box>
      </Box >

      <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
        <Grid item xs={4} md={2}>
          <Box className="form_sidebar">
            {familyData && familyData.results && familyData.results.length > 0 ? (familyData.results.map((record, index) => (
              <Box key={record.id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.full_name}</Typography>
                <Typography variant="body2" color="initial">{record.birth_Date}</Typography>
              </Box>
            ))) : (
              <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add family information</Typography>
            )}
          </Box>

        </Grid>


        <Grid item xs={12} md={7} className="employee_form_border">
          <Grid item xs={12} sx={{ pr: 1, mt: -2 }}><HeadingBar title="Family Form" />
          </Grid>
          <Grid item xs={12} >
            <Grid container columnSpacing={6} sx={{ px: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                <InputField name="full_name" label="Full Name" disabled={disableFields} placeholder="Enter Full Name" type="text" value={formData.full_name} onChange={handleChange} fullWidth innerStyle={{ display: 'flex' }} error={formErrors?.data?.full_name} />
                <InputField name="birth_Date" label="Birth Date" disabled={disableFields} mandatory={true} placeholder="Enter Birth Date" type="date" value={formData.birth_Date} onChange={handleChange} fullWidth error={formErrors?.data?.birth_Date} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                <SimpleDropdown name='relation' placeholder='Select Relationship' label='Relationship' disabled={disableFields} value={formData.relation || ""} onChange={handleChange} options={Relationship_Single_Dropdown} isShowIcon={true} error={formErrors?.data?.relation} helperText={formErrors?.data?.relation} />
                <Grid container columnSpacing={2}>
                  <Grid item xs={6}>
                    <Box className="inputBox" >
                      <Typography sx={{ display: 'flex', marginTop: "3.3px", mr: "11px", fontSize: '14px' }} >Dependent:</Typography>
                      <Switch sx={{ ml: 6.5 }} size="small" disabled={disableFields} checked={formData.is_dependent} onClick={() => { setFormData({ ...formData, is_dependent: !formData.is_dependent }); }} name='active' />
                    </Box>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <EmployeeFormDashboard userId={id} title="Processess" />

        </Grid>
      </Grid>
    </div >

  )
}

export default Family_Information
