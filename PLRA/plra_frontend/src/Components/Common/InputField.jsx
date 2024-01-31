import React from 'react';
import { TextField, Box } from '@mui/material';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material'
import '../../Components/Styles.css'
import Theme from '../../Theme/Light__Theme'

const InputField = (props) => {
  const { name, label, placeholder, value, onChange, type, multiline, innerStyles, outerStyles, isShowIcon, mandatory, min, InputState, ...rest } = props;
  return (
    <Box style={outerStyles} className='inputBox'>
      <label htmlFor={name} style={{ width: "220px" }}>{label} {
        mandatory && <span style={{ fontSize: '18px', color: `${Theme.palette.error.main}` }}>*</span>
      } :</label>
      <TextField
        style={{ cursor: 'pointer' }}
        id={name}
        disabled={InputState}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type || 'text'}
        sx={innerStyles}
        multiline={multiline}
        min={min}
        InputProps={
          isShowIcon
            ? {
              endAdornment: (
                <Tooltip title="Open Dropdown">
                  <FontAwesomeIcon icon={faCaretDown} style={{ paddingRight: "13.5px", color: 'gray' }} />
                </Tooltip>)
            }
            :
            {}
        }
        {...rest}
      />

    </Box>
  );
};

export default InputField;