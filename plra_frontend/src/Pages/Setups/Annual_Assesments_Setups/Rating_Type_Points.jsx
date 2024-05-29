import React, { useState, Fragment } from 'react';
import { Typography, Grid, Box, Dialog, Switch } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer } from '../../../Components/index';
import { useGetRatingTypePointsQuery, usePostRatingTypePointsMutation, useUpdateRatingTypePointsMutation, useGetRatingModelQuery, useGetRatingModelTypesQuery } from '../../../Features/API/API';
import "../../Styles.css"
import SimpleDropdown from '../../../Components/Common/SimpleDropDown'
import { toast } from 'react-toastify'
import { ratingModelHeader } from "../../../Data/Setup_Data/Setup_Data";

const Type_single_Dropdown = [{
  id: '1',
  value: 'system generated',
  label: 'System Generated'
},
{
  id: '2',
  value: 'reporting officer',
  label: 'Reporting Officer'
},
{
  id: '3',
  value: 'counter signing officer',
  label: 'Counter Signing Officer'
},
]


const Rating_Type_Points = () => {
  const theme = useTheme();

  //states
  const [formData, setFormData] = useState({
    rating_model: '', category: '', type: ' ',
    max_points: '', api_address: ' ', api: false,
  });
  const [isActive, setIsActive] = useState(formData.api);
  const [editDialog, setEditDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [ratingModelDialog, setRatingModelDialog] = useState(false);
  const [ratingModelData, setRatingModelData] = useState("");
  const [typeDialog, setTypeDialog] = useState(false);
  const [typeData, setTypeData] = useState("");
  const [ratingTypePointsDialog, setRatingTypePointsDialog] = useState(false);


  //Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetRatingTypePointsQuery();
  const [postRatingTypePoints] = usePostRatingTypePointsMutation();
  const [updateRatingTypePoints] = useUpdateRatingTypePointsMutation();
  const { data: rating_model_data, isLoading: rating_data_loading, isError: rating_data_refreshError, error: rating_data_queryError, rating_data_refetch } = useGetRatingModelQuery();

  //Functions
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({ rating_model: '', category: '', type: ' ', max_points: '', api_address: ' ', api: false, });
    setRatingModelData("");
    setIsActive(false); isRowSelected(false);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  //RatingModel Dialog Click Listeners
  const ratingModelClickHandler = (selectedRow) => {
    setRatingModelData(selectedRow.name)
    setFormData({ ...formData, rating_model: selectedRow.id, });
    setRatingModelDialog(false);
  };

  const handleRowClick = (event) => {
    setIsRowSelected(true)
    setFormData({
      rating_model: event.row.rating_model.id,
      category: event.row.category,
      max_points: event.row.max_points,
      type: event.row.type,
      api: event.row.api,
      api_address: event.row.api_address,
    })
    setSelectedRowID(event.row.id);
    setRatingModelData(event.row.rating_model.name)
    setIsActive(event.row.api)
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    if (formData.rating_model == '' || formData.category == '' || formData.max_points == '' || formData.type == '' || formData.api_address == '') {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
      try {
        const res = await postRatingTypePoints(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something went wrong !!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Rating Type Point create successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({ rating_model: '', category: '', type: ' ', max_points: '', api_address: ' ', api: false, });
          setRatingModelData("");
          refetch();
        }
      } catch (err) {
        console.error('Error creating Rating Type Point:', err, { position: "top-center", autoClose: 3000 });
      }
    };
  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updateRatingTypePoints({ selectRowID, updateRatingTypePointsData: formData });
      if (res.error) {
        toast.error("ID already exist", { position: "top-center", autoClose: 3000 });
      } else {
        toast.success("Rating Type Point  Updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({ rating_model: '', category: '', type: ' ', max_points: '', api_address: ' ', api: false, });
        setRatingModelData("");
        refetch();
      }
    } catch (err) { console.error('Error creating Rating Type Point :', err, { position: "top-center", autoClose: 3000 }); }
  }


  const columns = [
    {
      field: 'id', headerName: 'ID', flex: true,
      renderCell: (params) => {
        const onView = () => { handleRowClick(params); };
        return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
      },
    },
    {
      field: 'rating_model', headerName: 'Model Name', flex: true,
      renderCell: (params) => { return (<span > {params.row.rating_model.name} </span>); },
    },
    { field: 'category', headerName: 'Category', flex: true },
    { field: 'max_points', headerName: 'Max Points', flex: true },
    {
      field: 'type', headerName: 'Type', flex: true,
      renderCell: (params) => { return (<span > {params.row.type} </span>); },
    },
    { field: 'api', headerName: 'API', flex: true },
    { field: 'api_address', headerName: 'API Address', flex: true },
  ];

  return (
    <Fragment>
      <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}> Rating Type Point</Typography>
      <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
        <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        <Btn type="delete" onClick={() => setRatingTypePointsDialog(true)} />
        <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
      </Box>

      <form action="">
        <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {rating_model_data && rating_model_data.results ?
              <div>
                <InputField name="rating_model" label="Rating Model" placeholder="Select Rating Model" value={ratingModelData} isShowIcon={true} onClick={() => setRatingModelDialog(true)} />
                <Multi_Dropdown RowFilterWith={"id"} isOpen={ratingModelDialog} tableHeader={ratingModelHeader} tableRows={rating_model_data.results} onSelect={ratingModelClickHandler} />
              </div> : <InputField name="rating_model" label="Rating Model" placeholder="Select Rating Model" value={ratingModelData} isShowIcon={true} onClick={() => setRatingModelDialog(true)} />
            }
            <SimpleDropdown name='type' label='Type' value={formData.type} onChange={handleChange} options={Type_single_Dropdown} isShowIcon={true} />
            <Box className="inputBox" >
              <Typography sx={{ display: 'flex', marginTop: "3.3px", marginRight: '15px' }} >API:</Typography>
              <Switch sx={{ ml: 10.8 }} size="small" checked={isActive} onClick={(e) => { setIsActive(!isActive); setFormData((prevData) => ({ ...prevData, api: isActive })); }} name='active' />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InputField name="category" label="Category" placeholder="Enter Category" type="text" value={formData.category || ""} onChange={handleChange} />
            <InputField name="max_points" label="Max Points" placeholder="Enter Max Points" type="number" value={formData.max_points || ""} onChange={handleChange} />
            <InputField name="api_address" label="API Address" placeholder="Enter API Address" type="text" value={formData.api_address || ""} onChange={handleChange} />
          </Grid>
        </Grid>
      </form>

      {queryError && <p>Error while querying: {queryError.message}</p>}
      {data && (
        <MyTableContainer
          columns={columns}
          data={data.results}
          isAddNewButton={true}
          customPageSize={10}
          RowFilterWith="id"
          onRowClick={handleRowClick}
          outerCSS={{ mt: 4 }}
        />
      )}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" > Do you want to Update your data.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>

      <Dialog open={ratingTypePointsDialog} onClose={() => setRatingTypePointsDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to delete this record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setRatingTypePointsDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setRatingTypePointsDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  )
}

export default Rating_Type_Points
