import { useTheme } from '@emotion/react';
import { Box } from "@mui/material";
import React, { useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Btn, ErrorHandler, Loader, MyTableContainer } from '../../Components';
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { useGetProgressionQuery, useLazyGenerateProgressionQuery, useLazyUpdateProgressionQuery } from '../../Features/API/ProgressionApi.js';

const ProgressionProcess = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const ProgressionEmp = useSelector((state) => state.counter.ProgressionEmp);
  const [id, setId] = React.useState(null);
  const [trigger, result] = useLazyGenerateProgressionQuery();
  const [updateTrigger] = useLazyUpdateProgressionQuery();


  const {
    data: ProgressionData,
    isLoading: Progressionloading,
    isError: ProgressionrefreshError,
    refetch,
  } = useGetProgressionQuery();

  console.log(ProgressionData);

  const pendingRecord = ProgressionData?.map((approval) => ({
    id: approval?.id,
    empno: approval?.employee.id,
    emp: approval?.employee?.first_name + " " + approval.employee?.last_name,
    job_title: approval?.employee?.position?.job?.job_title,
    center_name: approval?.employee?.position?.location?.center_name,
    promote_job: approval?.promote_job?.job_title,
    pending_inquiry: approval?.pending_inquiry,
    ppg_level: approval?.employee?.position?.job?.ppg_level?.ppg_level,
    promote_ppg_level: approval?.promote_ppg_level?.ppg_level,
    major_penalities: approval?.major_penalities,
    post_vacant: approval?.post_vacant,
    status: approval?.status,
  })) || [];

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };
  // const handleApiCall = async () => {
  //   try {
  //     if (ProgressionEmp) {
  //       for (const id of ProgressionEmp) {
  //         updateTrigger(id)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error updating progression:', error);
  //   }
  //   setInterval(() => {
  //     refetch();
  //   }, 500);
  //   setTimeout(async () => {
  //     const dta = await trigger()
  //     navigate(`/Progression/ProgressionDoc/${dta?.data[0]?.document.progression_document_rec_id}`)
  //   }, 2000);
  // };

  useEffect(() => {
    refetch();
  }, [refetch]);

  const pendingcolumns = [
    {
      field: "id", headerName: "ID",width:5, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.id}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 50, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.status}
        </span>
      },
    },
    // {
    //   field: "employee_no", headerName: "Employee No", minWidth: 50, renderCell: renderNullInRed,
    //   renderCell: (params) => {
    //     return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
    //       {params?.row?.empno}
    //     </span>
    //   },
    // },
    {
      field: "name", headerName: "Employee Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.emp}
        </span>
      },
    },
    {
      field: "job_title", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.job_title}
        </span>
      },
    },
    {
      field: "center_name", headerName: "Center Name", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.center_name}
        </span>
      },
    },
    {
      field: "promote_job", headerName: "Promoted Job", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_job}
        </span>
      },
    },
    {
      field: "Ppg_Level", headerName: "PPG Level", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.ppg_level}
        </span>
      },
    },
    {
      field: "promote_ppg_level", headerName: "Promoted PPG Level", minWidth: 150, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.promote_ppg_level}
        </span>
      },
    },
    {
      field: "action", headerName: "Action", minWidth: 200,
      renderCell: (params) => {
        return (
          <Link
            to={`/Progression/${params?.row?.id}`}
          >
            <Btn innerStyle={{ backgroundColor: theme.palette.success.main, color: "white" }} type="Create Elevation" />
          </Link>

        );
      },
    },
  ];

  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Breadcrumb title="Elevation" breadcrumbItem="Elevation / Elevation Pending List" />
        {/* <Btn type="Generate Progression" onClick={handleApiCall} /> */}
      </Box>
      {Progressionloading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {ProgressionrefreshError ? <ErrorHandler online={navigator.onLine} /> :
            ProgressionData ?
              <MyTableContainer columns={pendingcolumns} data={pendingRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" /> : null
          }
        </>
      }
    </div>
  );
};

export default ProgressionProcess;
