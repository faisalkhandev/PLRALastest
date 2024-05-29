import React from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Tooltip } from '@mui/material';

const SimpleDropdown = (props) => {
  const theme = useTheme();

  const { name, label, value, onChange, options, innerStyles, placeholder, outerStyles, isShowIcon, mandatory, error, helperText, labelWidth, ...rest } = props;

  return (
    <Box style={outerStyles} className='inputBox'>
      <label htmlFor={name} style={{ width: labelWidth ? labelWidth : "220px", fontSize: '14px' }}>{label}{
        mandatory && <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>
      } :</label>
      <div style={{ width: '100%' }}>
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          sx={innerStyles}
          error={error}
          InputProps={
            isShowIcon ? {
              endAdornment: (
                <Tooltip title="Open Dropdown">
                </Tooltip>
              )
            }
              : {}
          }
          {...rest}
        >
          {options && options.map((item) => (
            <MenuItem key={item.id} value={item.value} sx={{ width: '100%' }}>{item.label}</MenuItem>
          ))}
        </Select>
        {error && <span style={{ color: theme.palette.error.main, fontSize: '12px' }}>{helperText}</span>}
      </div>
    </Box>
  );
};

export default SimpleDropdown;
