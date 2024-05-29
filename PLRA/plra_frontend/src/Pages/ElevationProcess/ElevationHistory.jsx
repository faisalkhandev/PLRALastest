import React, { useEffect, useLayoutEffect } from 'react';
// import {  useLazyUpdateElevationQuery, useLazyGenerateElevationQuery } from '../../Features/API/ElevationApi.js';
import { useTheme } from '@emotion/react';
import { Box } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ErrorHandler, Loader, MyTableContainer } from '../../Components';
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { useGethistoryElevationQuery } from '../../Features/API/ElevationApi.js';
import { emptyArray } from '../../Features/Counter/CounterSlice.js';
import { gridCellStyle } from '../../Utils/cellstyle.js';
import { GoBack } from '../../Assets/Icons/index.jsx';


const ElevationHistory = () => {
    const theme = useTheme();
    const { id } = useParams()
    const dispatch = useDispatch();
    const {
        data: HistoryData,
        isLoading: Historyloading,
        isError: HistoryrefreshError,
        refetch: Historyrefetch,
    } = useGethistoryElevationQuery(id);

    console.log(HistoryData);

    const historyRecord = HistoryData?.results?.map((approval) => ({
        id: approval.id,
        emp_no: approval?.employee.employee_no,
        emp_name: approval?.employee?.first_name + " " + approval?.employee?.last_name,
        elevation_approval_date: approval?.elevation_approval_date,
        elevation_effective_date: approval?.elevation_effective_date,
        job_title: approval?.employee?.position?.job?.job_title,
        position_desc: approval?.employee?.position?.position_desc,
        center_name: approval?.employee?.position?.location?.center_name,
        wing_name: approval?.employee?.position?.wing?.wing_name,
        promote_to_level: approval?.promote_to_level,
        status: approval?.status,
    })) || [];

    useEffect(() => {
        Historyrefetch();
    }, [Historyrefetch]);

    useLayoutEffect(() => {
        dispatch(emptyArray())
    }, [])

    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const historycolumns = [
        {
            field: "id", headerName: "ID", minWidth: 50, renderCell: renderNullInRed,
            renderCell: (params) => {

                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
                    {params?.row?.id}
                </span>
            },
        },
        {
            field: "emp_no", headerName: "Employee No", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {

                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
                    {params?.row?.emp_no}
                </span>
            },
        },
        {
            field: "emp_name", headerName: "Employee Name", minWidth: 250, renderCell: renderNullInRed,
            renderCell: (params) => {

                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
                    {params?.row?.emp_name}
                </span>
            },
        },
        {
            field: 'job_title',
            headerName: 'Job',
            minWidth: 160,
            renderCell: (params) => <span> {params?.row?.job_title} </span>,
        },
        {
            field: 'position_desc',
            headerName: 'Position',
            minWidth: 180,
            renderCell: (params) => <span> {params?.row?.position_desc} </span>,
        },
        {
            field: 'center_name',
            headerName: 'Center',
            minWidth: 80,
            renderCell: (params) => <span> {params?.row?.center_name} </span>,
        },
        {
            field: 'wing_name',
            headerName: 'Wing',
            renderCell: (params) => <span> {params?.row?.wing_name} </span>,
        },
        {
            field: "promote_to_level",
            headerName: 'Progression Job Level',
            minWidth: 200,
            renderCell: (params) => <span> {`L${params?.row?.promote_to_level}`} </span>,
        },
        {
            field: "elevation_approval_date", headerName: "Progression Approval Date", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {

                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
                    {params?.row?.elevation_approval_date}
                </span>
            },
        },
        {
            field: "elevation_effective_date", headerName: "Progression Effective Date", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {

                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">
                    {params?.row?.elevation_effective_date}
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
        <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", transform: "rotate(180deg)", cursor: "pointer", m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`, boxShadow: `0 0 2px 3px ${theme.palette.common.white}`, }} onClick={() => window.history.go(-1)}>
                    <GoBack />
                </Box>
                <Breadcrumb title="Progression" breadcrumbItem="Progression / Progression History List" />
            </Box>
            {Historyloading ? <Loader placement={{ marginTop: '-100px' }} /> :
                <>
                    {HistoryrefreshError ? <ErrorHandler online={navigator.onLine} /> :
                        HistoryData && HistoryData?.results ?
                            <MyTableContainer columns={historycolumns} data={historyRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 200px)" /> : null
                    }
                </>
            }
        </div>
    );
};

export default ElevationHistory;
