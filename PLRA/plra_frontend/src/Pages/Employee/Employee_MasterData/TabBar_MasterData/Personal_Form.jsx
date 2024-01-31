import React, { Fragment, useState, useEffect, useLayoutEffect } from "react";
import { Box, Typography, Grid, Switch } from "@mui/material";
import { Btn, InputField, Multi_Dropdown, CheckBoxField, HeadingBar } from "../../../../Components";
import SimpleDropdown from "../../../../Components/Common/SimpleDropDown";
import Breadcrumb from "../../../../Components/Common/BreadCrumb";
import { useTheme } from '@emotion/react'
import { useGetCityQuery, useGetCountryQuery, useGetPositionAssignmentQuery } from '../../../../Features/API/API.js';
import { useGetPersonalInformationQuery, useUpdatePersonalInformationMutation, usePostPersonalInformationMutation } from '../../../../Features/API/API.js';
import { toast } from 'react-toastify'
import { CityHeader, CountryHeader } from '../../../../Data/Setup_Data/Setup_Data'
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard";
import { useParams } from "react-router-dom";
import { useGetContactInformationQuery, useGetFamilyInformationQuery } from "../../../../Features/API/EmployeeApi";




const Marital_Status_Single_Dropdown = [{
  id: '1',
  value: 'single',
  label: 'Single'
},
{
  id: '2',
  value: 'married',
  label: 'Married'
},
];

const Religion_Single_Dropdown = [{
  id: '1',
  value: 'islam',
  label: 'Islam'
},
{
  id: '2',
  value: 'christianity',
  label: 'Christianity'
},
{
  id: '3',
  value: 'hinduism',
  label: 'Hinduism'
},
{
  id: '4',
  value: 'buddhism',
  label: 'Buddhism'
},
{
  id: '5',
  value: 'judaism',
  label: 'Judaism'
},

{
  id: '6',
  value: 'other',
  label: 'Other'
},
]

const Gender_Single_Dropdown = [{
  id: '1',
  value: 'male',
  label: 'Male'
},
{
  id: '2',
  value: 'female',
  label: 'Female'
},
{
  id: '3',
  value: 'other',
  label: 'Other'
},
];

const Languages_Single_Dropdown = [
  {
    id: '1',
    value: 'english',
    label: 'English'
  },
  {
    id: '3',
    value: 'french',
    label: 'French'
  },
  {
    id: '4',
    value: 'german',
    label: 'German'
  },
  {
    id: '5',
    value: 'urdu',
    label: 'Urdu'
  },
  {
    id: '6',
    value: 'japanese',
    label: 'Japanese'
  },
  {
    id: '7',
    value: 'arabic',
    label: 'Arabic'
  },
  {
    id: '8',
    value: 'russian',
    label: 'Russian'
  },]

const Personal_Information = () => {
  const theme = useTheme();
  const { id } = useParams();
  //Queries
  const { data: personalData, isLoading: personalloading, isError: personalrefreshError, error: personalqueryError, refetch } = useGetPersonalInformationQuery(id);
  const { data: cityData, isLoading: cityloading, isError: cityrefreshError, error: cityqueryError, cityrefetch } = useGetCityQuery();
  const { data: countryData, isLoading: countryloading, isError: countryrefreshError, error: countryqueryError, countryrefetch } = useGetCountryQuery();
  const [EmployeeUpdate] = useUpdatePersonalInformationMutation();
  const [CreateEmployee] = usePostPersonalInformationMutation();
  //States
  const [formData, setFormData] = useState({
    employee: parseInt(id), marital_status: '', employee: '', no_of_dependents: '', religion: '', domicel: "",
    gender: '', birth_date: '', blood_group: '', age: '', pastport_number: '', bank_name: '', account_number: '', native_language: '', nationality: '',
    birth_city: '', eobi: '', weight: '', height: '', any_disabilities: false,
  });
  const [isActive, setIsActive] = useState(formData.any_disabilities);
  const [dialogStates, setDialogStates] = useState({ domicileDialog: false, birthCityDialog: false, nationalityDialog: false })
  const [States, setStates] = useState({ domicile: "", birthCity: "", nationality: "" })
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [disableFields, setfieldsDisable] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  //Functions
  useLayoutEffect(() => {
    if (personalData && personalData.results && personalData.results.length > 0) {
      const {
        p_i_id,
        age,
        birth_city,
        birth_date,
        date_of_superannutation,
        deceased_date,
        any_disabilities,
        disability_note,
        domicel,
        employee,
        eobi_number,
        marital_status,
        no_of_dependents,
        martial_status_date,
        religion,
        gender,
        native_language,
        pastport_number,
        weight,
        height,
        nationality
      } = personalData?.results[0];
      setFormData({
        employee: id, marital_status: marital_status, martial_status_date: martial_status_date, employee: employee, no_of_dependents: no_of_dependents, religion: religion, domicel: domicel.c_rec_id,
        gender: gender, birth_date: birth_date, age: age, pastport_number: pastport_number, native_language: native_language, nationality: nationality.country_rec_id, any_disabilities: any_disabilities,
        birth_city: birth_city.c_rec_id, eobi_number: eobi_number, weight: weight, height: height, disability_note: disability_note, date_of_superannutation: date_of_superannutation, deceased_date: deceased_date
      })
      setfieldsDisable(true)
      setStates({
        ...States,

        nationality: nationality && nationality.country_name ? nationality.country_name : "",
        birthCity: birth_city && birth_city.city_name ? birth_city.city_name : "",
        domicile: domicel && domicel.city_name ? domicel.city_name : "",
      })
      setSelectedRowID(p_i_id)
    }
  }, [personalData])

  useEffect(() => {


    refetch()
  }, [])

  const handleAddPersonalInformation = async (e) => {
    e.preventDefault();
    setFormData((prevData) => ({ ...prevData, employee: parseInt(id) }));


    if (!formData.marital_status || !formData.no_of_dependents || !formData.religion || !formData.domicel || !formData.gender || !formData.birth_date || !formData.age || !formData.nationality || !formData.birth_city) {
      return toast.error("Mandatory fields should not be empty.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    try {
      const res = await CreateEmployee(formData);
      if (res.error) {
        if (res.error.status >= 400 || res.error.status <= 500) {
          toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
        }
      }
      else {
        toast.success("Employee personal Information  Created successfully.", { position: "top-center", autoClose: 3000 });

      }
    } catch (err) {
      console.error('Error updating Employee Personal Information:', err);
    }

  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  //Update 
  const handleUpdateData = async (e) => {
    try {
      const res = await EmployeeUpdate({ selectRowID, updateEmployeeData: formData });
      if (res.error) {
        if (res.error.status === 400) { toast.error("Record not updated.", { position: "top-center", autoClose: 3000 }) }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Record updated.", { position: "top-center", autoClose: 3000 });
        setFormData({
          marital_status: '', martial_status_date: '', employee: '', dependents: '', religion: '',
          gender: '', birth_date: '', blood_group: '', age: '', pastport_number: '', bank_name: '', account_number: '', native_language: '', nationality: '',
          birth_city: '', eobi: '', weight: '', height: '', any_disabilities: '', disability_note: '', date_of_superannutation: '', deceased_date: ''
        })
        setfieldsDisable(false)
        setStates({
          ...States,
          domicile: "", birthCity: "", nationality: ""
        });
        refetch();

      }
    }
    catch (err) {
      console.log(err);
    }
  }
  const DomicileClickHandler = (selectedRow) => {
    setFormData({ ...formData, domicel: selectedRow.c_rec_id })
    setStates({ ...States, domicile: selectedRow.city_name })
    setDialogStates({ ...dialogStates, domicileDialog: false })
  }
  const NationalityClickHandler = (selectedRow) => {
    setFormData({ ...formData, nationality: selectedRow.country_rec_id })
    setStates({ ...States, nationality: selectedRow.country_name })
    setDialogStates({ ...dialogStates, nationalityDialog: false })
  }
  const BirthCityClickhandler = (selectedRow) => {
    setFormData({ ...formData, birth_city: selectedRow.c_rec_id })
    setStates({ ...States, birthCity: selectedRow.city_name })
    setDialogStates({ ...dialogStates, birthCityDialog: false })
  }

  return (
    <div className="customBox">
      <Box className="headContainer">
        <Breadcrumb
          title="Personal Information"
          breadcrumbItem="Employee / Personal Information"
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : personalData ? personalData.count === 0 ? handleAddPersonalInformation : handleUpdateData : ""} />

        </Box>
      </Box>

      <form action="" className="form">
        <Grid
          container
          columnSpacing={1}
          sx={{ height: "calc(100vh - 280px)", mt: "-30px" }}
        >
          <Grid item xs={12} md={9} className="employee_form_border">
            <Box sx={{ height: "calc(100vh - 280px)", overflowY: "scroll" }}>
              <Grid container columnSpacing={5} sx={{ pr: 1, mt: -2 }}>
                <Grid item xs={12}  >
                  <HeadingBar title="Personal Information" />
                </Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <SimpleDropdown name="gender" label="Gender" disabled={disableFields} type="text" value={formData.gender || ""} isShowIcon={true} options={Gender_Single_Dropdown} onChange={handleChange} fullWidth mandatory={true} />
                      <SimpleDropdown name='marital_status' mandatory={true} disabled={disableFields} label='Marital Status' value={formData.marital_status || ""} onChange={handleChange} options={Marital_Status_Single_Dropdown} isShowIcon={true} />
                      {formData.marital_status === 'married' && (
                        <InputField name="martial_status_date" disabled={disableFields} mandatory={true} label="Marital Date" type="date" value={formData.martial_status_date || ''} onChange={handleChange} fullWidth />
                      )}
                      <InputField name="no_of_dependents" disabled={disableFields} mandatory={true} label="Dependents" type="number" value={formData.no_of_dependents || ""} onChange={handleChange} fullWidth />
                      <SimpleDropdown name='religion' disabled={disableFields} mandatory={true} label='Religion' value={formData.religion || ""} onChange={handleChange} options={Religion_Single_Dropdown} isShowIcon={true} />
                      <InputField name="birth_date" disabled={disableFields} mandatory={true} label="Birth Date" type="date" value={formData.birth_date} onChange={handleChange} fullWidth />
                      <InputField name="age" label="Age" disabled={disableFields} mandatory={true} type="text" value={formData.age || ""} onChange={handleChange} fullWidth />
                      <SimpleDropdown name='native_language' disabled={disableFields} label='Native Language' value={formData.native_language} onChange={handleChange} options={Languages_Single_Dropdown} isShowIcon={true} />
                      {countryData && countryData.results ?
                        <div>
                          <InputField name='nationality' disabled={disableFields} mandatory={true} label='Nationality' value={States.nationality} onClick={() => { setDialogStates({ ...dialogStates, nationalityDialog: true }) }} isShowIcon={true} />
                          <Multi_Dropdown isOpen={dialogStates.nationalityDialog} onClose={() => setDialogStates({ ...dialogStates, nationalityDialog: false })} MinimumWidth={'600px'} tableRows={countryData.results} tableHeader={CountryHeader} onSelect={NationalityClickHandler} RowFilterWith='country_rec_id' />
                        </div> :
                        <InputField name='nationality' disabled={disableFields} mandatory={true} value={States.nationality} label='Nationality' isShowIcon={true} />}
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>

                      {cityData && cityData.results ?
                        <div>
                          <InputField name='birth_city' disabled={disableFields} label='Birth City' mandatory={true} value={States.birthCity} onClick={() => { setDialogStates({ ...dialogStates, birthCityDialog: true }) }} isShowIcon={true} />
                          <Multi_Dropdown isOpen={dialogStates.birthCityDialog} onClose={() => setDialogStates({ ...dialogStates, birthCityDialog: false })} MinimumWidth={'600px'} tableRows={cityData.results} tableHeader={CityHeader} onSelect={BirthCityClickhandler} RowFilterWith='c_rec_id' />
                        </div> :
                        <InputField name='birth_city' disabled={disableFields} label='Birth City' mandatory={true} value={States.birthCity} isShowIcon={true} />}
                      {cityData && cityData.results ?
                        <div>
                          <InputField name='domicel' disabled={disableFields} mandatory={true} label='Domicile' value={States.domicile || ""} isShowIcon={true} onClick={() => { setDialogStates({ ...dialogStates, domicileDialog: true }) }} />
                          <Multi_Dropdown isOpen={dialogStates.domicileDialog} onClose={() => setDialogStates({ ...dialogStates, domicileDialog: false })} MinimumWidth={'600px'} tableRows={cityData.results} tableHeader={CityHeader} onSelect={DomicileClickHandler} RowFilterWith='c_rec_id' />
                        </div> :
                        <InputField name='domicel' disabled={disableFields} mandatory={true} label='Domicile' value={formData.domicel ? formData.domicel.city_name : ""} onChange={handleChange} isShowIcon={true} />}
                      <InputField name="eobi_number" disabled={disableFields} label="EOBI Number" type="text" value={formData.eobi_number || ""} onChange={handleChange} fullWidth />
                      <InputField name="pastport_number" disabled={disableFields} label="Pasport Number" type="text" value={formData.pastport_number || ""} onChange={handleChange} fullWidth />
                      <InputField name="weight" disabled={disableFields} label="Weight (Kg)" type="number" mandatory={true} value={formData.weight || ""} onChange={handleChange} fullWidth />
                      <InputField name="height" disabled={disableFields} label="Height (Ft) " type="number" mandatory={true} value={formData.height || ""} onChange={handleChange} fullWidth />
                      <InputField name="date_of_superannutation" disabled={disableFields} label="Superannuation" type="date" value={formData.date_of_superannutation || ""} onChange={handleChange} fullWidth />
                      <InputField name="deceased_date" label="Deceased Date" disabled={disableFields} type="date" value={formData.deceased_date || ""} onChange={handleChange} fullWidth />

                    </Grid>
                  </Grid>
                  <Grid item xs={12}><HeadingBar title="Disability" /></Grid>
                  <Grid item xs={12} sx={{ mb: 3 }}>
                    <Grid container columnSpacing={6} sx={{ px: 2 }}>
                      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                        <Box className="inputBox" sx={{ position: "relative" }} >
                          <Typography sx={{ display: 'flex', marginTop: "3.3px" }} >Any Disability:</Typography>
                          <Switch sx={{ ml: 18.8, position: "absolute" }} disabled={disableFields} size="small" checked={isActive} onClick={(e) => { setIsActive(!isActive); setFormData((prevData) => ({ ...prevData, anu_disability: isActive })); }} name='active' />
                        </Box>

                      </Grid>
                      <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                        {isActive && (
                          <InputField name="disability_note" disabled={disableFields} label="Disability Note" type="text" mandatory={true} value={formData.disability_note} multiline={true} onChange={handleChange} fullWidth />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <EmployeeFormDashboard />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Personal_Information;
