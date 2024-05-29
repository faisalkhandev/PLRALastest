import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Typography, Box, Grid, Switch, Stack, Button } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler, DialogBox } from '../../../Components/index'
import {
  useGetPositionQuery, useGetPositionTypeQuery, useGetWingQuery,
  usePostPositionMutation, useGetCenterQuery, useUpdatePositionMutation, useGetJobQuery,
  useDeletePositionMutation, useGetSubWingIDQuery, useGetAllPositionQuery
} from '../../../Features/API/API'
import { SubWingHeader, WingHeader, PositionTypeHeader, JobHeader, CenterHeader } from '../../../Data/Setup_Data/Setup_Data'
import { showToast } from '../../../Components/Common/ToastCard'
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const Position = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  //states
  const [formData, setFormData] = useState({
    no_of_position: "", open_position: true, position_active: true,
    full_time_equivalent: "", job: "", location: "", wing: "", sub_wing: "", position_type: ""
  });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [WingDialogOpen, setWingDialogOpen] = useState(false);
  const [CenterDialogOpen, setCenterDialogOpen] = useState(false);
  const [SubWingDialogOpen, setSubWingDialogOpen] = useState(false);
  const [PositionTypeDialog, setPositionTypeDialog] = useState(false);
  const [jobTypeDialog, setjobTypeDialog] = useState(false);
  const [jobName, setJobName] = useState("");
  const [wingName, setWingName] = useState("");
  const [subWingName, setSubWingName] = useState("");
  const [positionTypeName, setPositionTypeName] = useState("");
  const [selectedWing, setSelectedWing] = useState(null)
  const [subWingDisable, setSubWingDisable] = useState(true);
  const [centerName, setCenterName] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isOpenPosition, setIsOpenPosition] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [fieldsDisable, setfieldsDisable] = useState(false);
  const [activeTab, setActiveTab] = useState('center'); // 'center' or 'all'
  const [tableData, setTableData] = useState([]);
  const [rowFilter, setRowFilter] = useState('p_rec_id');

  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetPositionQuery();
  const { data: allPositionData, isLoading: allPosloading, isError: allPosrefreshError, error: allPosqueryError, refetch: allPosrefetch } = useGetAllPositionQuery();
  const { data: wingData, Loading: WingLoading, isError: WingRefreshError, error: WingQueryError, refetch: RefetchWing } = useGetWingQuery();
  const { data: subWingData, Loading: SubWingLoading, isError: SubWingRefreshError, error: SubwingQueryError1, refetch: RefetchSubWing } = useGetSubWingIDQuery({ selectedWing });
  const { data: positionTypeData, Loading: PositionTypeLoading, isError: PositionTypeRefreshError, error: PositionTypeQueryError, refetch: RefetchPositionType } = useGetPositionTypeQuery();
  const { data: jobData, sLoading: jobLoading, isError: jobRefreshError, error: jobQueryError, refetch: RefetchJob } = useGetJobQuery();
  const { data: centerData, sLoading: centerLoading, isError: centerRefreshError, error: centerQueryError, refetch: RefetchCenter } = useGetCenterQuery();
  const [postPosition] = usePostPositionMutation();
  const [updatePosition] = useUpdatePositionMutation();
  const [deletePosition] = useDeletePositionMutation();

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        let apiData;
        if (activeTab === 'center') {
          apiData = allPositionData;
          setRowFilter('p_rec_id'); // Set the rowFilter to 'p_rec_id' for 'center'
          allPosrefetch();
        } else {
          apiData = data;
          setRowFilter('p_rec_id'); // Set the rowFilter to 'w_rec_id' for 'all positions'
          refetch();
        }
        setTableData(apiData.results);
      } catch (error) {
        console.error('Error fetching data:', error);

      }
    };

    fetchData();
  }, [activeTab]);

  // functions

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    allPosrefetch();
    refetch();
    RefetchWing();
    RefetchSubWing();
    RefetchPositionType();
    RefetchCenter();
    RefetchJob();
  }, [])

  const wingClickHandler = (selectedRow) => {
    setFormData({ ...formData, wing: selectedRow.w_rec_id, });
    setWingName(selectedRow.wing_name)
    setSelectedWing(selectedRow.w_rec_id)
    setWingDialogOpen(false);
    setSubWingDisable(false);
    setSubWingName('')
  };

  const centerClickHandler = (selectedRow) => {
    setCenterName(selectedRow.center_name)
    setFormData({ ...formData, location: selectedRow.c_rec_id, });
    setCenterDialogOpen(false);

  };

  const subWingClickHandler = (selectedRow) => {
    setSubWingName(selectedRow.sub_wing_name)
    setFormData({ ...formData, sub_wing: selectedRow.sw_rec_id, });
    setSubWingDialogOpen(false);
  };

  const positionTypeClickHandler = (selectedRow) => {
    setPositionTypeName(selectedRow.position_type_name)
    setFormData({ ...formData, position_type: selectedRow.p_t_rec_id, });
    setPositionTypeDialog(false);
  };

  const jobClickHandler = (selectedRow) => {
    setJobName(selectedRow.job_title)
    setFormData({ ...formData, job: selectedRow.j_rec_id, });
    setjobTypeDialog(false);
  };

  const handleRowClick = (event) => {
    setFormData({
      no_of_position: event.row.no_of_position,
      open_position: event.row.open_position,
      position_active: event.row.position_active,
      job: event.row.job.j_rec_id,
      location: event.row.location.c_rec_id,
      position_id: event.row.position_id,
      position_desc: event.row.position_desc,
      wing: event.row.wing.w_rec_id, sub_wing: event.row.sub_wing.sw_rec_id, position_type: event.row.position_type.p_t_rec_id,
    });

    setIsRowSelected(true);
    setfieldsDisable(true);
    setCenterName(event.row.location.center_name)
    setJobName(event.row.job.job_title)
    setSubWingName(event.row.sub_wing.sub_wing_name)
    setWingName(event.row.wing.wing_name)
    setPositionTypeName(event.row.position_type.position_type_name)
    setSelectedRowID(event.row.p_rec_id);
    setIsOpenPosition(event.row.open_position)
    setIsActive(event.row.position_active)
  }

  const handleDeleteDialog = (e) => {
    if (isRowSelected) {
      setDeleteDialog(true);
    }
    else {
      return showToast('Record not Selected', 'error');
    }
  }

  const handleSaveData = async (e) => {
    e.preventDefault();
    try {
      const res = await postPosition(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record created Successfully`, "success");
        resetForm()
        setFormData({
          position_desc: "", position_id: "", no_of_position: "", open_position: true,
          full_time_equivalent: "", job: "", position_active: true,
          location: "", wing: "", sub_wing: "", position_type: ""
        });
        refetch();
        allPosrefetch();
        setCenterName("")
        setJobName("")
        setSubWingName("")
        setWingName("")
        setPositionTypeName("")
        allPosrefetch();
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }

  const handleDeleteData = async (e) => {
    try {
      const res = await deletePosition({ selectRowID });
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record Deleted Successfully`, "success");
        setFormData({
          position_desc: "", position_id: "", no_of_position: "", open_position: "",
          full_time_equivalent: "", job: "",
          location: "", wing: "", sub_wing: "", position_type: ""
        });
        refetch();
        allPosrefetch();
        setCenterName("")
        setJobName("")
        setSubWingName("")
        setWingName("")
        setPositionTypeName("")
        setIsRowSelected(false)
        refetch();
        allPosrefetch();
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  const resetForm = () => {
    setFormErrors({});
    setFormData({
      no_of_position: "",
      open_position: true,
      position_active: true,
      job: "",
      location: "",
      wing: "",
      sub_wing: "",
      position_type: "",
      position_desc: "",
    });
    setCenterName("")
    setJobName("")
    setSubWingName("")
    setWingName("")
    setPositionTypeName("")
    setSubWingDisable(true);
    setIsActive(true);
    setIsOpenPosition(true);
    setIsRowSelected(false);
    setfieldsDisable(false)
  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updatePosition({ selectRowID, updatePositionData: formData });
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record updated Successfully`, "success");
        setfieldsDisable(false)
        setIsRowSelected(false)
        setFormData({
          no_of_position: "", open_position: true, job: "",
          location: "", wing: "", sub_wing: "", position_type: "", position_desc: ""
        });
        setCenterName("")
        setJobName("")
        setSubWingName("")
        setWingName("")
        setPositionTypeName("")
        refetch();
        allPosrefetch();
        setIsRowSelected(false)
      }
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  //Columns
  const columns = [
    {
      field: "no_of_position", headerName: "Total Position", width: 120,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "position_type", headerName: "Type", width: 100,
      valueGetter: (params) => params.row?.position_type?.position_type_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: "job", headerName: "Job", width: 150,
      valueGetter: (params) => params.row?.job?.job_title || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "position_id", headerName: "Position ID", width: 180,
      valueGetter: (params) => params.row?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "location", headerName: "Center", width: 180,
      valueGetter: (params) => params.row?.location?.center_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: "wing", headerName: "Wing", width: 200,
      valueGetter: (params) => params.row?.wing?.wing_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: "sub_wing", headerName: "Sub Wing", width: 200,
      valueGetter: (params) => params.row?.sub_wing?.sub_wing_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: 'position_active', headerName: 'Active', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      )
    },
    {
      field: 'open_position', headerName: 'Status', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Open' : 'Close'}
        </span>
      )
    },
  ];

  const AllPositioncolumns = [
    {
      field: "no_of_position", headerName: "Total Position", width: 120,
    },
    {
      field: "position_type", headerName: "Type", width: 100,
      valueGetter: (params) => params.row?.position_type?.position_type_name || '',

    },
    {
      field: "job", headerName: "Job", width: 150,
      valueGetter: (params) => params.row?.job?.job_title || '',

    },
    {
      field: "position_id", headerName: "Position ID", width: 150,
      valueGetter: (params) => params.row?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "location", headerName: "Center", width: 120,
      valueGetter: (params) => params.row?.location?.center_name || '',

    },
    {
      field: "wing", headerName: "Wing", width: 150,
      valueGetter: (params) => params.row?.wing?.wing_name || '',

    },
    {
      field: "sub_wing", headerName: "Sub Wing", width: 200,
      valueGetter: (params) => params.row?.sub_wing?.sub_wing_name || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: 'position_active', headerName: 'Active', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      )
    },
    {
      field: 'open_position', headerName: 'Status', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Open' : 'Close'}
        </span>
      )
    },
  ];

  return (


    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Position</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
        {
          editDialog ?
            <DialogBox
              open={editDialog}
              onClose={() => setEditDialog(false)}
              closeClick={() => setEditDialog(false)}
              sureClick={() => { handleUpdateData(); setEditDialog(false); }}
              title={"Are you sure you want to update the record?"}
            /> : ''
        }
        <Btn type='delete' onClick={handleDeleteDialog} />
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

      <form action="">
        <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            {jobData && jobData.results ?
              <div>
                <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} disabled={fieldsDisable} onChange={handleChange} isShowIcon={true} onClick={() => setjobTypeDialog(true)} error={formErrors?.data?.job} />
                <Multi_Dropdown isOpen={jobTypeDialog} onClose={() => setjobTypeDialog(false)} MinimumWidth={"500px"} tableRows={jobData.results} tableHeader={JobHeader} onSelect={jobClickHandler} RowFilterWith={"j_rec_id"} />
              </div> : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} onChange={handleChange} isShowIcon={true} onClick={() => setjobTypeDialog(true)} error={formErrors?.data?.job} />
            }
            <InputField name="no_of_position" label="No of Position" placeholder="Enter No of Position" type="number" value={formData.no_of_position} onChange={handleChange} error={formErrors?.data?.no_of_position} />
            {positionTypeData && positionTypeData.results ?
              <div>
                <InputField name="position_type" label="Position Type" placeholder="Enter Position Type " disabled={fieldsDisable} type="text" value={positionTypeName} isShowIcon={true} onClick={() => setPositionTypeDialog(true)} error={formErrors?.data?.position_type} />
                <Multi_Dropdown isOpen={PositionTypeDialog} onClose={() => setPositionTypeDialog(false)} MinimumWidth={"300px"} tableRows={positionTypeData.results} tableHeader={PositionTypeHeader} onSelect={positionTypeClickHandler} RowFilterWith={"p_t_rec_id"} />
              </div> : <InputField name="position_type" label="Position Type" placeholder="Enter Position Type " type="text" value={positionTypeName} isShowIcon={true} onClick={() => setPositionTypeDialog(true)} error={formErrors?.data?.position_type} />}

            <InputField name="position_desc" label="Position Description" placeholder="Enter Position Description" type="text" value={formData.position_desc} disabled={fieldsDisable} onChange={handleChange} error={formErrors?.data?.position_desc} />

          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            {wingData && wingData.results ?
              <div>
                <InputField name="wing" label="Wing" placeholder="Enter Wing " type="text" value={wingName} disabled={fieldsDisable} isShowIcon={true} onClick={() => setWingDialogOpen(true)} error={formErrors?.data?.wing} />
                <Multi_Dropdown isOpen={WingDialogOpen} onClose={() => setWingDialogOpen(false)} MinimumWidth={"400px"} tableRows={wingData.results} tableHeader={WingHeader} onSelect={wingClickHandler} RowFilterWith={"w_rec_id"} />
              </div> : <InputField name="wing" label="Wing" placeholder="Enter Wing " type="text" value={wingName} isShowIcon={true} onClick={() => setWingDialogOpen(true)} error={formErrors?.data?.wing} />
            }
            {subWingData && subWingData.results ?
              <div>
                <InputField name="sub_wing" label="Sub Wing" placeholder="Enter SubWing " type="text" value={subWingName} isShowIcon={true} onClick={() => setSubWingDialogOpen(true)} disabled={subWingDisable} error={formErrors?.data?.sub_wing} />
                <Multi_Dropdown isOpen={SubWingDialogOpen} onClose={() => setSubWingDialogOpen(false)} MinimumWidth={"400px"} tableRows={subWingData.results} tableHeader={SubWingHeader} onSelect={subWingClickHandler} RowFilterWith={"sw_rec_id"} />
              </div>
              :
              <InputField name="sub_wing" label="Sub Wing" placeholder="Enter SubWing " type="text" value={subWingName} isShowIcon={true} onClick={() => setSubWingDialogOpen(true)} disabled={subWingDisable} error={formErrors?.data?.sub_wing} />}
            {centerData && centerData.results ?
              <div>
                <InputField name="location" label="Center" placeholder="Select Center Location" disabled={fieldsDisable} type="text" value={centerName || ""} onClick={() => setCenterDialogOpen(true)} isShowIcon={true} error={formErrors?.data?.location} />
                <Multi_Dropdown isOpen={CenterDialogOpen} onClose={() => setCenterDialogOpen(false)} MinimumWidth={"660px"} tableRows={centerData.results} tableHeader={CenterHeader} onSelect={centerClickHandler} RowFilterWith={"c_rec_id"} />
              </div> : <InputField name="location" label="Center Location" placeholder="Select Center Location" type="text" value={centerName} onClick={() => setCenterDialogOpen(true)} error={formErrors?.data?.location} />}
            <Box className="inputBox" sx={{ width: "100%", display: 'flex' }} >
              <Box sx={{ width: "40%", display: 'flex', justifyContent: 'start' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} >Position Active: </Typography>
                <Switch sx={{ ml: 8 }} size="small" checked={isActive} disabled={fieldsDisable}
                  onClick={(e) => {
                    const handleIsActive = !isActive; setIsActive(handleIsActive);
                    setFormData((prevData) => ({ ...prevData, position_active: handleIsActive }));
                  }}
                  name='active' />
              </Box>
              <Box sx={{ width: "40%", display: 'flex', justifyContent: 'start' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} > Open: </Typography>
                <Switch sx={{ mx: 7.7, my: 1 }} size="small" checked={isOpenPosition} disabled={fieldsDisable}
                  onClick={(e) => {
                    const handleOpenPosition = !isOpenPosition; setIsOpenPosition(handleOpenPosition);
                    setFormData((prevData) => ({ ...prevData, open_position: handleOpenPosition }));
                  }}
                  name='isOpenPosition' />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
      {/* Buttons  */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end', my: 2 }}>
        <Button variant={activeTab === 'center' ? 'contained' : 'outlined'} onClick={() => handleTabChange('center')}>
          Positions
        </Button>
        <Button variant={activeTab === 'all' ? 'contained' : 'outlined'} onClick={() => handleTabChange('all')}>
          All Positions
        </Button>
      </Stack>

      {loading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {allPosqueryError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              activeTab === 'center' ? (
                allPositionData && allPositionData?.results ? (
                  <MyTableContainer
                    columns={columns}
                    data={allPositionData.results}
                    isAddNewButton={true}
                    customPageSize={8}
                    RowFilterWith={rowFilter}
                    onRowClick={handleRowClick}
                    minHeight={'calc(100vh - 460px)'}
                  />
                ) : null
              ) : (
                data && data?.results ? (
                  <MyTableContainer
                    columns={AllPositioncolumns}
                    data={data.results}
                    isAddNewButton={true}
                    customPageSize={8}
                    RowFilterWith={rowFilter}
                    onRowClick={handleRowClick}
                    minHeight={'calc(100vh - 460px)'}
                  />
                ) : null
              )
            )}
        </>
      )}


    </Fragment>
  )
}
export default Position