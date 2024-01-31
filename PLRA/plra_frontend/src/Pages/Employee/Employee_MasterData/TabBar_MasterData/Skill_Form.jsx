import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Switch, Dialog } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, HeadingBar, CheckBoxField } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import { useGetEmployeeSkillQuery, usePostEmployeeSkillMutation, useUpdateEmployeeSkillMutation, useDeleteEmployeeSkillMutation, useGetEmployeeLevelofSkillQuery, } from '../../../../Features/API/EmployeeMasterDataAPI'
import { skillLevelHeader } from './../../../../Data/EmployeeMasterData/EmployeeMasterData';
import { useParams } from 'react-router-dom'
import { Warning } from '../../../../Assets/Icons/index.jsx'


const Skill_Form = () => {

    //States
    const theme = useTheme();
    const { id } = useParams()
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
        skill: '', skill_date: '', years_of_experience: null, level_of_skill: "", verified: false, verified_by: '', employee: id,
    });
    const [deleteDialog, setDeleteDialog] = useState(false);


    //Queries
    const { data: skillLevel_data, isLoading: employee_loading, isError: employee_refreshError, error: employee_queryError, employee_refetch } = useGetEmployeeLevelofSkillQuery(id);
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEmployeeSkillQuery(id);
    const [postEmployeeSkill] = usePostEmployeeSkillMutation();
    const [updateEmployeeSkill] = useUpdateEmployeeSkillMutation();
    const [deleteEmployeeSkill] = useDeleteEmployeeSkillMutation();


    //Functions
    // useEffect(() => {
    //     if (data && data.results && data.results.length > 0) {
    //         const initialRecord = data.results[0];
    //         setSelectedRowID(initialRecord.skill_rec_id);
    //         setFormData({
    //             skill: initialRecord.skill,
    //             skill_date: initialRecord.skill_date,
    //             years_of_experience: initialRecord.years_of_experience,
    //             verified: initialRecord.verified,
    //             verified_by: initialRecord.verified_by,
    //             level_of_skill: initialRecord.level_of_skill,
    //             employee: initialRecord.employee,
    //         });
    //         // Initialize the skillLevelData with the initial level of skill
    //         if (skillLevel_data && skillLevel_data.results) {
    //             const initialSkillLevel = skillLevel_data.results.find(
    //                 (skillLevel) => skillLevel.level_of_skill_rec_id === initialRecord.level_of_skill
    //             );
    //             if (initialSkillLevel) {
    //                 setSkillLevelData(initialSkillLevel.level_of_skill);
    //             }
    //         }

    //         // Initialize the selectedSkillLevels array with the initial levels for each record
    //         const initialLevels = data.results.map((record) => record.level_of_skill);
    //         setSelectedSkillLevels(initialLevels);
    //     }
    // }, [data, skillLevel_data]);


    const handleBoxClick = (record) => {
        setIsRowSelected(true)
        setActiveTab(true);
        setIsRowSelected(true);
        setfieldsDisable(true);
        setSelectedRowID(record.skill_rec_id);
        setActiveBoxIndex(record);
        setFormData({
            ...formData,
            skill: record.skill,
            skill_date: record.skill_date,
            years_of_experience: record.years_of_experience,
            verified: record.verified,
            verified_by: record.verified_by,
            level_of_skill: record.level_of_skill.level_of_skill_rec_id,
        });
        setfieldsDisable(true)
        setIsVerified(record.verified);
    }
    const skillClickHandler = (selectedRow) => {
        setFormData({ ...formData, level_of_skill: selectedRow.level_of_skill_rec_id });
        setSkillLevelData(selectedRow.level_of_skill);
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

    const deleteForm = async (e) => {
        if (isRowSelected)
            try {
                const res = await deleteEmployeeSkill({ selectRowID });
                if (res.error.status === 400) {
                    toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
                }
                else {
                    refetch();
                    toast.success("Employee Skill deleted successfully.", { position: "top-center", autoClose: 3000 });
                    resetForm();
                    setIsRowSelected(false)
                }
            } catch (err) {
                console.error('Error updating Employee Skill', err);
            }
    };
    const handleUpdateData = async (e) => {
        e.preventDefault();
        if (!formData.skill || !formData.years_of_experience) {
            return toast.error("Mandatory fields should not be empty.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
        try {
            const res = await updateEmployeeSkill({ selectRowID, updateEmployeeSkillData: formData });
            if (res.error.status === 400) {
                toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
            }
            else {
                refetch();
                toast.success("Employee Skill Updated successfully.", { position: "top-center", autoClose: 3000 });
                resetForm();
            }
        } catch (err) {
            console.error('Error updating Employee Skill', err);
        }
    };
    const handleAddNewSkill = async (e) => {
        e.preventDefault();
        if (isRowSelected) {
            try {
                const res = await updateEmployeeSkill({ selectRowID, updateEmployeeSkillData: formData });
                if (res.error.status === 400) {
                    toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 })
                }
                else {
                    refetch();
                    toast.success("Employee Skill Updated successfully.", { position: "top-center", autoClose: 3000 });
                    resetForm();
                }
            } catch (err) {
                console.error('Error updating Employee Skill', err);
            }
        }
        else {
            try {
                const res = await postEmployeeSkill(formData);
                if (res.error.status === 400) {
                    toast.error("ID already exists.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                } else {
                    refetch();
                    toast.success("Employee Skill created successfully.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                    resetForm();
                }
            } catch (err) {
                console.error('Error creating Employee Skill', err);
            }
        }
    }



    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteEmployeeSkill({ selectRowID });
            // error handling 
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            // success call 
            Contactrefetch();
            toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
            resetForm();
            setSkillLevelData('');
            setIsRowSelected(false)

        } catch (err) {
            console.error('Error Deleting Record:', err);
            toast.error(err.message, { position: "top-center", autoClose: 3000 });
        }
    }


    const resetForm = () => {
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
                                    <InputField label="Skill" disabled={disableFields} name='skill' type='text' placeholder='Enter Skill' value={formData.skill} onChange={(e) => handleInputChange(e, "skill")} mandatory fullWidth />
                                    <InputField label="Skill Date" disabled={disableFields} name='skill_date' type='date' value={formData.skill_date} onChange={(e) => handleInputChange(e, 'skill_date')} mandatory fullWidth />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <div>
                                        <InputField name="level_of_skill" disabled={disableFields} label="Level of Skill" placeholder="Select Skill Level" value={skillLevelData} isShowIcon={true} onClick={() => setSkillLevelDialog(true)} mandatory />
                                        <Multi_Dropdown RowFilterWith={"level_of_skill_rec_id"} disabled={disableFields} isOpen={skillLevelDialog} tableHeader={skillLevelHeader} tableRows={skillLevel_data && skillLevel_data.results} onSelect={skillClickHandler} />
                                    </div>
                                    <InputField label="Years of Experience" disabled={disableFields} name='years_of_experience' type='number' value={formData.years_of_experience} onChange={(e) => handleInputChange(e, 'years_of_experience')} mandatory />
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
                                        <InputField label="Verified By" disabled={disableFields} name='verified_by' type="text" value={formData.verified_by} onChange={(e) => handleInputChange(e, 'verified_by')} mandatory={true} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
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
export default Skill_Form
