import React, { Fragment, useEffect, useState } from 'react'
import { Typography, Box, Grid, Dialog, Switch } from '@mui/material'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from '../../../Components/index'
import {
  useGetPositionQuery, useGetPositionTypeQuery, useGetWingQuery,
  usePostPositionMutation, useGetCenterQuery, useUpdatePositionMutation, useGetJobQuery,
  useDeletePositionMutation, useGetSubWingIDQuery
} from '../../../Features/API/API'
import { SubWingHeader, WingHeader, PositionTypeHeader, JobHeader, CenterHeader } from '../../../Data/Setup_Data/Setup_Data'
import { Warning } from '../../../Assets/Icons';



const Position = () => {
  const theme = useTheme();

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


  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetPositionQuery();
  const { data: wingData, Loading: WingLoading, isError: WingRefreshError, error: WingQueryError, refetch: RefetchWing } = useGetWingQuery();
  const { data: subWingData, Loading: SubWingLoading, isError: SubWingRefreshError, error: SubwingQueryError1, refetch: RefetchSubWing } = useGetSubWingIDQuery({ selectedWing });
  const { data: positionTypeData, Loading: PositionTypeLoading, isError: PositionTypeRefreshError, error: PositionTypeQueryError, refetch: RefetchPositionType } = useGetPositionTypeQuery();
  const { data: jobData, sLoading: jobLoading, isError: jobRefreshError, error: jobQueryError, refetch: RefetchJob } = useGetJobQuery();
  const { data: centerData, sLoading: centerLoading, isError: centerRefreshError, error: centerQueryError, refetch: RefetchCenter } = useGetCenterQuery();
  const [postPosition] = usePostPositionMutation();
  const [updatePosition] = useUpdatePositionMutation();
  const [deletePosition] = useDeletePositionMutation();

  console.log(data);



  // functions
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
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
      position_id: event.row.position_id, position_desc: event.row.position_desc,
      wing: event.row.wing.w_rec_id, sub_wing: event.row.sub_wing.sw_rec_id, position_type: event.row.position_type.p_t_rec_id,
    });

    setIsRowSelected(true);
    setfieldsDisable(true)
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
    console.log("delete clicked");
    if (isRowSelected) {
      setDeleteDialog(true);
    }
    else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });
    }
  }

  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.no_of_position == '' || formData.wing == '' || formData.sub_wing == '' || formData.center == ''

    ) {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {

        const res = await postPosition(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Position create successfully.", { position: "top-center", autoClose: 3000 })
          resetForm()
          setFormData({
            position_desc: "", position_id: "", no_of_position: "", open_position: true,
            full_time_equivalent: "", job: "", position_active: true,
            location: "", wing: "", sub_wing: "", position_type: ""
          });
          refetch();
          setCenterName("")
          setJobName("")
          setSubWingName("")
          setWingName("")
          setPositionTypeName("")
        }
      } catch (err) {
        console.error("Error creating Position:", err);
      }
    }
    // };

  }


  const handleDeleteData = async (e) => {
    try {
      const res = await deletePosition({ selectRowID });
      if (res.error) {
        if (res.error.status === 409) { toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 }) }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({
          position_desc: "", position_id: "", no_of_position: "", open_position: true,
          full_time_equivalent: "", job: "", position_active: true,
          location: "", wing: "", sub_wing: "", position_type: ""
        });
        resetForm()
        refetch();
        setCenterName("")
        setJobName("")
        setSubWingName("")
        setWingName("")
        setPositionTypeName("")
        setIsRowSelected(false)
        setfieldsDisable(false)

      }
      // success call 
      // toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 });
      setFormData({
        position_desc: "", position_id: "", no_of_position: "", open_position: "",
        full_time_equivalent: "", job: "",
        location: "", wing: "", sub_wing: "", position_type: ""
      });
      refetch();
      setCenterName("")
      setJobName("")
      setSubWingName("")
      setWingName("")
      setPositionTypeName("")
      setIsRowSelected(false)
      refetch();
    } catch (err) {
      console.error('Error Deleting Position', err);
    }
  }

  const resetForm = () => {
    setFormData({
      no_of_position: "",
      open_position: true,
      position_active: true,
      job: "",
      location: "",
      wing: "",
      sub_wing: "",
      position_type: "",
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
      const res = await updatePosition({
        selectRowID,
        updatePositionData: formData,
      });
      if (res.error) {
        if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Position Updated successfully.", { position: "top-center", autoClose: 3000 });
        setfieldsDisable(false)
        setIsRowSelected(false)
        setFormData({
          no_of_position: "", open_position: true, job: "",
          location: "", wing: "", sub_wing: "", position_type: ""
        });
        setCenterName("")
        setJobName("")
        setSubWingName("")
        setWingName("")
        setPositionTypeName("")
        refetch();
        setIsRowSelected(false)
      }
    } catch (err) {
      console.error("Error creating Position:", err);
    }
  };

  //Columns
  const columns = [
    {
      field: "no_of_position", headerName: "Total Position", width: 120,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column" style={{ color: "#379237", textDecoration: 'underline' }}>
            {params.value}
          </span>);
      },
    },
    {
      field: "position_type", headerName: "Type", width: 120, renderCell: (params) => {
        return (<span>{params.row.position_type.position_type_name}</span>)
      }
    },
    {
      field: "job", headerName: "Job", width: 230,
      renderCell: (params) => {
        return (
          <span >
            {params.row.job.job_title}
          </span>);
      },
    },
    {
      field: "location", headerName: "Center", width: 140, renderCell: (params) => {
        return (<span>{params.row.location.center_name}</span>)
      }
    },
    {
      field: "wing", headerName: "Wing", width: 150, renderCell: (params) => {
        return (<span>{params.row.wing.wing_name}</span>)
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
        <Btn type='delete' onClick={handleDeleteDialog} />
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
          <Box sx={{ minWidth: '400px', p: 2 }}>
            <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
              <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
              <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
            </Box>
          </Box>
        </Dialog>
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={{ md: 4, xs: 2 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            {jobData && jobData.results ?
              <div>
                <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} disabled={fieldsDisable} onChange={handleChange} isShowIcon={true} onClick={() => setjobTypeDialog(true)} />
                <Multi_Dropdown isOpen={jobTypeDialog} onClose={() => setjobTypeDialog(false)} MinimumWidth={"500px"} tableRows={jobData.results} tableHeader={JobHeader} onSelect={jobClickHandler} RowFilterWith={"j_rec_id"} />
              </div> : <InputField name="job" label="Job" placeholder="Enter Job " type="text" value={jobName} onChange={handleChange} isShowIcon={true} onClick={() => setjobTypeDialog(true)} />}
            <InputField name="no_of_position" label="No of Position" placeholder="Enter No of Position" type="number" value={formData.no_of_position} onChange={handleChange} />
            {positionTypeData && positionTypeData.results ?
              <div>
                <InputField name="position_type" label="Position Type" placeholder="Enter Position Type " disabled={fieldsDisable} type="text" value={positionTypeName} isShowIcon={true} onClick={() => setPositionTypeDialog(true)} />
                <Multi_Dropdown isOpen={PositionTypeDialog} onClose={() => setPositionTypeDialog(false)} MinimumWidth={"300px"} tableRows={positionTypeData.results} tableHeader={PositionTypeHeader} onSelect={positionTypeClickHandler} RowFilterWith={"p_t_rec_id"} />
              </div> : <InputField name="position_type" label="Position Type" placeholder="Enter Position Type " type="text" value={positionTypeName} isShowIcon={true} onClick={() => setPositionTypeDialog(true)} />}
            <Box className="inputBox" >
              <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} >Position Active: </Typography>
              <Switch sx={{ ml: 7.5 }} size="small" checked={isActive} disabled={fieldsDisable}
                onClick={(e) => {
                  const handleIsActive = !isActive; setIsActive(handleIsActive);
                  setFormData((prevData) => ({ ...prevData, position_active: handleIsActive }));
                }}
                name='active' />
            </Box>
          </Grid>



          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1 }}>
            {wingData && wingData.results ?
              <div>
                <InputField name="wing" label="Wing" placeholder="Enter Wing " type="text" value={wingName} disabled={fieldsDisable} isShowIcon={true} onClick={() => setWingDialogOpen(true)} />
                <Multi_Dropdown isOpen={WingDialogOpen} onClose={() => setWingDialogOpen(false)} MinimumWidth={"400px"} tableRows={wingData.results} tableHeader={WingHeader} onSelect={wingClickHandler} RowFilterWith={"w_rec_id"} />
              </div> : <InputField name="wing" label="Wing" placeholder="Enter Wing " type="text" value={wingName} isShowIcon={true} onClick={() => setWingDialogOpen(true)} />
            }
            {subWingData && subWingData.results ?
              <div>
                <InputField name="sub_wing" label="Sub Wing" placeholder="Enter SubWing " type="text" value={subWingName} isShowIcon={true} onClick={() => setSubWingDialogOpen(true)} disabled={subWingDisable} />
                <Multi_Dropdown isOpen={SubWingDialogOpen} onClose={() => setSubWingDialogOpen(false)} MinimumWidth={"400px"} tableRows={subWingData.results} tableHeader={SubWingHeader} onSelect={subWingClickHandler} RowFilterWith={"sw_rec_id"} />
              </div>
              :
              <InputField name="sub_wing" label="Sub Wing" placeholder="Enter SubWing " type="text" value={subWingName} isShowIcon={true} onClick={() => setSubWingDialogOpen(true)} disabled={subWingDisable} />}
            {centerData && centerData.results ?
              <div>
                <InputField name="location" label="Center" placeholder="Select Center Location" disabled={fieldsDisable} type="text" value={centerName || ""} onClick={() => setCenterDialogOpen(true)} isShowIcon={true} />
                <Multi_Dropdown isOpen={CenterDialogOpen} onClose={() => setCenterDialogOpen(false)} MinimumWidth={"660px"} tableRows={centerData.results} tableHeader={CenterHeader} onSelect={centerClickHandler} RowFilterWith={"c_rec_id"} />
              </div> : <InputField name="location" label="Center Location" placeholder="Select Center Location" type="text" value={centerName} onClick={() => setCenterDialogOpen(true)} />}
            <Box className="inputBox" >
              <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} > Open: </Typography>
              <Switch sx={{ ml: 15 }} size="small" checked={isOpenPosition} disabled={fieldsDisable}
                onClick={(e) => {
                  const handleOpenPosition = !isOpenPosition; setIsOpenPosition(handleOpenPosition);
                  setFormData((prevData) => ({ ...prevData, open_position: handleOpenPosition }));
                }}
                name='isOpenPosition' />
            </Box>
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
                  isAddNewButton={true}
                  customPageSize={8}
                  RowFilterWith="p_rec_id"
                  onRowClick={handleRowClick}
                  minHeight={'calc(100vh - 430px)'}
                />
              ) : null
            )}
        </>
      )}


      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} ><Warning /> Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  )
}
export default Position