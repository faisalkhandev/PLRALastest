import React, { useEffect } from 'react';
import {
    useGetCenterQuery, useGetRegionQuery, useGetWingQuery, useGetSubWingQuery,
    useGetDivisionIDQuery, useGetDistrictIDQuery, useGetTehsilIDQuery
} from '../../../Features/API/API';

const DepartmentDropDownData = () => {
    const { data: centerData, error: centerError } = useGetCenterQuery();
    const { data: regionData, error: regionError } = useGetRegionQuery();
    const { data: wingData, error: wingError } = useGetWingQuery();
    const { data: subWingData, error: subWingError } = useGetSubWingQuery();
    const { data: divisionData, error: divisionError } = useGetDivisionIDQuery();
    const { data: districtData, error: districtError } = useGetDistrictIDQuery();
    const { data: tehsilData, error: tehsilError } = useGetTehsilIDQuery();

    useEffect(() => {
        console.log('Center Data:', centerData);
        console.log('Region Data:', regionData);
        console.log('Wing Data:', wingData);
        console.log('SubWing Data:', subWingData);
        console.log('Division ID Data:', divisionData);
        console.log('District ID Data:', districtData);
        console.log('Tehsil ID Data:', tehsilData);
    }, [centerData, regionData, wingData, subWingData, divisionData, districtData, tehsilData]);

    useEffect(() => {
        if (centerError) console.error('Error fetching Center Data:', centerError);
        if (regionError) console.error('Error fetching Region Data:', regionError);
        if (wingError) console.error('Error fetching Wing Data:', wingError);
        if (subWingError) console.error('Error fetching SubWing Data:', subWingError);
        if (divisionError) console.error('Error fetching Division ID Data:', divisionError);
        if (districtError) console.error('Error fetching District ID Data:', districtError);
        if (tehsilError) console.error('Error fetching Tehsil ID Data:', tehsilError);
    }, [centerError, regionError, wingError, subWingError, divisionError, districtError, tehsilError]);

    return (
        <div>
            {/* Render UI components here if needed */}
        </div>
    );
}

export default DepartmentDropDownData;
