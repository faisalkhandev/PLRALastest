import React from 'react';
import { Select, MenuItem, Box } from '@mui/material';
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material'
import '../../Components/Styles.css'
import { useTheme } from '@emotion/react';

const SimpleDropdown = (props) => {
  const theme = useTheme();


  const { name, label, value, onChange, options, innerStyles, placeholder, outerStyles, isShowIcon, mandatory, ...rest } = props;
  return (
    <Box style={outerStyles} className='inputBox'>
      <label htmlFor={name} style={{ width: "220px" }}>{label} {
        mandatory && <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>
      }: </label>
      <Select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={innerStyles}
        InputProps={
          isShowIcon ? {
            endAdornment: (
              <Tooltip title="Open Dropdown">
              </Tooltip>
            )
          }
            :
            {}
        }
        {...rest}
      >
        {options && options?.map((item) => (
          <MenuItem key={item.id} value={item.value} sx={{ width: '100%' }}>{item.label}</MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SimpleDropdown;