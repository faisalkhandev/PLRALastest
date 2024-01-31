import React, { useEffect, useState } from "react";
import { useGetRoutesQuery } from '../../Features/API/RoleManagement';
import { Box, Typography, Collapse, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { Link } from 'react-router-dom';

const SideBar = () => {
  const theme = useTheme();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    setAccessToken(authToken)
  }, [])

  const { data, isLoading, isError, error, refetch } = useGetRoutesQuery(accessToken);

  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const [activeSubtitle, setActiveSubtitle] = useState("");

  const handleBoxClick = (index) => {
    setActiveBoxIndex(activeBoxIndex === index ? null : index);
  };

  const handleSubtitleClick = (subtitle) => {
    setActiveSubtitle(subtitle);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  const capitalizeAndRemoveUnderscores = (str) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Box sx={{ width: "100%", display: { xs: 'none', md: "block" }, ml: -2 }}>
      <Typography variant="h5" color="initial" textAlign='center' sx={{ my: 2, width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Setups</Typography>
      <Box sx={{ width: "109%", height: "calc(100vh - 250px)", overflowY: 'scroll', overflowX: 'hidden' }}>
        {Object.keys(data?.setups).map((key, index) => (
          <Box key={index}>
            <Box
              sx={{
                borderBottom: `1px solid ${theme.palette.black[300]}`,
                width: "106%",
                pl: 1,
                minHeight: "30px",
                pt: 0.5,
                fontSize: '14px',
                cursor: "pointer",
                mt: 1
              }}
              className={activeBoxIndex === index ? "Setup_Sidebar" : ""}
              onClick={() => handleBoxClick(index)}
            >
              {capitalizeAndRemoveUnderscores(key)}
            </Box>
            <Collapse in={activeBoxIndex === index}>
              <List component="div" disablePadding>
                {data.setups[key].map((setup, setupIndex) => (
                  <Link to={`${setup.model_name}`} style={{ color: "#000" }} key={setupIndex}>
                    <ListItem
                      sx={{
                        pl: 1.5,
                        cursor: "pointer",
                        background: setup.model_name === activeSubtitle ? "#D3FFD1" : "transparent",
                      }}
                      onClick={() => handleSubtitleClick(setup.model_name)}
                    >
                      <ListItemText primary={capitalizeAndRemoveUnderscores(setup.model_name)} className="setup_subtittle" />
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
