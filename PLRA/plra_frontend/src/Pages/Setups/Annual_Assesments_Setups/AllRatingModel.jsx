import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../../Components/Common/BreadCrumb';
import { Btn, Loader, ErrorHandler } from '../../../Components';
import { useGetAllRatingModelQuery } from '../../../Features/API/AnnualAssessment';
import { MyTableContainer } from '../../../Components';
import { Box, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import '../../Styles.css'
import Rating_Models from './Rating_Models';
import Theme from '../../../Theme/Light__Theme';

const renderNullInRed = (params) => {
  const Theme = useTheme();
  const value = params.value;
  if (value === null) <span style={{ color: 'red' }}>Null</span>
  return value;
};


const AllRatingModel = () => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [Id, SetId] = useState(null);

  const [showComponent,setShowComponent]=useState(false);
  const { data: RatingModel, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch } = useGetAllRatingModelQuery();
  useEffect(() => {
    refetch();
  }, []);
  const columns = [

    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => (
        <span>
          <Link to={'#'} style={{ color: "#000" }}   className="table_first_column"onClick={()=>onView(params)}>
          {params.value }
          </Link>
        </span>
      ),
    },
    {
      field: "year",
      headerName: "Year",
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => (
        <span>
          {params.value?.hr_year }
        </span>
      ),
    },
   

    {
      field: "type",
      headerName: "Type",
      minWidth: 200,
      renderCell: (params) => (
        <span>
          {params.value }
        </span>
      ),
      
    },
    
  ];
  const onView=(params)=>{
    setShowComponent(true);
    SetId(params.id);
  }
  const handleSaveSuccess = () => {
    setShowComponent(false);
    refetch() // Update showComponent state when data is saved
  };

  return (
    
    <>
    {showComponent ? (
      <Rating_Models onSaveSuccess={handleSaveSuccess} Id={Id} />
    ) : (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Typography
          variant="h4"
          sx={{
            width: "100%",
            color: Theme.palette.primary.main,
            fontWeight: "500",
            fontSize:"20px"
          }}
        >
        Rating Model
        </Typography>
        <Btn type="add" onClick={()=>setShowComponent(true)}/>
      </Box>
      {Employeeloading ? (
        <Loader />
      ) : (
        <>
          {EmployeerefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
                RatingModel && RatingModel?.results ? (
                <MyTableContainer
                  columns={columns}
                  data={RatingModel.results}
                  tableHeading="Employee"
                  isAddNewButton={true}
                  customPageSize={20}
                  RowFilterWith="id"
                  minHeight={"calc(100vh - 300px)"}
                />
              ) : null
            )}
        </>
      )}
    </div>
    )
                }
                </>
  )
}

export default AllRatingModel