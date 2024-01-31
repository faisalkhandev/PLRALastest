import React, { Fragment, useState } from 'react';
import { Typography, Grid, Checkbox, Box, Switch } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer } from '../../../Components/index';
import '../../Styles.css';

const rowData = [
  {
    id: 1,
    employee: 'Ahmed Ali',
    year: '2023-01-15',
    status: 'Completed',
    note: 'My new ',
    attachment: 'True',
    pen_picture_reporting_officer: 'True',
    job_description: 'Best Rating Model ',
    brief_achievements: 'Completed',
    officer_performance: 'Completed',
    quality_of_work: 'Full',
    output_of_work: 'Good',
    integrity_general: 'Completed',
    integrity_intellectual: "Good",
    reporting_officer: 'True',
    area_and_level_of_expertise: 'Level A',
    overall_grading: 'B',
    fitness_for_retention: 'Completed',
    frequency_of_work: 'True',
    know_the_officer: 'Completed',
    recommendation_for_retention: 'True',
    quality_of_assessment: 'Completed',
    training_and_development: 'True',
    refer_to_competent_authority: 'True',
  },
]
const columns = [
  {
    field: 'employee', headerName: ' Employee Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  { field: 'year', headerName: 'Year', flex: true },
  { field: 'status', headerName: 'Status', flex: true },
  { field: 'note', headerName: 'Note', flex: true },
  { field: 'attachment', headerName: 'Attachment', flex: true },
  { field: 'job_description', headerName: 'Job Description', flex: true },
  { field: 'brief_achievements', headerName: 'Brief Achievements', flex: true },
  { field: 'officer_performance', headerName: 'Officer Performance', flex: true },
  { field: 'quality_of_work', headerName: 'Work Quality', flex: true },
  { field: 'output_of_work', headerName: 'Work Output', flex: true },
  { field: 'integrity_general', headerName: 'Integrity General', flex: true },
  { field: 'integrity_intellectual', headerName: 'Integrity Intellectual', flex: true },
  { field: 'pen_picture_reporting_officer', headerName: 'Reporting Officer', flex: true },
  { field: 'area_and_level_of_expertise', headerName: 'Expertise Level', flex: true },
  { field: 'overall_grading', headerName: 'Grading', flex: true },
  { field: 'fitness_for_retention', headerName: 'Fitness Retention', flex: true },
  { field: 'frequency_of_work', headerName: 'Work Frequency', flex: true },
  { field: 'know_the_officer', headerName: 'Officer', flex: true },
  { field: 'recommendation_for_retention', headerName: 'Recommended Retention', flex: true },
  { field: 'quality_of_assessment', headerName: 'Quality Assessment', flex: true },
  { field: 'training_and_development', headerName: 'Training and Development', flex: true },
  { field: 'refer_to_competent_authority', headerName: 'Competent Authority', flex: true },
];


const AAR_Process_HOS = () => {
  const theme = useTheme();
  //STATES
  const [formData, setFormData] = useState({
    employee: '', year: '', status: '', note: '', attachment: '', job_description: '', brief_achievements: '', officer_performance: '',
    quality_of_work: '', output_of_work: '', integrity_general: '', integrity_intellectual: '', pen_picture_reporting_officer: '',
    area_and_level_of_expertise: '', overall_grading: '', fitness_for_retention: '', frequency_of_work: '', know_the_officer: '',
    recommendation_for_retention: '', quality_of_assessment: '', training_and_development: '', refer_to_competent_authority: '',
  });
  const [isActive, setIsActive] = useState(formData.training_and_development,);
  const [isTrue, setIsTrue] = useState(formData.refer_to_competent_authority);

  return (
    <div style={{ width: '100%', position: 'relative', top: 'calc(15vh - 120px)', bottom: 0, maxHeight: '80vh', overflow: 'auto' ,padding: '20px' }}>
      <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center',color: theme.palette.primary.main, fontWeight: 'bold' }}> AAR Process HOS</Typography>
      <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
        <Btn type="reset" outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="save" />
      </Box>

      <form action="">
        <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="employee" label="Employee" placeholder="Select Employee" type="text" isShowIcon={true} />
            <InputField name="year" label="Year" placeholder="Select Year" type="text" isShowIcon={true} />
            <InputField name="status" label="Status" placeholder="Enter Status" type="text" isShowIcon={true} />
            <InputField name="note" label="Note" placeholder="Enter a Brief Note" type="text" />
            <InputField name="attachment" label="Attachment" type="file" />
            <InputField name="job_description" label="Job Description" placeholder="Enter Job Description" type="text" />
            <InputField name="brief_achievements" label="Brief Achievement" placeholder="Enter Brief Achievement" type="text" />
            <InputField name="officer_performance" label="Officer Performance" placeholder="Enter Officer Performance" type="text" />
            <InputField name="quality_of_work" label="Work Quality" placeholder="Select Work Quality" type="text" isShowIcon={true} />
            <InputField name="output_of_work" label="Work Output" placeholder="Select Work Output" type="text" isShowIcon={true} />
            <InputField name="integrity_general" label="Integrity General" placeholder="Select Integrity General" type="text" isShowIcon={true} />
            <InputField name="integrity_intellectual" label="Integrity Intellectual" placeholder="Select Integrity Intellectual" type="text" isShowIcon={true} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="pen_picture_reporting_officer" label="Reporting Officer" placeholder="Select Pen Picture Reporting Officer" type="text" />
            <InputField name="area_and_level_of_expertise" label="Expertise Level" placeholder="Select Area and Expertise Level" type="text" />
            <Box className="inputBox" >
              <Typography sx={{ display: 'flex', marginTop: "3.3px" }} >Training And Development:</Typography>
              <Switch sx={{ ml: 10.8 }} size="small" checked={isActive} onClick={(e) => { setIsActive(!isActive); setFormData((prevData) => ({ ...prevData, training_and_development: isActive })); }} name='active' />
            </Box>
            <InputField name="overall_grading" label="Overall Grading" placeholder="Select Overall Grading" type="text" isShowIcon={true} />
            <InputField name="fitness_for_retention" label="Fitness For Retention" placeholder="Select Fitness For Retention" type="text" />
            <InputField name="frequency_of_work" label="Work Frequency" placeholder="Select Work Frequency" type="text" isShowIcon={true} />
            <InputField name="know_the_officer" label="Know The Officer" placeholder="Select Officer" type="text" />
            <InputField name="recommendation_for_retention" label="Retention Recommendation" placeholder="Select Retention Recommendation" type="text" />
            <InputField name="quality_of_assessment" label="Quality Assessment" placeholder="Select Quality Assessment" type="text" isShowIcon={true} />
            <Box className="inputBox" >
              <Typography sx={{ display: 'flex', marginTop: "3.3px" }} >Competent Authority Reference:</Typography>
              <Switch sx={{ ml: 10.8 }} size="small" checked={isTrue} onClick={(e) => { setIsTrue(!isTrue); setFormData((prevData) => ({ ...prevData, refer_to_competent_authority: isTrue })); }} name='active' />
            </Box>
            <InputField name="competent_authority_remarks" label="Competent Authority Remarks" placeholder="Enter Competent Authority Remarks" type="text" />
          </Grid>
        </Grid>
      </form>

      <div style={{ width: '100%', position: 'relative', top: 'calc(15vh - 100px)', bottom: 0 }}>
        <MyTableContainer
          columns={columns}
          data={rowData}
          isAddNewButton={true}
          customPageSize={10}
          RowFilterWith="id"
        />
      </div>
      </div>
  )
}

export default AAR_Process_HOS
