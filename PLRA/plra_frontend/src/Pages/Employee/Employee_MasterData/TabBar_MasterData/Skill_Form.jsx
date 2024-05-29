import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, HeadingBar, DialogBox } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import {
    useGetEmployeeSkillQuery, usePostEmployeeSkillMutation,
    useUpdateEmployeeSkillMutation, useDeleteEmployeeSkillMutation,
    useGetEmployeeLevelofSkillQuery
} from '../../../../Features/API/EmployeeMasterDataAPI'
import { skillLevelHeader } from './../../../../Data/EmployeeMasterData/EmployeeMasterData';
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'


const Skill_Form = () => {

    //States
    const theme = useTheme();
    const { id } = useParams()
    const [formErrors, setFormErrors] = useState({});
    const goBack = () => {
        window.history.go(-1);
    };
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(false);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [verified, setIsVerified] = useState(false);
    const [skillLevelDialog, setSkillLevelDialog] = useState(false);
    const [skillLevelData, setSkillLevelData] = useState("");
    const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
    const [disableFields, setfieldsDisable] = useState(false)
    const [formData, setFormData] = useState({
        skill: null, skill_date: null, years_of_experience: null, level_of_skill: null, verified: false, verified_by: null, employee: id,
    });
    const [deleteDialog, setDeleteDialog] = useState(false);


    //Queries
    const { data: skillLevel_data, isLoading: employee_loading, isError: employee_refreshError, error: employee_queryError, refetch: employee_refetch } = useGetEmployeeLevelofSkillQuery(id);
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEmployeeSkillQuery(id);
    const [postEmployeeSkill] = usePostEmployeeSkillMutation();
    const [updateEmployeeSkill] = useUpdateEmployeeSkillMutation();
    const [deleteEmployeeSkill] = useDeleteEmployeeSkillMutation();


    //Functions
    useEffect(() => {
        employee_refetch();
        refetch();
    }, [])


    const handleBoxClick = (record) => {
        setIsRowSelected(true)
        setActiveTab(true);
        setIsRowSelected(true);
        setfieldsDisable(true);
        setSelectedRowID(record.skill_rec_id);
        setActiveBoxIndex(record);
        setFormData({
            ...formData,
            skill: record?.skill,
            skill_date: record?.skill_date,
            years_of_experience: record?.years_of_experience,
            verified: record?.verified,
            verified_by: record?.verified_by,
        });
        setfieldsDisable(true)
        setIsVerified(record.verified);
        setSkillLevelData(record?.level_of_skill?.level_of_skill);
    }
    const skillClickHandler = (selectedRow) => {
        setFormData({ ...formData, level_of_skill: selectedRow?.level_of_skill_rec_id });
        setSkillLevelData(selectedRow?.level_of_skill);
        setSkillLevelDialog(false)
    }
    const handleInputChange = (event, fieldName) => {

        setFormData({
            ...formData,
            [fieldName]: event.target.value,
        });
    }

    const handleToggleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
    };

    const handleUpdateData = async (e) => {
        e.preventDefault();
        try {
            const res = await updateEmployeeSkill({ selectRowID, updateEmployeeSkillData: formData });
            if (res?.error && res.error.status) {
                if (res?.error?.status === 422 && res?.error?.data?.code) {
                    return (showToast(`${res?.error?.data?.detail}`, "error"));
                }
                if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                    return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                }
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            else {
                refetch();
                showToast(`Record updated Successfully`, "success");
                resetForm();
            }
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    };

    const handleAddNewSkill = async (e) => {
        e.preventDefault();
        if (isRowSelected) {
            try {
                const res = await updateEmployeeSkill({ selectRowID, updateEmployeeSkillData: formData });
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                }
                else {
                    refetch();
                    showToast(`Record updated Successfully`, "success");
                    resetForm();
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
        else {
            try {
                const res = await postEmployeeSkill(formData);
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
                    refetch();
                    showToast(`Record created Successfully`, "success");
                    resetForm();
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
    }



    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmployeeSkill({ selectRowID });
            // error handling
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            // success call
            refetch();
            showToast(`Record Deleted Successfully`, "success");
            resetForm();
            setSkillLevelData('');
            setIsRowSelected(false)

        } catch (err) {
            return showToast(`${err.message}`, "error");

        }
    }


    const resetForm = () => {
        setFormErrors({});
        setSelectedRowID(null);
        setIsRowSelected(null);
        setfieldsDisable(false);
        setSkillLevelData('');
        setFormData({
            skill: '', skill_date: '', years_of_experience: "", level_of_skill: '', verified: false, verified_by: '', employee: id,
        });
    };


    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="Skills" breadcrumbItem="Employee / Skill " />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={resetForm} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handleAddNewSkill} />
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
            </Box>

            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {data && data.results && data.results.length > 0 ? (
                            data.results.map((record) => (
                                <Box key={record.skill_rec_id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === record ? 'Box_Class' : ''} onClick={() => handleBoxClick(record)}>
                                    <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.skill}</Typography>
                                    <Typography variant="body2" color="initial">{record.skill_date}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Skills</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2, }}>
                            <HeadingBar title="Skill Information" />
                        </Grid>
                        <form action='' onSubmit={handleUpdateData}>
                            <Grid container columnSpacing={6} sx={{ px: 2 }} >
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2, px: 2 }}>
                                    <InputField label="Skill" disabled={disableFields} name='skill' type='text' placeholder='Enter Skill' value={formData.skill} onChange={(e) => handleInputChange(e, "skill")} mandatory fullWidth error={formErrors?.data?.skill} />
                                    <InputField label="Skill Date" disabled={disableFields} name='skill_date' type='date' value={formData.skill_date} onChange={(e) => handleInputChange(e, 'skill_date')} mandatory fullWidth error={formErrors?.data?.skill_date} />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <div>
                                        <InputField name="level_of_skill" disabled={disableFields} label="Level of Skill" placeholder="Select Skill Level" value={skillLevelData} isShowIcon={true} onClick={() => setSkillLevelDialog(true)} mandatory error={formErrors?.data?.level_of_skill} />
                                        <Multi_Dropdown RowFilterWith={"level_of_skill_rec_id"} disabled={disableFields} isOpen={skillLevelDialog} tableHeader={skillLevelHeader} tableRows={skillLevel_data && skillLevel_data.results} onClose={() => setSkillLevelDialog(false)} onSelect={skillClickHandler} />
                                    </div>
                                    <InputField label="Years of Experience" disabled={disableFields} name='years_of_experience' type='number' value={formData.years_of_experience} onChange={(e) => handleInputChange(e, 'years_of_experience')} mandatory error={formErrors?.data?.years_of_experience} />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}><HeadingBar title="Skill Verification" /></Grid>
                            <Grid item xs={12} >
                                <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ display: 'flex' }}  >Verified:<Switch sx={{ ml: 8 }} size="small" disabled={disableFields} name="verified" value={formData.verified} checked={formData.verified} onChange={handleToggleChange} /></Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                        <InputField label="Verified By" disabled={disableFields} name='verified_by' type="text" value={formData.verified_by} onChange={(e) => handleInputChange(e, 'verified_by')} mandatory={true} error={formErrors?.data?.verified_by} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>


                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard userId={id} title="Processess" />

                </Grid>
            </Grid>

        </div >
    )
};
export default Skill_Form
