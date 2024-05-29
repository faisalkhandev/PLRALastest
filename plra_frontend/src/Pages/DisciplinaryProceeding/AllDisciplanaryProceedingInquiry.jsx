import React, { useEffect, useState } from 'react'
import { Breadcrumb, Btn, CheckBoxDataGrid, ErrorHandler, Loader, MyTableContainer } from '../../Components'
import { Box, Dialog, Grid, Typography } from '@mui/material'
import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios'
import { useGetDisciplinaryProceedingInquiryQuery } from '../../Features/API/DisciplinaryProceedings'
import DisciplinaryProcedingDialog from '../Dasboard/Approvals/DisciplinaryProcedingApprovals/DisciplinaryProcedingDialog'
import { gridCellStyle } from '../../Utils/cellstyle'


const AllDisciplanaryProceedingInquiry = () => {

  const theme = useTheme();
  const [user_id, set_user_id] = useState(null)
  const [value, setValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [DialogData, setDialogData] = useState(null)
  const [leave_request_id, setRequest_id] = useState(null);




  useEffect(() => {
    const id = Cookies.get('user_id');
    set_user_id(id)
  }, [user_id])

  const { data: DisciplanaryData, isLoading: DisciplanaryLoading, isError: DisciplanaryRefreshError, error: DisciplanaryQueryError, refetch } = useGetDisciplinaryProceedingInquiryQuery();


  const handleRowClick = async (params) => {
    const data = await axios.get(`http://127.0.0.1:8000/desiplinary-preceeding/DisciplinaryProceedingInquiryAPI/${params?.row?.id}`);
    setSelectedHistory(data.data);
    setDialogOpen(true);
    setRequest_id(params?.row?.id);
  };

  const handleChange = (event, newValue) => setValue(newValue);
  const handleCloseDialog = () => { setDialogOpen(false); };


  useEffect(() => {
    
 refetch();
  }, [DisciplanaryData])


  const columns = [
    {
        field: 'employee', headerName: 'Employee ',
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.employee?.first_name+" "+params?.row?.employee?.last_name}
          </span>
        );
      },
    },
    {field: 'prob_officer', headerName: 'Probe Officer', 
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.prob_officer?.first_name+" "+params?.row?.prob_officer?.last_name}
          </span>
        );
      },
    },
    {
      field: "regular_inquiry_officer",
      headerName: "Inquiry Officer",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.regular_inquiry_officer?.first_name+" "+params?.row?.regular_inquiry_officer?.last_name}
          </span>
        );
      },
    },
    {
      field: "inquiry_start_date",
      headerName: "Start Date",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.inquiry_start_date}
          </span>
        );
      },
    },
    {
      field: "inquiry_reason",
      headerName: "Inquiry Reason",
      minWidth: 200,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.inquiry_reason}
          </span>
        );
      },
    },
    
    {
      field: "inquiry_status",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        const cellStyle = gridCellStyle(theme,params?.row?.inquiry_status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            onClick={onView}
            className="table_first_column"
          >
            {params?.row?.inquiry_status}
          </span>
        );
      },
    },

  ]


  //functions

  

  

  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className="EmployeeTableBox" >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
            <Breadcrumb title="All Disciplinary Proceeding " breadcrumbItem='Disciplinary Proceedings' />
            <Link to="/DisciplinaryProceedingApply">
                <Btn type="Apply" />
            </Link>
        </Box>
        {DisciplanaryLoading ? (
        <Loader />
      ) : (
        <>
          {DisciplanaryRefreshError ? (<ErrorHandler online={navigator.onLine} />)
            : (
                DisciplanaryData && DisciplanaryData?.results ? (
                <CheckBoxDataGrid
                  columns={columns}
                  data={DisciplanaryData?.results}
                  tableHeading="Employee"
                  isAddNewButton={true}
                  customPageSize={20}
                  RowFilterWith="id"
                  minHeight={'calc(100vh - 200px)'}
                //   onSelectionModelChange={handleSelectionModelChange}
                />
              ) : null
            )}
        </>
      )}
       <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ width: "800px", p: 2, height: "70vh", overflow: "scroll" }}>
          <Typography variant="h4" color="initial" sx={{ textAlign: "center", mb: 2 }} >
            Disciplinary Proceeding 
          </Typography>
          <DisciplinaryProcedingDialog DialogData={selectedHistory} />
        </Box>
      </Dialog>


    </div>
);
};



export default AllDisciplanaryProceedingInquiry
