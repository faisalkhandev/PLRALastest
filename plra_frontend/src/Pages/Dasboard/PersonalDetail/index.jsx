import React, { useEffect } from 'react'
import { DetailCard } from '../../../Components'
import { useDashboardProcessCountQuery } from '../../../Features/API/DashboardApi.js'
import { Box } from '@mui/material';


const index = () => {

    const { data: processData, isLoading: loading, isError: refreshError, error: queryError, refetch } = useDashboardProcessCountQuery();

    useEffect(()=>{
        refetch()
    },[processData])


    const employeeData = {
        Employee_Image: processData?.results[0]?.employee_id?.employee_image || null,
        Employee_ID: processData?.results[0]?.employee_id?.id,
        Employee_Name: processData?.results[0]?.employee_id?.first_name + " " + processData?.results[0]?.employee_id?.last_name,
        Joining_Date: processData?.results[0]?.employee_id?.date_of_joining,
        Years_of_Service: processData?.results[0]?.employee_id?.service_duration,
        Primary_Position: processData?.results[0]?.employee_id?.position?.job?.job_title.split('(')[0].trim(),
        Wing: processData?.results[0]?.employee_id?.position?.wing?.wing_name,
        Center_Name: processData?.results[0]?.employee_id?.position?.location?.center_name,
    }


    return (
        <Box sx={{ wisth:'100%' }}>
            <DetailCard data={employeeData} />
        </Box>
    )
}

export default index
