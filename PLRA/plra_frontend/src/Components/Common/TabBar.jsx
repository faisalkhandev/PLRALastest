import React, { useEffect, useState } from 'react';
import { Card } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TabBarData } from '../../Data/Side_Bar_Data/Side__Bar__Data.js';
import { selectButton } from '../../Features/Counter/CounterSlice.js';

export default function TabBar() {
  const selectedButtonId = useSelector((state) => state.counter.selectedButtonId);
  const [value, setValue] = useState(selectedButtonId); // Initialize with selectedButtonId
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const selectedItem = TabBarData.find((item) => item.key === selectedButtonId);

  const handleTabClick = (route) => {
    navigate(route);
  };

  const renderTabs = () => {
    if (true) {
      if (selectedItem) {
        if (selectedItem.dropdownItems && selectedItem.dropdownItems.length > 0) {
          return (
            <Tabs value={value} onChange={handleChange}>
              {selectedItem.dropdownItems.map((dropdownItem) => (
                <Tab
                  key={dropdownItem.key}
                  label={dropdownItem.text}
                  onClick={() => handleTabClick(dropdownItem.route)}
                />
              ))}
            </Tabs>
          );
        } else {
          return (
            <Tabs value={value} onChange={handleChange}>
              <Tab label={selectedItem.text} onClick={() => handleTabClick(selectedItem.route)} />
            </Tabs>
          );
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <Card sx={{ width: '100%', bgcolor: '#F9F8F7', borderRadius: '8px' }}>
      {renderTabs()}
    </Card>
  );
}
