import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Education from './TabBar_MasterData/Education_Form';
import BasicInformation from './TabBar_MasterData/Basic_Form';
import Personal_Information from './TabBar_MasterData/Personal_Form';
import Address from './TabBar_MasterData/Address_Form';
import Contact_Information from './TabBar_MasterData/Contact_Form';
import Family_Information from './TabBar_MasterData/Family_Form';
import History_Form from './TabBar_MasterData/History_Form';
import Dependent_Employment_History from './TabBar_MasterData/Dependent_Employment_History';
import Position from './TabBar_MasterData/Position';
import Skill_Form from './TabBar_MasterData/Skill_Form';
import References_Form from './TabBar_MasterData/References_Form';
import Document_Form from './TabBar_MasterData/Document_Form';
import TraningForm from './TabBar_MasterData/TraningForm'
import { GoBack } from '../../../Assets/Icons';
import { useGetRoutesQuery } from '../../../Features/API/RoleManagement';
import Cookies from 'js-cookie'
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';


const Employee_MasterData = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [accessToken, setAccessToken] = useState('');
  const { id } = useParams();
  const theme = useTheme();

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    setAccessToken(authToken);
  }, []);
  const { data: routesData, loading, error, refetch } = useGetRoutesQuery(accessToken);

console.log("RouteData::::",routesData)

  const generateTabsFromModels = () => {
    if (routesData && routesData.processes && routesData.processes.Employee) {
      return routesData.processes.Employee.map((model, index) => (
        <button
          key={index}
          className={`${index === activeTab ? 'activeTabBar' : 'unActiveTabBar'}`}
          style={{ padding: "0 3px", height: "50px", cursor: 'pointer', margin: "0 8px" }}
          onClick={() => setActiveTab(index)}
        >
          {model.model_name.replace(/_/g, ' ')}
        </button>
      ));
    }
    return null;
  };

  const renderTabContent = () => {
    if (routesData && routesData.processes && routesData.processes.Employee) {
      const selectedModel = routesData.processes.Employee[activeTab];
      switch (selectedModel.model_name) {
        case 'Basic_Information':
          return <BasicInformation />;
          case 'Position':
            return <Position />;
        case 'Education':
          return <Education />;
        case 'Training':
          return <TraningForm />;
        case 'Skills':
          return <Skill_Form />;
        case 'Personal_Information':
          return <Personal_Information />;
        case 'Personal_Document':
          return <Document_Form />;
        case 'Family_Information':
          return <Family_Information />;
        case 'History':
          return <History_Form />;
        case 'Reference':
          return <References_Form />;
        case 'Contact_Information':
          return <Contact_Information />;
        case 'Address':
          return <Address />;
        case 'Dependent_History':
          return <Dependent_Employment_History />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <Fragment>
      <Box sx={{
        width: "100%", height: "50px", display: 'flex', justifyContent: 'start', alignItems: 'center',
        backgroundColor: theme.palette.common.white, overflow: "hidden"
      }}>
        <Box sx={{
          width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
          transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
          boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
        }} onClick={() => window.history.go(-1)}><GoBack /></Box>
        {generateTabsFromModels()}
      </Box>
      <Box sx={{ px: 6, pt: 2 }}>
        {renderTabContent()}
      </Box>
    </Fragment>
  );
};

export default Employee_MasterData;
