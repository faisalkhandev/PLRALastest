import React, { Fragment, useState } from 'react';
import { Typography, Box, Grid, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Warning } from '../../../Assets/Icons';
import { Btn, InputField, MyTableContainer, Multi_Dropdown, Loader, ErrorHandler, DialogBox } from '../../../Components/index';
import { toast } from 'react-toastify';
import { useGetPositionQuery, useGetApprovalMatrixAPIQuery, usePostApprovalMatrixAPIMutation, useUpdateApprovalMatrixAPIMutation, useDeleteApprovalMatrixAPIMutation } from '../../../Features/API/API';
import { showToast } from '../../../Components/shared/Toast_Card';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
const ApprovalMatrix = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});


  // State for form data
  const [formData, setFormData] = useState({
    position: '',
    reporting_position: '',
    counter_assigning_position: ''
  });
  const [position, setposition] = useState("")
  const [reportingposition, setreportingposition] = useState("")
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
  //functions
  const resetForm = () => {
    setFormErrors({});
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
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record Deleted Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }

  }

  const handleDeleteDialog = () => {
    if (isRowSelected) {
      setdeleteDialog(true)
    }
    else {
      return showToast('Record not Selected', 'error');

    }
  }
  const handleSaveData = async (e) => {
    try {
      const res = await Postapprovalmatrix(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record created Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }
  const handleUpdateData = async (e) => {
    try {
      const res = await updateapprovalmatrix({ selectRowID, updateApprovalMatrix: formData });
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record updated Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  }
  const handleRowClick = (event) => {
    setIsRowSelected(true);
    setFormData({
      position: event.row.position ? event.row.position.p_rec_id : "",
      reporting_position: event.row.reporting_position ? event.row.reporting_position.p_rec_id : "",
      counter_assigning_position: event.row.counter_assigning_position ? event.row.counter_assigning_position.p_rec_id : "",
      dg_admin: event.row.dg_admin ? event.row.dg_admin.p_rec_id : null,
    });

    setposition(event.row.position ? event.row.position.position_desc : "");
    setreportingposition(event.row.reporting_position ? event.row.reporting_position.position_desc : "");
    setcounterassigningposition(event.row.counter_assigning_position ? event.row.counter_assigning_position.position_desc : "");
    setdgadmin(event.row.dg_admin ? event.row.dg_admin.position_desc : "");
    setSelectedRowID(event.row.a_m_rec_id);
  };
  // const handleRowClick = (event) => {
  //   setIsRowSelected(true);
  //   setFormData({
  //     position: event?.row?.position?.p_rec_id,
  //     reporting_position: event?.row?.reporting_position?.p_rec_id,
  //     counter_assigning_position: event?.row?.counter_assigning_position ? event?.row?.counter_assigning_position?.p_rec_id : "",
  //     dg_admin: event?.row?.dg_admin.p_rec_id,
  //   });

  //   setposition(event?.row?.position?.position_id)

  //   setreportingposition(event?.row?.reporting_position?.position_id)
  //   setcounterassigningposition(event?.row?.counter_assigning_position ? event?.row?.counter_assigning_position?.position_id : "");
  //   setdgadmin(event?.row?.dg_admin.position_id);
  //   setSelectedRowID(event?.row?.a_m_rec_id);
  // };
  const positionClickHandler = (selectedRow) => {

    setFormData({ ...formData, position: selectedRow.p_rec_id, });
    setisPositionOpen(false);
    setposition(selectedRow?.position_id)
  };
  const reportingPositionClickHandler = (selectedRow) => {

    setFormData({
      ...formData,
      reporting_position: selectedRow.p_rec_id,
    });
    setisreportingPositionOpen(false);
    setreportingposition(selectedRow?.position_id)
  };
  const counteAssigningPositionClickHandler = (selectedRow) => {
    setFormData({
      ...formData,
      counter_assigning_position: selectedRow?.p_rec_id,
    });
    setIsCounterAssigningPositionOpen(false);
    setcounterassigningposition(selectedRow?.position_id);

  };

  const dgAdminClickHandler = (selectedRow) => {
    setFormData({
      ...formData,
      dg_admin: selectedRow.p_rec_id,
    });
    setIsDgAdminPositionOpen(false);
    setdgadmin(selectedRow.position_id);
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
        return (<span className="table_first_column"> {params?.row?.wing?.wing_name}</span>)
      }
    },
    {
      field: "sub_wing", headerName: "Sub Wing", flex: 1, width: 180, renderCell: (params) => {
        return (<span className="table_first_column">{params?.row?.sub_wing?.sub_wing_name}</span>);
      }
    },

  ];

  const columns = [
    {
      field: "position",
      headerName: "Position",
      minWidth: 450,
      valueGetter: (params) => params.row?.position?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "reporting_position",
      headerName: "Reporting Position",
      minWidth: 500,
      valueGetter: (params) => params.row?.reporting_position?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: "counter_assigning_position",
      headerName: "Counter Assigning Position",
      minWidth: 500,
      valueGetter: (params) => params.row?.counter_assigning_position?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    },
    {
      field: "dg_admin",
      headerName: "ADG Admin",
      minWidth: 10,
      valueGetter: (params) => params.row?.dg_admin?.position_desc || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      }
    }
  ];


  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", justifyContent: 'end', marginBottom: 3, gap: 1, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Approval Matrix</Typography>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
        <Btn onClick={isRowSelected ? () => setapprovalmatrixupdatedialog(true) : handleSaveData} type="save" />
        {
          approvalmatrixupdatedialog ?
            <DialogBox
              open={setapprovalmatrixupdatedialog}
              onClose={() => setapprovalmatrixupdatedialog(false)}
              closeClick={() => setapprovalmatrixupdatedialog(false)}
              sureClick={() => { handleUpdateData(); setapprovalmatrixupdatedialog(false); }}
              title={"Are you sure you want to update the record?"}
            /> : ''
        }
        <Btn type="delete" onClick={handleDeleteDialog} />
        {
          deleteDialog ?
            <DialogBox
              open={deleteDialog}
              onClose={() => setdeleteDialog(false)}
              closeClick={() => setdeleteDialog(false)}
              sureClick={() => { handleDelete(); setdeleteDialog(false); }}
              title={"Are you sure you want to delete the record?"}
            /> : ''
        }
      </Box>
      <form action="">
        <Grid container columnSpacing={8} spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onClick={() => setisPositionOpen(true)} error={formErrors?.data?.position} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={ispositionOpen} onClose={() => setisPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results} onSelect={positionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="position" label="Position" placeholder="Select Position" type="text" value={position ? position : ''} onChange={handleChange} error={formErrors?.data?.position} />
            }
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="reporting_position" label="Reporting Position" placeholder="Select Reporting Position" type="text" value={reportingposition ? reportingposition : ''} onClick={() => setisreportingPositionOpen(true)} error={formErrors?.data?.reporting_position} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isreportingpositionOpen} onClose={() => setisreportingPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.counter_assigning_position && position.p_rec_id !== formData.dg_admin)} onSelect={reportingPositionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="reporting_position" label="Reporting Position" placeholder="Select Reporting Position" type="text" value={reportingposition ? reportingposition : ''} onClick={() => setisreportingPositionOpen(true)} error={formErrors?.data?.reporting_position} />
            }
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="counter_assigning" label="Counter Assigning" placeholder="Select Counter Assigning Officer" type="text" value={counterassigningposition ? counterassigningposition : ''} onClick={() => setIsCounterAssigningPositionOpen(true)} error={formErrors?.data?.counter_assigning} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isCounterAssigningPositionOpen} onClose={() => setIsCounterAssigningPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.reporting_position && position.p_rec_id !== formData.dg_admin)} onSelect={counteAssigningPositionClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="counter_assigning" label="Counter Assigning" placeholder="Enter Counter Assigning Officer" type="text" value={counterassigningposition ? counterassigningposition : ''} onClick={() => setIsCounterAssigningPositionOpen(true)} error={formErrors?.data?.counter_assigning} />
            }

            {positionData && positionData.results ?
              <div>
                <InputField isShowIcon={true} name="dg_admin" label="DG Admin" placeholder="Select DG Admin" type="text" value={dgadmin ? dgadmin : ''} onClick={() => setIsDgAdminPositionOpen(true)} error={formErrors?.data?.dg_admin} />
                <Multi_Dropdown RowFilterWith={"p_rec_id"} isOpen={isDgAdminPositionOpen} onClose={() => setIsDgAdminPositionOpen(false)} MinimumWidth={'800px'} tableHeader={position_columns} tableRows={positionData.results.filter((position) => position.p_rec_id !== formData.position && position.p_rec_id !== formData.reporting_position && position.p_rec_id !== formData.counter_assigning_position)} onSelect={dgAdminClickHandler} />
              </div>
              :
              <InputField isShowIcon={true} name="dg_admin" label="DG Admin" placeholder="Enter DG Admin" type="text" value={formData.dg_admin} onClick={() => setIsDgAdminPositionOpen(true)} error={formErrors?.data?.dg_admin} />
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
                  customPageSize={9}
                  RowFilterWith="a_m_rec_id"
                  onRowClick={handleRowClick}
                  minHeight={"calc(100vh - 383px)"}
                />
              ) : null
            )}
        </>
      )}
    </Fragment>
  )
}

export default ApprovalMatrix;
