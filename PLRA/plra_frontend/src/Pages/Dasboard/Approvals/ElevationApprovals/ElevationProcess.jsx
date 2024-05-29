import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
// import {  useLazyUpdateElevationQuery, useLazyGenerateElevationQuery } from '../../Features/API/ElevationApi.js';
import { useTheme } from '@emotion/react';
import { Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorHandler, Loader, MyTableContainer } from '../../../../Components';
import Breadcrumb from '../../../../Components/Common/BreadCrumb';
import { useGetpendingdocumentQuery, useLazyGenerateElevationQuery, useLazyUpdateElevationQuery } from '../../../../Features/API/ElevationApi.js';
import { emptyArray, removeData, saveData } from '../../../../Features/Counter/CounterSlice.js';
import { gridCellStyle } from '../../../../Utils/cellstyle.js';


const ElevationProcess = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const ElevationEmp = useSelector((state) => state.counter.ElevationEmp);
  const [id, setId] = React.useState(null);
  const [value, setValue] = useState(0);
  const [trigger, result] = useLazyGenerateElevationQuery();
  const [updateTrigger] = useLazyUpdateElevationQuery();
  const {
    data: DocumentData,
    isLoading: Documentloading,
    isError: DocumentrefreshError,
    refetch: Documentrefetch,
  } = useGetpendingdocumentQuery();

  const pendingRecord = DocumentData?.results?.map((approval) => ({
    id: approval.elevtion_to_l2_doc_rec_id,
    document_date: approval?.document_date,
    status: approval?.status,
  })) || [];

  useEffect(() => {
    Documentrefetch();
  }, [ Documentrefetch,]);

  useLayoutEffect(() => {
    dispatch(emptyArray())
  }, [])

  const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: "red" }}>Null</span>;
    return value;
  };

  const pendingcolumns = [
    {
      field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <Link to={`/approval/ElevationProcess/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
          <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
            {params?.row?.id}
          </span>
        </Link>
      },
    },
    {
      field: "document_date", headerName: "Document date", minWidth: 250, renderCell: renderNullInRed,
      renderCell: (params) => {
        return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
          {params?.row?.document_date}
        </span>
      },
    },
    {
      field: "status", headerName: "Status", minWidth: 200, renderCell: renderNullInRed,
      renderCell: (params) => {
        const cellStyle = gridCellStyle(theme, params?.row?.status);
        return <span style={{ whiteSpace: "pre-wrap", ...cellStyle }} className="table_first_column">
          {params?.row?.status}
        </span>
      },
    },
  ];

  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Breadcrumb title="Elevation" breadcrumbItem="Elevation / Elevation Pending List" />
      </Box>
      {Documentloading ? <Loader placement={{ marginTop: '-100px' }} /> :
        <>
          {DocumentrefreshError ? <ErrorHandler online={navigator.onLine} /> :
            DocumentData && DocumentData?.results ?
              <MyTableContainer columns={pendingcolumns} data={pendingRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" /> : null
          }
        </>
      }
    </Box>
  );
};

export default ElevationProcess;
