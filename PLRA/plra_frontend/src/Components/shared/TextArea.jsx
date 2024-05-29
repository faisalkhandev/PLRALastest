import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@emotion/react';

const TextArea = (props) => {
    const theme = useTheme();
    const { outerStyles, Rows, label, mandatory, placeholder, name, onChange, value, error, helperText,disabled } = props;

    return (
        <Box style={outerStyles} className='textArea'>
            <label htmlFor='ID' style={{ fontSize: '14px',width: "220px"}}>{label} { mandatory && <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>} :</label>
            <div style={{width:'100%'}}>
            <textarea
                name={name}
                onChange={onChange}
                value={value}
                id="ID"
                disabled={disabled}
                rows={Rows}
                className={`custom-textarea ${error ? 'error' : ''}`}
                placeholder={placeholder}
                style={{ backgroundColor: "#FDFDFD", borderColor: error ? theme.palette.error.main : null  }}
            />
            {error && <span style={{ color: theme.palette.error.main, fontSize: '12px' }}>{helperText}</span>}
            </div>
        </Box>
    )
}

export default TextArea;

