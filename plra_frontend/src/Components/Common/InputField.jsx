import React from 'react';
import { TextField, Box } from '@mui/material';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material';
import '../../Components/Styles.css';
import Theme from '../../Theme/Light__Theme';

const InputField = (props) => {
  const {
    name,
    label,
    placeholder,
    value,
    onChange,
    type,
    multiline,
    innerStyles,
    outerStyles,
    isShowIcon,
    mandatory,
    min,
    InputState,
    labelWidth,
    error, // Added error prop
    helperText, // Added helperText prop for displaying error messages
    ...rest
  } = props;
  return (
    <Box style={outerStyles} className='' sx={{ display: 'flex', alignItems: 'center', width:"100%" }}>
      <label htmlFor={name} style={{ width: labelWidth ? labelWidth : "220px", fontSize: "14px" }}>
        {label}{mandatory && <span style={{ fontSize: '18px', color: `${Theme.palette.error.main}` }}>*</span>} :
      </label>
      <TextField
        style={{ width:'100%',...innerStyles, cursor: InputState ? 'not-allowed' : 'text' }}
        id={name}
        disabled={InputState}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type || 'text'}
        multiline={multiline}
        min={min}
        error={Boolean(error)}
        helperText={error}
        InputProps={
          isShowIcon
            ? {
              endAdornment: (
                <Tooltip title="Open Dropdown">
                  <FontAwesomeIcon icon={faCaretDown} style={{ paddingRight: "13.5px", color: 'gray' }} />
                </Tooltip>)
            }
            : {}
        }
        {...rest}
      />
    </Box>
  );
};

export default InputField;
