import React, { Fragment, useState, useCallback, useMemo, useEffect} from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from "../../../Components/index";
import {
  useGetJobLevelQuery, useGetJobQuery
} from "../../../Features/API/API";
import { JobHeader } from "../../../Data/Setup_Data/Setup_Data";

const JobLevel = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  // States
  const [formData, setFormData] = useState({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobName, setJobName] = useState("");

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetJobLevelQuery();
  const { data: jobData, isLoading: jobLoading, isError: jobRefreshError, error: jobQueryError } = useGetJobQuery();

  useEffect(()=>{
    refetch();
  },[])

  // Callbacks
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({
      job_abbrivation: event.row.job_abbrivation,
      job_abbrivation_seniority: event.row.job_abbrivation_seniority,
      job: event.row.job.j_rec_id
    });
    setJobName(event.row.job.job_title);
    setSelectedRowID(event.row.j_l_rec_id);
  }, []);

  const jobClickHandler = useCallback((selectedRow) => {
    setFormData({ ...formData, job: selectedRow.j_rec_id });
    setJobName(selectedRow.job_title);
    setJobDialogOpen(false);
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormErrors({});
    setIsRowSelected(false);
    setFormData({ job_abbrivation: '', job_abbrivation_seniority: '', job: '' });
    setJobName("");
  }, []);

  // Memoized columns
  const columns = useMemo(() => [
    {
      field: 'job_abbrivation', headerName: 'Job Level', flex: 1, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value + "-" + params.row.job_abbrivation_seniority}</span>
        );
      },
    },
    {
      field: 'job', headerName: 'Job', flex: 1,
      valueGetter: (params) => params.row?.job?.job_title || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
  ], [handleRowClick]);



  return (
    <div>
      <Fragment>
        <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
          <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Job Level</Typography>
          <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        </Box>
        <form action="">
          <Grid container columnSpacing={8} spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
              {jobData && jobData.results ?
                <div>
                  <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} mandatory InputState={true} />
                  <Multi_Dropdown isOpen={jobDialogOpen} onClose={() => setJobDialogOpen(false)} tableRows={jobData.results} tableHeader={JobHeader}
                    onSelect={jobClickHandler}
                    RowFilterWith={"j_rec_id"}
                    MinimumWidth={'500px'}
                  />
                </div>
                : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setJobDialogOpen(true)} InputState={true} />
              }
              <InputField name="job_abbrivation" label="Job Alias" placeholder="Enter Job Alias" type="text" value={formData.job_abbrivation} onChange={handleChange} style={{ textTransform: 'uppercase' }} mandatory InputState={true} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
              <InputField name="job_abbrivation_seniority" label="Level" placeholder="Enter Job Level Seniority" type="text" value={formData.job_abbrivation_seniority} onChange={handleChange} mandatory InputState={true} />
              <InputField name="job_abbrivation_seniority" label="Job Level" value={formData.job_abbrivation + "-" + formData.job_abbrivation_seniority} InputState={true} />
            </Grid>
          </Grid>
        </form>

        {loading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {refreshError ? (<ErrorHandler online={navigator.onLine} />)
              : (
                data && data?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={data.results}
                    RowFilterWith="j_l_rec_id"
                    onRowClick={handleRowClick}
                    customPageSize={15}
                    minHeight={'calc(100vh - 384px)'}
                  />
                ) : null
              )}
          </>
        )}
      </Fragment>
    </div>
  );
};

export default JobLevel;
