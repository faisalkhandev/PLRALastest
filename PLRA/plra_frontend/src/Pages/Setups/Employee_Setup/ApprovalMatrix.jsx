import React, { Fragment, useState } from 'react';
import { Typography, Box, Grid, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Warning } from '../../../Assets/Icons';
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler } from '../../../Components/index';
import { toast } from 'react-toastify';
import { useGetPositionQuery, useGetApprovalMatrixAPIQuery, usePostApprovalMatrixAPIMutation, useUpdateApprovalMatrixAPIMutation, useDeleteApprovalMatrixAPIMutation } from '../../../Features/API/API';
const ApprovalMatrix = () => {
  const theme = useTheme();

  // State for form data
  const [formData, setFormData] = useState({
    position: '',
    reporting_position: '',
    counter_assigning_position: '',
    dg_admin: ''
  });
  const [position, setposition] = useState(null)
  const [reportingposition, setreportingposition] = useState(null)
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [ispositionOpen, setisPositionOpen] = useState(false);
  const [isreportingpositionOpen, setisreportingPositionOpen] = useState(false);
  const [isCounterAssigningPositionOpen, setIsCounterAssigningPositionOpen] = useState(false);
  const [isDgAdminPositionOpen, setIsDgAdminPositionOpen] = useState(false);
  const [counterassigningposition, setcounterassigningposition] = useState(null);
  const [dgadmin, setdgadmin] = useState(null);
  const [approvalmatrixupdatedialog, setapprovalmatrixupdatedialog] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);



  // Queries
  const { data: approvalmatrix, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetApprovalMatrixAPIQuery();
  const [Postapprovalmatrix] = usePostApprovalMatrixAPIMutation();
  const [updateapprovalmatrix] = useUpdateApprovalMatrixAPIMutation();
  const [deleteApprovalMatrix] = useDeleteApprovalMatrixAPIMutation();
  const { data: positionData, isLoading: positionloading, isError: positionrefreshError, error: positionqueryError, positionrefetch } = useGetPositionQuery();
  console.log("approvalMatrix", approvalmatrix);
  //functions
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({
      position: '',
      reporting_position: '',
      counter_assigning_position: '',
      dg_admin: ''
    })
    setcounterassigningposition('');
    setdgadmin('');
    setposition('');
    setreportingposition('');

  }
  const handleDelete = async (e) => {
    try {
      const res = await deleteApprovalMatrix({ selectRowID })
      if (res.error) {
        if (res.error.status === 409) { toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 }) }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Approval Matrix deleted.", { position: "top-center", autoClose: 3000 })
        setFormData({ t_id: '', t_name: '', district: '' })
        setDistrictData("")
        setIsRowSelected(false)
        refetch()
      }
    }
    catch (err) {
      console.error('Error creating Tehsil:', err);

    }

  }

  const handleDeleteDialog = () => {
    if (isRowSelected) {
      setdeleteDialog(true)
    }
    else {
      toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });

    }
  }
  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.position == '' || formData.reporting_position == '' || formData.counter_assigning_position == '' || formData.dg_admin == '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await Postapprovalmatrix(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID alredy exist.") }
          // else if 
          else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Data create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({
            position: '',
            reporting_position: '',
            counter_assigning: '',
            dg_admin: ''
          })
          setcounterassigningposition('');
          setdgadmin('');
          setposition('');
          setreportingposition('');
          refetch();
        }
      } catch (err) {
        console.error('Error creating Approval MAtrix:', err);
      }
    }
  }
  const handleUpdateData = async (e) => {
    try {
      const res = await updateapprovalmatrix({ selectRowID, updateApprovalMatrix: formData });
      if (res.error) {
        toast.error("ID alreay exist.", { position: "top-center", autoClose: 3000 });
      } else {
        toast.success("Approval Matrix Updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({
          position: '',
          reporting_position: '',
          counter_assigning: '',
          dg_admin: ''
        })
        setcounterassigningposition('');
        setdgadmin('');
        setposition('');
        setreportingposition('');
        setIsRowSelected(false)
        refetch();
      }
    } catch (err) {
      console.error('Error creating Approval Matrix:', err);
    }
  }
  const handleRowClick = (event) => {
    console.log(event);
    setIsRowSelected(true);
    setFormData({
      position: event.row.position.p_rec_id,
      reporting_position: event.row.reporting_position.p_rec_id,
      counter_assigning_position: event.row.counter_assigning_position ? event.row.counter_assigning_position.p_rec_id : "",
      dg_admin: event.row.dg_admin.p_rec_id,
    });

    setposition(event.row.position.position_desc)
    setreportingposition(event.row.reporting_position.position_desc)
    setcounterassigningposition(event.row.counter_assigning_position ? event.row.counter_assigning_position.position_desc : "");
    setdgadmin(event.row.dg_admin.position_desc);
    setSelectedRowID(event.row.a_m_rec_id);
  };
  const positionClickHandler = (selectedRow) => {

    setFormData({ ...formData, position: selectedRow.p_rec_id, });
    setisPositionOpen(false);
    setposition(selectedRow.position_desc)
  };
  const reportingPositionClickHandler = (selectedRow) => {

    setFormData({
      ...formData,
      reporting_position: selectedRow.p_rec_id,
    });
    setisreportingPositionOpen(false);
    setreportingposition(selectedRow.position_desc)
  };
  const counteAssigningPositionClickHandler = (selectedRow) => {
    setFormData({
      ...formData,
      counter_assigning_position: selectedRow.p_rec_id,
    });
    setIsCounterAssigningPositionOpen(false);
    setcounterassigningposition(selectedRow.position_desc);

  };

  const dgAdminClickHandler = (selectedRow) => {
    setFormData({
      ...formData,
      dg_admin: selectedRow.p_rec_id,
    });
    setIsDgAdminPositionOpen(false);
    setdgadmin(selectedRow.position_desc);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //columns
  const position_columns = [

    { field: "position_id", headerName: "Position ID", flex: 1, width: 250 },
    { field: "position_desc", headerName: "Description", flex: 1, width: 180 },
    {
      field: "wing", headerName: "Wing", flex: 1, width: 180, renderCell: (params) => {
        return (<span className="table_first_column"> {params.row.wing.wing_name}</span>)
      }
    },
    {
      field: "sub_wing", headerName: "Sub Wing", flex: 1, width: 180, renderCell: (params) => {
        return (<span className="table_first_column">{params.row.sub_wing.sub_wing_name}</span>);
      }
    },

  ];

  const columns = [
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params.row.position.position_desc}
          </span>

        );
      },
      onRowClick: handleRowClick,
    },
    {
      field: "reporting_position",
      headerName: "Reporting Position",
      flex: 1,
      renderCell: (params) => {

        return (
          <span >
            {params.row.reporting_position.position_desc}
          </span>
        );
      }

    },
    {
      field: "counter_assigning_position",
      headerName: "Counter Assigning Position",
      flex: 1,
      renderCell: (params) => {
        return (
          <span >
            {params.row.counter_assigning_position ? params.row.counter_assigning_position.position_desc : ""}
          </span>
        );
      }

    },
    {
      field: "dg_admin",
      headerName: "DG Admin",
      flex: 1,
      renderCell: (params) => {
        return (
          <span >
            {params.row.dg_admin.position_desc}
          </span>
        );
      }
    }
  ];


  console.log("Approval matrix", approvalmatrix);
  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", justifyContent: 'end', marginBottom: 3, gap: 1, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Approval Matrix</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
        <Btn onClick={isRowSelected ? () => setapprovalmatrixupdatedialog(true) : handleSaveData} type="save" />
        <Btn type="delete" onClick={handleDeleteDialog} />
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onClick={() => setisPositionOpen(true)} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={ispositionOpen} onClose={() => setisPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results} onSelect={positionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onChange={handleChange} />
            }
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="reporting_position" label="Reporting Position" placeholder="Select Reporting Position" type="text" value={reportingposition ? reportingposition : ''} onClick={() => setisreportingPositionOpen(true)} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isreportingpositionOpen} onClose={() => setisreportingPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.counter_assigning_position && position.p_rec_id !== formData.dg_admin)} onSelect={reportingPositionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="reporting_position" label="Reporting Position" placeholder="Select Reporting Position" type="text" value={reportingposition ? reportingposition : ''} onClick={() => setisreportingPositionOpen(true)} />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="counter_assigning" label="Counter Assigning" placeholder="Select Counter Assigning Officer" type="text" value={counterassigningposition ? counterassigningposition : ''} onClick={() => setIsCounterAssigningPositionOpen(true)} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isCounterAssigningPositionOpen} onClose={() => setIsCounterAssigningPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.reporting_position && position.p_rec_id !== formData.dg_admin)} onSelect={counteAssigningPositionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="counter_assigning" label="Counter Assigning" placeholder="Enter Counter Assigning Officer" type="text" value={counterassigningposition ? counterassigningposition : ''} onClick={() => setIsCounterAssigningPositionOpen(true)} />
            }

            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="dg_admin" label="DG Admin" placeholder="Select DG Admin" type="text" value={dgadmin ? dgadmin : ''} onClick={() => setIsDgAdminPositionOpen(true)} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isDgAdminPositionOpen} onClose={() => setIsDgAdminPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.reporting_position && position.p_rec_id !== formData.counter_assigning_position)} onSelect={dgAdminClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="dg_admin" label="DG Admin" placeholder="Enter DG Admin" type="text" value={formData.dg_admin} onClick={() => setIsDgAdminPositionOpen(true)} />
            }

          </Grid>
        </Grid>
      </form>


      {loading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {refreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
              approvalmatrix && approvalmatrix?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={approvalmatrix.results}
                  isAddNewButton={true}
                  customPageSize={10}
                  RowFilterWith="a_m_rec_id"
                  onRowClick={handleRowClick}
                  minHeight={"calc(100vh - 360px)"}
                />
              ) : null
            )}
        </>
      )}

      <Dialog open={approvalmatrixupdatedialog} onClose={() => setapprovalmatrixupdatedialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} > <Warning />Do you want to update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setapprovalmatrixupdatedialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setapprovalmatrixupdatedialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to delete your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDelete(); setdeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setdeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  )
}

export default ApprovalMatrix;
