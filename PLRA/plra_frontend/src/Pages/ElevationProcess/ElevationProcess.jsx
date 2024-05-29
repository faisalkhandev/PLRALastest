import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import CheckBoxDataGrid from "../../Components/Common/CheckBoxDataGrid.jsx";
// import {  useLazyUpdateElevationQuery, useLazyGenerateElevationQuery } from '../../Features/API/ElevationApi.js';
import { Loader, ErrorHandler, Btn, MyTableContainer } from "../../Components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveData,
  removeData,
  emptyArray,
} from "../../Features/Counter/CounterSlice.js";
import { Box, Tab, Tabs } from "@mui/material";
import Breadcrumb from "../../Components/Common/BreadCrumb";
import {
  useGetElevationQuery,
  useLazyUpdateElevationQuery,
  useLazyGenerateElevationQuery,
  useGetpendingdocumentQuery,
  useGethistoryElevationQuery,
  useGetclosedocumentQuery,
} from "../../Features/API/ElevationApi.js";
import { gridCellStyle } from "../../Utils/cellstyle.js";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";

const ElevationProcess = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ElevationEmp = useSelector((state) => state.counter.ElevationEmp);
  const [id, setId] = React.useState(null);
  const [value, setValue] = useState(0);
  const [trigger, result] = useLazyGenerateElevationQuery();
  const [updateTrigger] = useLazyUpdateElevationQuery();

  const {
    data: ElevationData,
    isLoading: Elevationloading,
    isError: ElevationrefreshError,
    refetch,
  } = useGetElevationQuery();
  const {
    data: DocumentData,
    isLoading: Documentloading,
    isError: DocumentrefreshError,
    refetch: Documentrefetch,
  } = useGetpendingdocumentQuery();
  const {
    data: CloseData,
    isLoading: Closeloading,
    isError: CloserefreshError,
    refetch: Closerefetch,
  } = useGetclosedocumentQuery();

  console.log(CloseData);

  const pendingRecord =
    DocumentData?.results?.map((approval) => ({
      id: approval.elevtion_to_l2_doc_rec_id,
      document_date: approval?.document_date,
      status: approval?.status,
    })) || [];

    console.log(pendingRecord);

  const historyRecord =
  CloseData?.results?.map((approval) => ({
      id: approval.document.elevtion_to_l2_doc_rec_id,
      document_date: approval?.document.document_date,
      status: approval?.document.status,
      approveby:approval?.approved_by
    })) || [];

    console.log(historyRecord);

  useEffect(() => {
    refetch();
    Documentrefetch();
    Closerefetch();
  }, [refetch, Documentrefetch,Closerefetch]);

  useLayoutEffect(() => {
    dispatch(emptyArray());
  }, []);

  const handleApiCall = async () => {
    if (ElevationEmp.length === 0) {
      // toggleErrorToast();
      toast.error("No Employee selected", {
        position: "top-center",
        autoClose: 3000,
      });
      return; // Exit the function early if no rows are selected
    }
    try {
      if (ElevationEmp) {
        for (const id of ElevationEmp) {
          updateTrigger(id);
        }
      }
    } catch (error) {
      console.error("Error updating elevation:", error);
    }
    setInterval(() => {
      refetch();
    }, 500);
    setTimeout(async () => {
      const dta = await trigger();
      navigate(`/Elevation/ElevationDoc/${dta?.data[0]?.document}`);
    }, 2000);
  };

  const [selectedRows, setSelectedRows] = React.useState([]);

  const handleSelectionModelChange = (selectionModel) => {
    setSelectedRows(selectionModel);
  };

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const handleFilterModelChange = (model) => {};

  const handleChange = (event, newValue) => setValue(newValue);

  const columns = [
    {
      field: "check",
      headerName: "",
      width: 17,
      renderCell: (params) => (
        <input
          type="checkbox"
          onChange={(e) => {
            handleCheckboxChange(params.row.id, e);
          }}
        />
      ),
    },
    {
      field: "id",
      headerName: "Line No",
      width: 70,
    },
    {
      field: "status",
      headerName: "Status",
      width: 10,
    },
    {
      field: "employee_no",
      headerName: "Employee ID",
      renderCell: (params) => {
        const onView = () => {
          setSelectedRows(params.row);
        };
        return (
          <Link style={{ color: "#379237", textDecoration: "underline" }}>
            {" "}
            {params.row.employee.employee_no}{" "}
          </Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      renderCell: (params) => (
        <span>
          {" "}
          {params?.row?.employee?.first_name +
            " " +
            params?.row?.employee?.last_name}{" "}
        </span>
      ),
    },
    {
      field: "job_title",
      headerName: "Job",
      minWidth: 160,
      renderCell: (params) => (
        <span> {params?.row?.employee?.position?.job?.job_title} </span>
      ),
    },
    {
      field: "position_desc",
      headerName: "Position",
      minWidth: 180,
      renderCell: (params) => (
        <span> {params?.row?.employee?.position?.position_desc} </span>
      ),
    },
    {
      field: "center_name",
      headerName: "Center",
      minWidth: 80,
      renderCell: (params) => (
        <span> {params?.row?.employee?.position?.location?.center_name} </span>
      ),
    },
    {
      field: "wing_name",
      headerName: "Wing",
      renderCell: (params) => (
        <span> {params?.row?.employee?.position?.wing?.wing_name} </span>
      ),
    },
    {
      field: "current_level",
      headerName: "Current Job Level",
      renderCell: (params) => <span> {"L" + params?.row?.current_level} </span>,
    },
    {
      headerName: "Elevation Job Level",
      renderCell: (params) => (
        <span> {`L${params?.row?.current_level + 1}`} </span>
      ),
    },
    {
      field: "current_level_start_date",
      headerName: "Current Job Level Start Date",
    },
    {
      field: "months_in_current_level",
      headerName: "Months in Current Job Level",
    },
  ];

  const pendingcolumns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <Link
            to={`/Elevation/ElevationDoc/${params?.row?.id}`}
            style={{ color: "#379237", textDecoration: "underline" }}
          >
            <span
              style={{ whiteSpace: "pre-wrap" }}
              className="table_first_column"
            >
              {params?.row?.id}
            </span>
          </Link>
        );
      },
    },
    {
      field: "document_date",
      headerName: "Document date",
      minWidth: 250,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            className="table_first_column"
          >
            {params?.row?.document_date}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme, params?.row?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            className="table_first_column"
          >
            {params?.row?.status}
          </span>
        );
      },
    },
  ];

  const historycolumns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <Link
            to={`/ElevationHistory/${params?.row?.id}`}
            style={{ color: "#379237", textDecoration: "underline" }}
          >
            <span
              style={{ whiteSpace: "pre-wrap" }}
              className="table_first_column"
            >
              {params?.row?.id}
            </span>
          </Link>
        );
      },
    },
    {
      field: "approveby",
      headerName: "Approve By",
      minWidth: 250,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            className="table_first_column"
          >
            {params?.row?.approveby}
          </span>
        );
      },
    },
    {
      field: "document_date",
      headerName: "Document date",
      minWidth: 250,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        return (
          <span
            style={{ whiteSpace: "pre-wrap" }}
            className="table_first_column"
          >
            {params?.row?.document_date}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme, params?.row?.status);
        return (
          <span
            style={{ whiteSpace: "pre-wrap", ...cellStyle }}
            className="table_first_column"
          >
            {params?.row?.status}
          </span>
        );
      },
    },
  ];

  const handleCheckboxChange = useCallback(
    (rowId, e) => {
      if (e.target.checked) {
        dispatch(saveData(rowId));
      }
      if (!e.target.checked) {
        dispatch(removeData(rowId));
      }
    },
    [dispatch]
  );

  return (
    <div
      style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }}
      className="EmployeeTableBox"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Breadcrumb
          title="Progression"
          breadcrumbItem="Progression / Progression Pending List"
        />
        <Box
          sx={{
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "end",
            marginBottom: "10px",
          }}
        >
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="Pending Progression" />
            <Tab label="Pending Documents" />
            <Tab label="History Progression" />
          </Tabs>
        </Box>
      </Box>

      {Elevationloading ? (
        <Loader />
      ) : (
        <>
          {ElevationrefreshError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : ElevationData && value === 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginBottom: "10px",
                }}
              >
                <Btn type="Generate Progression" onClick={handleApiCall} />
              </Box>
              <CheckBoxDataGrid
                columns={columns}
                data={ElevationData}
                tableHeading="Employee"
                isAddNewButton={true}
                customPageSize={20}
                RowFilterWith="id"
                minHeight={"calc(100vh - 200px)"}
                onSelectionModelChange={handleSelectionModelChange}
                onFilterModelChange={handleFilterModelChange}
              />
            </>
          ) : null}
        </>
      )}
      {Documentloading ? (
        <Loader placement={{ marginTop: "-100px" }} />
      ) : (
        <>
          {DocumentrefreshError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : DocumentData && DocumentData?.results && value === 1 ? (
            <MyTableContainer
              columns={pendingcolumns}
              data={pendingRecord}
              RowFilterWith="id"
              customPageSize={25}
              minHeight="calc(100vh - 200px)"
            />
          ) : null}
        </>
      )}
      {Closeloading ? (
        <Loader placement={{ marginTop: "-100px" }} />
      ) : (
        <>
          {CloserefreshError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : CloseData && CloseData?.results && value === 2 ? (
            <MyTableContainer
              columns={historycolumns}
              data={historyRecord}
              RowFilterWith="id"
              customPageSize={25}
              minHeight="calc(100vh - 200px)"
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default ElevationProcess;
