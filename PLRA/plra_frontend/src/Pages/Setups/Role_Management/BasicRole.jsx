import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Grid, Accordion, AccordionSummary, AccordionDetails, Checkbox
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, Loader, ErrorHandler } from '../../../Components/index';
import { DownArrow } from '../../../Assets/Icons/index';
import { useGetModelQuery, usePostRoleMutation } from '../../../Features/API/RoleManagement';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';


const advanceRoles = [
  { id: '1', name: 'Add' },
  { id: '2', name: 'View' },
  { id: '3', name: 'Update' },
];


const roles = [
  { id: '1', name: 'Add' },
  { id: '2', name: 'View' },
  { id: '3', name: 'Update' },
  { id: '4', name: 'Delete' },
];

const BasicRole = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [checkedPermissions, setCheckedPermissions] = useState({});
  const [clickedCheckboxIds, setClickedCheckboxIds] = useState([]);
  const [inputData, setInputData] = useState({ roleTitle: '' });
  const [accessToken, setAccessToken] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    const csrfT = Cookies.get('csrftoken');
    setAccessToken(authToken);
    setCsrfToken(csrfT)
  }, [])
  
  const { data, isLoading, isError, error, refetch } = useGetModelQuery(accessToken);
  const [saveData] = usePostRoleMutation();
  useEffect(() => setApiData(data), [data]);

  const handleReset = () => {
    setCheckedPermissions({});
    setClickedCheckboxIds([]);
  };
  
  
  const goBack = () => navigate(-1);
  const handleCheckbox = (event, modelId, isAdvancedPermission) => {

    setClickedCheckboxIds((prev) => {
      const updatedIds = isAdvancedPermission
        ? prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [...prev, modelId]
        : prev.includes(modelId)
          ? prev.filter((id) => id !== modelId)
          : [...prev, modelId];

      return updatedIds;
    });

    setCheckedPermissions((prev) => {
      const updatedState = { ...prev };

      if (isAdvancedPermission) {
        updatedState[modelId] = !prev[modelId];
      } else {
        updatedState[modelId] = !prev[modelId];
      }

      return updatedState;
    });
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    const formData = {
      name: inputData.roleTitle,
      permissions: clickedCheckboxIds
    };

    console.log("formData", formData);
    const res = await saveData({ formData, csrfToken });

    if (res.error) {
      const errorMessage = getErrorMessage(res.error.status);
      toast.error(errorMessage, { position: "top-center", autoClose: 3000 });
    } else {
      navigate('/employee/setup/Group');
    }
  };

  const getErrorMessage = (status) => {
    switch (status) {
      case 500:
        return "Server is not working";
      case 400:
        return "Role already exists";
      default:
        return "Unexpected Error Occurred";
    }
  };


  return (
    <>
      <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, alignItems: 'center', mb: 4 }}>
        <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>All Roles</Typography>
        <Btn type="back" onClick={goBack} />
        <Btn type="reset" onClick={handleReset} />
        <Btn type='save' onClick={handleSaveData} />
      </Box>

      <form action="">
        <Grid container columnSpacing={8} spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: 'column', gap: 1, mb: 4 }}>
            <InputField
              name="role_title"
              label="Role Title"
              placeholder="Enter the role name"
              type="text"
              value={inputData.roleTitle}
              onChange={(e) => setInputData({ ...inputData, roleTitle: e.target.value })}
            />
          </Grid>
        </Grid>
      </form>

      <Box sx={{ overflowX: 'scroll', height: "calc(100vh - 320px)", p: 0.6, border: "1px solid #e2e1e0", borderRadius: "3px" }}>
        {isLoading ? (
          <Loader placement={{ marginTop: '-100px' }} />
        ) : (
          <>
            {error ? (<ErrorHandler online={navigator.onLine} />) : (
              apiData && !isLoading && !isError && (
                Object.keys(apiData).map((category) => (
                  <Accordion key={category} style={{ borderRadius: '8px', marginTop: '10px', backgroundColor: 'rgb(197 197 197 / 11%)' }}>
                    <AccordionSummary expandIcon={<DownArrow />} aria-controls={`${category}-content`} id={`${category}-header`} >
                      <Typography variant="h6" fontWeight='bold' display='flex' alignItems='center'>{category}</Typography>
                      {/* <Typography variant="h6" width='100%' display='flex' alignItems='center' justifyContent='end' >
                        All Permission's
                      </Typography>
                      <Checkbox onClick={handleCheckbox} /> */}
                    </AccordionSummary>
                    <AccordionDetails style={{ backgroundColor: 'white', borderRadius: '10px', margin: '0 20px 10px 20px', }}>
                      <Grid container sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Grid item sx={{ display: 'inline-block', width: "calc(100% - 400px)" }}>
                          <Typography sx={{ mt: '5px', fontWeight: 'bold' }}>Role Type</Typography>
                        </Grid>
                        {roles.map((data) => (
                          <Grid item key={data.id}>
                            <Typography fontWeight='bold'>{data.name}</Typography>
                          </Grid>
                        ))}
                      </Grid>
                      <Box>
                        {apiData[category].map((record) => (
                          <Grid container key={record.model_name} sx={{ display: 'flex', justifyContent: 'space-between', }}>
                            <Grid item sx={{ display: 'inline-block', width: "calc(100% - 400px)" }}>
                              <Typography sx={{ mt: '10px', }}>{record.model_name}</Typography>
                            </Grid>
                            {record.base_permissions.map((permissions) => (
                              <Grid item key={permissions.id}>
                                <Checkbox
                                  checked={checkedPermissions[permissions.id] || false}
                                  onChange={(event) => handleCheckbox(event, permissions.id, false)}
                                />
                              </Grid>
                            ))}
                         {/* Child Accordion */}
                         {record.advanced_permissions.length > 0 && (
                              <Accordion style={{ boxShadow: 'none', backgroundColor: 'rgb(197 197 197 / 11%)', borderRadius: '10px', width: '180%', margin: '10px' }} >
                                <AccordionSummary expandIcon={<DownArrow />} aria-controls={`${category}-child-content`} id={`${category}-child-header`}>
                                  <Typography variant="h6">Advance Permission for {record.model_name}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
 
                                  <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: '35px' }}>
                                    <Grid item sx={{ display: 'inline-block', width: "calc(100% - 150px)" }}>
                                      <Typography sx={{ mt: '5px', fontWeight: 'bold' }}>Role Type</Typography>
                                    </Grid>
                                    {advanceRoles.map((data) => (
                                      <Grid item key={data.id}>
                                        <Typography fontWeight='bold'>{data.name}</Typography>
                                      </Grid>
                                    ))}
                                  </Grid>
                                  <Box>
                                    {record.advanced_permissions.map((advancedPermissionGroup) => (
                                      <Grid container item  >
                                        {Object.entries(advancedPermissionGroup).map(([permissionType, permissions]) => (
                                          <Grid item key={permissionType} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <Typography sx={{ mt: '10px', fontWeight: 'bold' }}>{permissionType}</Typography>
                                            <Box style={{ display: 'flex', justifyContent: 'space-between', marginRight: '43px' }}>
                                              {permissions.map((permission) => (
                                                <Checkbox
                                                  key={permission.id}
                                                  checked={checkedPermissions[permission.id] || false}
                                                  onChange={(event) => handleCheckbox(event, permission.id, true)}
                                                />
                                              ))}
                                            </Box>
                                          </Grid>
                                        ))}
                                      </Grid>
                                    ))}
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                            )}
                          </Grid>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              )
            )}
          </>
        )}

        {/* ... (remaining JSX) */}
      </Box>
    </>
  );
};

export default BasicRole;
