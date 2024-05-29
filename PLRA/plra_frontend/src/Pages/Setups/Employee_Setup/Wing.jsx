import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Loader, ErrorHandler, Multi_Dropdown, DialogBox } from '../../../Components/index';
import {
  useGetWingQuery, usePostWingMutation,
  useUpdateWingMutation, useDeleteWingMutation, useGetPositionQuery
} from '../../../Features/API/API';
import { MyTableContainer } from '../../../Components/index';
import { showToast } from '../../../Components/Common/ToastCard'
import "../../Styles.css"
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';

const Wing = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  //States
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    wing_id: '', wing_name: '', director_concern_position: '', adg: ''
  });
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [adgDialogOpen, setAdgDialogOpen] = useState(false);
  const [dcpDialogOpen, setDcpDialogOpen] = useState(false);
  const [adgName, setAdgName] = useState("");
  const [dcpName, setDcpName] = useState("");



  // Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetWingQuery();
  const { data: PositionData, isLoading: Positionloading, isError: PoitionrefreshError, error: PoitionqueryError, Poitionrefetch } = useGetPositionQuery();


  const PosHeader = [
    { field: 'position_id', headerName: 'Position ID', minWidth: 150, },
    { field: 'job?.job_title', headerName: 'Job Title', minWidth: 200, valueGetter: (params) => params.row?.job?.job_title || '', },
    { field: 'position_desc', headerName: 'Position Description', minWidth: 250, },
    { field: 'wing', headerName: 'Wing', minWidth: 220, valueGetter: (params) => params.row?.wing?.wing_name || '', },
    { field: 'sub_wing', headerName: 'Sub Wing', minWidth: 220, valueGetter: (params) => params.row?.sub_wing?.sub_wing_name || '', },

  ];

  const [postWing] = usePostWingMutation();
  const [updateWing] = useUpdateWingMutation();
  const [deleteWing] = useDeleteWingMutation();

  useEffect(() => {
    refetch();
  }, []);

  // function
  const resetForm = () => {
    setFormErrors({});
    setIsRowSelected(false)
    setFormData({ wing_id: '', wing_name: '', director_concern_position: '', adg: '' })
    setAdgName("");
    setDcpName("");

  }
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRowClick = useCallback((event) => {
    setIsRowSelected(true);
    setFormData({ wing_id: event.row.wing_id, wing_name: event.row.wing_name, adg: event?.row?.adg?.p_rec_id, director_concern_position: event?.row?.director_concern_position?.p_rec_id });
    setAdgName(event?.row?.adg?.position_desc);
    setDcpName(event?.row?.director_concern_position?.position_desc);
    setSelectedRowID(event.row.w_rec_id);
  }, []);

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setDeleteDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  const handleSaveData = async (e) => {
    e.preventDefault();
    try {
      const res = await postWing(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res.error);
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record created Successfully`, "success");
      resetForm();
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  const handleDeleteData = useCallback(async () => {
    try {
      const res = await deleteWing({ selectRowID });
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
  }, [deleteWing, selectRowID, refetch]);

  const handleUpdateData = useCallback(async () => {
    try {
      const res = await updateWing({ selectRowID, updateWingData: formData });
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
  }, [updateWing, selectRowID, formData, refetch]);

  const adgClickHandler = (selectedRow) => {
    setAdgName(selectedRow.position_desc)
    setFormData((prevData) => ({ ...prevData, adg: selectedRow.p_rec_id }))
    setAdgDialogOpen(false);
  }

  const dcpClickHandler = (selectedRow) => {
    setDcpName(selectedRow?.position_desc)
    setFormData((prevData) => ({ ...prevData, director_concern_position: selectedRow?.p_rec_id }))
    setDcpDialogOpen(false);
  }

  const columns = [
    {
      field: 'wing_id',
      headerName: 'Wing ID',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },

    {
      field: 'wing_name', headerName: 'Wing Name', minWidth: 250, renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'adg',
      headerName: 'ADG',
      minWidth: 300,
      valueGetter: (params) => params.row?.adg?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: 'director_concern_position',
      headerName: 'Director Position',
      minWidth: 250,
      valueGetter: (params) => params.row?.director_concern_position?.position_id || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    }
  ];



  return (
    <Box sx={{ width: "100%" }} >
      <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, alignItems: 'center' }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Wing</Typography>
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
        <Grid container spacing={{ xs: 1, md: 4 }} columnSpacing={8} sx={{ mb: 4, py: 2, }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputField name="wing_id" label="Wing ID" placeholder="Enter Wing ID" type="text" value={formData.wing_id} onChange={handleChange} mandatory InputState={isRowSelected ? true : false} error={formErrors?.data?.wing_id} />

            {PositionData && PositionData?.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="adg" label="ADG" placeholder="Select ADG Position " value={adgName || '' || formData.adg} type="text" isShowIcon={true} onClick={() => setAdgDialogOpen(true)} error={formErrors?.data?.adg} />
                <Multi_Dropdown isOpen={adgDialogOpen} onClose={() => setAdgDialogOpen(false)} MinimumWidth={"300px"} tableHeader={PosHeader} tableRows={PositionData?.results || PositionData} onSelect={adgClickHandler} RowFilterWith="p_rec_id" />
              </div>
              :
              <InputField name="adg" label="ADG" placeholder="Select ADG " value={adgName || ''} type="text" isShowIcon={true} onClick={() => setAdgDialogOpen(true)} error={formErrors?.data?.adg} />
            }

          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2, }}>
            <InputField name="wing_name" label="Wing Name" placeholder="Enter Wing Name" type="text" value={formData.wing_name} onChange={handleChange} mandatory error={formErrors?.data?.wing_name} />
            {PositionData && PositionData?.results ?
              <div sx={{ cursor: 'pointer' }}>
                <InputField name="director_concern_position" label="Director" placeholder="Select Director Concern Position" value={dcpName || '' || formData.director_concern_position} type="text" isShowIcon={true} onClick={() => setDcpDialogOpen(true)} error={formErrors?.data?.director_concern_position} />
                <Multi_Dropdown isOpen={dcpDialogOpen} MinimumWidth={"300px"} onClose={() => setDcpDialogOpen(false)} tableHeader={PosHeader} tableRows={PositionData?.results || PositionData} onSelect={dcpClickHandler} RowFilterWith="p_rec_id" />
              </div>
              :
              <InputField name="director_concern_position" label="Director Position" placeholder="Select Director Concern Position" value={dcpName || '' || formData.director_concern_position} type="text" isShowIcon={true} onClick={() => setAdgDialogOpen(true)} error={formErrors?.data?.director_concern_position} />
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
              data && data?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={data.results}
                  isAddNewButton={true}
                  RowFilterWith="w_rec_id"
                  onRowClick={handleRowClick}
                  customPageSize={8}
                  minHeight={'calc(100vh - 408px)'}
                />
              ) : null
            )}
        </>
      )}
    </Box>
  );
};

export default Wing;
