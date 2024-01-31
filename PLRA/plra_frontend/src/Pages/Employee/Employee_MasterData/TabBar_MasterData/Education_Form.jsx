import React, { Fragment, useState } from 'react'
import { Box, Typography, Grid, Dialog, Grow } from '@mui/material'
import { Btn, HeadingBar, InputField, Multi_Dropdown } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import { EducationLevelHeader, CountryHeader } from "../../../../Data/Setup_Data/Setup_Data";
import SimpleDropdown from '../../../../Components/Common/SimpleDropDown'
import { useGetEducationQuery, useGetCountryQuery, useUpdateEducationMutation, useGetLevelOfEducationQuery, usePostEducationMutation, useDeleteEducationMutation } from '../../../../Features/API/API.js'
import { toast } from 'react-toastify'
import { Warning } from '../../../../Assets/Icons/index.jsx'

import EmployeeFormDashboard from './../EmployeeDashboard/EmployeeFormDashboard';
import { useParams } from 'react-router-dom'



const Education = () => {
  const theme = useTheme();
  const { id } = useParams();


  //states
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [formData, setFormData] = useState({
    education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
    grade: "", scale: "", level_of_education: "", institution_country: "", employee: id
  });
  const [educationLevelDialog, setEducationLevelDialog] = useState(false);
  const [employeeData, setEmployeeData] = useState("");
  const [educationLevelData, setEducationLevelData] = useState("");
  const [institution, setInstitution] = useState("");
  const [countryDialog, setCountryDialog] = useState(false);
  const [countryData, setCountryData] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [disableFields, setfieldsDisable] = useState(false)
  //Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEducationQuery(id);
  const [updateEducation] = useUpdateEducationMutation();
  const [postEducation] = usePostEducationMutation()
  const { data: education_level_data, isLoading: education_level_loading, isError: education_level_refreshError, error: education_level_queryError, education_level_refetch } = useGetLevelOfEducationQuery();
  const { data: country_data, isLoading: country_loading, isError: country_refreshError, error: country_queryError, country_refetch } = useGetCountryQuery();
  const [deleteEducation] = useDeleteEducationMutation();
  //Functions

  const resetForm = () => {
    setCountryData(''), setEducationLevelData(''), setIsRowSelected(false);
    setFormData({
      education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
      grade: "", scale: "", level_of_education: '', institution_country: "", employee: id
    });
  };

  //Education Level Dialog Click Listeners

  const educationLevelClickHandler = (selectedRow) => {
    setEducationLevelData(selectedRow.description)
    setFormData({ ...formData, level_of_education: selectedRow.level_of_education_rec_id });
    setEducationLevelDialog(false);
    console.log("EducationLevel", formData.level_of_education)

  };

  const countriesClickHandler = (selectedRow) => {
    setCountryData(selectedRow.country_name)
    setFormData({ ...formData, institution_country: selectedRow.country_rec_id, });
    setCountryDialog(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(() => ({ ...formData, [name]: value }));
  };

  const handleBoxClick = (record, index) => {
    setIsRowSelected(true);
    setActiveBoxIndex(index);
    setFormData({
      ...formData,
      employee: record.employee,
      education: record.education,
      major_subject: record.major_subject,
      institution_name: record.institution_name,
      education_start_date: record.education_start_date,
      education_end_date: record.education_end_date,
      grade: record.grade,
      scale: record.scale,
      level_of_education: record.level_of_education.level_of_education_rec_id,
      institution_country: record.institution_country.country_rec_id,
    });
    setCountryData(record.institution_country.country_name);
    setEducationLevelData(record.level_of_education.description);
    setSelectedRowID(record.education_rec_id);
    setfieldsDisable(true)
  };

  const handlePostData = async (e) => {
    if (isRowSelected) {

      try {
        const res = await updateEducation({ selectRowID, educationData: formData });

        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist.", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Records Updated successfully.", { position: "top-center", autoClose: 3000 });
          setFormData({
            education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
            grade: "", scale: "", employee: id, level_of_education: "", institution_country: ""
          }); setEducationLevelData(""); setCountryData("")
          setIsRowSelected(false)
          setfieldsDisable(false)
          refetch();

        }
      } catch (err) {
        console.error('Error Deleting Record:', err);
        toast.error(err.message, { position: "top-center", autoClose: 3000 });
      }
    }
    else {

      if (formData.education == '' || formData.major_subject == '' || formData.institution_name == '' || formData.education_start_date == '' || formData.education_end_date == '' ||
        formData.grade == '' || formData.scale == '' || formData.level_of_education == '' || formData.institution_country == ''
      ) {
        toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 })
      }
      else {
        try {
          const res = await postEducation(formData);
          if (res.error) {
            if (res.error.status === 400) { toast.error("Record not created.", { position: "top-center", autoClose: 3000 }) }
            else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
          } else {
            toast.success("Records created successfully.", { position: "top-center", autoClose: 3000 });
            setFormData({
              education: "", major_subject: "", institution_name: "", education_start_date: null, education_end_date: null,
              grade: "", scale: "", employee: id, level_of_education: '', institution_country: ""
            }); setEducationLevelData(""); setCountryData("")
            refetch();
          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
  }


  // const handleUpdateData = async (e) => {
  //   try {
  //     if (isRowSelected) {

  //       const res = await updateEducation({ selectRowID, educationData: formData });

  //       if (res.error) {
  //         if (res.error.status === 400) { toast.error("ID already exist.", { position: "top-center", autoClose: 3000 }) }
  //         else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
  //       } else {
  //         toast.success("Records Updated successfully.", { position: "top-center", autoClose: 3000 });
  //         setFormData({
  //           education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
  //           grade: "", scale: "", employee: id, level_of_education: "", institution_country: ""
  //         }); setEducationLevelData(""); setCountryData("")
  //         setIsRowSelected(false)
  //         refetch();

  //       }
  //     }
  //     else {

  //       toast.error(`Record not selected.`, { position: "top-center", autoClose: 3000 })
  //     }
  //   }

  //   catch (err) {
  //     console.error('Error updating Leave Type:', err);
  //   }
  // };

  const UpdateDialogHandler = () => {
    if (isRowSelected) {
      setEditDialog(true)
    }
    else {
      toast.error("Record not selected", { position: "top-center", autoClose: 3000 })
    }
  }

  const handleDeleteData = async (e) => {
    try {
      // call api
      const res = await deleteEducation({ selectRowID });
      // error handling 
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // success call 
      toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({
        education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
        grade: "", scale: "", employee: id, level_of_education: null, institution_country: ""
      }); setEducationLevelData(""); setCountryData("")
      refetch();
      setIsRowSelected(false)
    } catch (err) {
      console.error('Error Deleting Record:', err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }
  }


  return (

    <div className='customBox'>
      <Box className='headContainer'>
        <Breadcrumb title="Education" breadcrumbItem="Employee / Personal Document" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Btn type="new" onClick={resetForm} />
          <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
          {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
        </Box>
      </Box>

      <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
        <Grid item xs={4} md={2}>
          <Box className="form_sidebar">
            {data && data.results && data.results.length > 0 ? (data.results.map((record, index) => (
              <Box key={record.id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.education}</Typography>
                <Typography variant="body2" color="initial">{record.major_subject}</Typography>
              </Box>
            ))) : (
              <Box sx={{ width: '100%' }}>
                <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Education</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={7} className="employee_form_border">
          <Grid item xs={12} ><HeadingBar title="Education Information" /></Grid>
          <Grid item xs={12} >
            <Grid container columnSpacing={6} sx={{ px: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>

                <InputField name="education" label="Education" mandatory={true} disabled={disableFields} placeholder="Enter Education" value={formData.education} type="text" onChange={handleChange} fullWidth />
                {education_level_data && education_level_data.results ?
                  <div>
                    <InputField name="level_of_education" disabled={disableFields} label="Education Level" Mini placeholder="Select Education Level" mandatory={true} value={educationLevelData || ""} isShowIcon={true} onClick={() => setEducationLevelDialog(true)} />
                    <Multi_Dropdown RowFilterWith={"level_of_education_rec_id"} isOpen={educationLevelDialog} onClose={() => setEducationLevelDialog(false)} MinimumWidth={"500px"} tableHeader={EducationLevelHeader} tableRows={education_level_data.results} onSelect={educationLevelClickHandler} />
                  </div> : <InputField name="employee" label="Employee" placeholder="Select Employee" value={employeeData} mandatory={true} isShowIcon={true} />}

                {country_data && country_data.results ?
                  <div>
                    <InputField name="institution_country" disabled={disableFields} label="Firm Country" minWidth={500} placeholder="Select Institution Country" mandatory={true} value={countryData} isShowIcon={true} onClick={() => { setCountryDialog(true); }} />
                    <Multi_Dropdown RowFilterWith={"country_rec_id"} isOpen={countryDialog} onClose={() => setCountryDialog(false)} MinimumWidth={"500px"} tableHeader={CountryHeader} tableRows={country_data.results} onSelect={countriesClickHandler} />
                  </div> : <InputField name="institution_country" disabled={disableFields} label="Institution Country" placeholder="Select Institution Country" mandatory={true} value={countryData} isShowIcon={true} onClick={() => { setCountryDialog(true); }} />}
                <InputField name="grade" label="Grade" mandatory={true} disabled={disableFields} placeholder="Enter Grade" type="text" value={formData.grade} fullWidth onChange={handleChange} />

              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                <InputField name="major_subject" disabled={disableFields} label="Major Subject" placeholder="Enter Major Subject" type="text" value={formData.major_subject} mandatory={true} onChange={handleChange} fullWidth />
                <InputField name="institution_name" disabled={disableFields} label="Firm Name" placeholder="Enter Institution Name" type="text" value={formData.institution_name} mandatory={true} onChange={handleChange} fullWidth />
                <InputField name="scale" label="Scale" disabled={disableFields} placeholder="Enter Scale" mandatory={true} type="number" value={formData.scale} fullWidth onChange={handleChange} />
              </Grid>
            </Grid>

            <Grid item xs={12}><HeadingBar title="Duration" /></Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Grid container columnSpacing={6} sx={{ px: 2 }}>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >

                  <InputField name="education_start_date" disabled={disableFields} mandatory={true} label="Start Date" placeholder="Education Start Date" value={formData.education_start_date} type="date" onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                  <InputField name="education_end_date" mandatory={true} disabled={disableFields} label="End Date" placeholder="Enter Education End Date" value={formData.education_end_date} type="date" onChange={handleChange} fullWidth />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <EmployeeFormDashboard />
        </Grid>
      </Grid>


      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: '2px solid ${theme.palette.primary.light}', borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: '2px solid ${theme.palette.error.light}', borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </div >

  )
};

export default Education

