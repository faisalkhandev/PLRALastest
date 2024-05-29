import React, { useState, Fragment } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Multi_Dropdown, MyTableContainer } from '../../../Components/index';
import { useGetRatingTypeLikertScalesQuery,usePostRatingTypeLikertScalesMutation,useUpdateRatingTypeLikertScalesMutation,useGetRatingModelQuery} from '../../../Features/API/API';
import "../../Styles.css"
import { toast } from 'react-toastify'
import { ratingModelHeader } from "../../../Data/Setup_Data/Setup_Data";


const Rating_Types_Likert_Scales = () => {
  const theme = useTheme();

  //States
  const [formData, setFormData] = useState({ rating_model: '', grade: '', percentile_range: '' });
  const [editDialog, setEditDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [ratingModelDialog, setRatingModelDialog] = useState(false);
  const [ratingModelData, setRatingModelData] = useState("");
  const [ratingTypeLikertScalesDialog, setRatingTypeLikertScalesDialog] = useState(false);


    //Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetRatingTypeLikertScalesQuery();
    const [postRatingTypeLikertScales] = usePostRatingTypeLikertScalesMutation();
    const [updateRatingTypeLikertScales] = useUpdateRatingTypeLikertScalesMutation();
    const { data: rating_model_data, isLoading: rating_data_loading, isError: rating_data_refreshError, error: rating_data_queryError, rating_data_refetch } = useGetRatingModelQuery();
   
  
  //Functions
  const resetForm = () => {
    setIsRowSelected(false)
    setFormData({  rating_model: '', grade: '', percentile_range: ''  });
    setRatingModelData("")
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const ratingModelClickHandler = (selectedRow) => {
    setRatingModelData(selectedRow.name)
    setFormData({ ...formData, rating_model: selectedRow.id, });
    setRatingModelDialog(false);
  };

  const handleRowClick = (event) => {
    setIsRowSelected(true)
    setFormData({
      rating_model: event.row.rating_model.id,
      grade: event.row.grade,
      percentile_range: event.row.percentile_range,
    })
    setSelectedRowID(event.row.id);
    setRatingModelData(event.row.rating_model.name)
  };

  const handleSaveData = async (e) => {
    if (formData.rating_model == '' || formData.grade == '' || formData.percentile_range == '' ) {
      toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
    }
    else {
    e.preventDefault();
      try {
        const res = await postRatingTypeLikertScales(formData);
        if (res.error) {
          if (res.error.status === 400) { toast.error("ID already exist", { position: "top-center", autoClose: 3000 }) }
          else { toast.error("Something went wrong !!!", { position: "top-center", autoClose: 3000 }) }
        } else {
          toast.success("Rating Likert Scales created successfully.", { position: "top-center", autoClose: 3000 })
          setFormData({  rating_model: '', grade: '', percentile_range: ''  });
          setRatingModelData("")
          refetch();
        }
      } catch (err) {
        console.error('Error creating Rating Likert Scales:', err, { position: "top-center", autoClose: 3000 });
      }
    };
  }

  const handleUpdateData = async (e) => {
    try {
      const res = await updateRatingTypeLikertScales({ selectRowID, updateRatingTypeLikertScalesData: formData });
      if (res.error) {
        toast.error("ID already exist", { position: "top-center", autoClose: 3000 });
      } else {
        toast.success("Rating Likert Scale Updated successfully.", { position: "top-center", autoClose: 3000 });
        setFormData({  rating_model: '', grade: '', percentile_range: ''  });
        setRatingModelData("")
        refetch();
      }
    } catch (err) { console.error('Error creating Rating Likert Scale:', err, { position: "top-center", autoClose: 3000 }); }
  }

  
  const columns = [
    {
      field: 'id', headerName: 'Likert Scale ID', flex: true,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
      },
    },
    {
      field: 'rating_model', headerName: 'Model Name', flex: true,
      renderCell: (params) => { return (<span > {params.row.rating_model.name } </span>); },
    },
    { field: 'percentile_range', headerName: 'Percentile Range', flex: true },
    { field: 'grade', headerName: 'Grade', flex: true },
  ];

  return (
    <Fragment >
  <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}> Rating Type Likert Scales</Typography>
  <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
  <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
  <Btn type="delete" onClick={()=>setRatingTypeLikertScalesDialog(true)}/>
  <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
  </Box>
    
  <form action="">
  <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4}} >
    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {rating_model_data && rating_model_data.results ?
          <div>
            <InputField name="rating_model" label="Rating Model" placeholder="Select Rating Model" value={ratingModelData} isShowIcon={true} onClick={() => setRatingModelDialog(true)} />
            <Multi_Dropdown RowFilterWith={"id"} isOpen={ratingModelDialog} tableHeader={ratingModelHeader} tableRows={rating_model_data.results} onSelect={ratingModelClickHandler} />
          </div> : <InputField name="rating_model" label="Rating Model" placeholder="Select Rating Model" value={ratingModelData} isShowIcon={true} onClick={() => setRatingModelDialog(true)} />
      }
      <InputField name="grade" label="Grade" placeholder="Enter Grade" type="text" value={formData.grade || ""} onChange={handleChange}    />  
    </Grid>
    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>     
      <InputField name="percentile_range" label="Percentile Range" placeholder="Enter Percentile Range" type="text" value={formData.percentile_range || ""} onChange={handleChange} />    
    </Grid> 
  </Grid>
</form>

{loading && <p>Loading...</p>}
{refreshError && <p>Error while refreshing: {refreshError.message}</p>}
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
      
      <Dialog open={ratingTypeLikertScalesDialog} onClose={() => setRatingTypeLikertScalesDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '350px', p: 2 }}>
          <Typography variant="h6" color="initial" >Do you want to delete this record.</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setRatingTypeLikertScalesDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setRatingTypeLikertScalesDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
      
</Fragment>
  )
}

export default Rating_Types_Likert_Scales
