import React, { useState } from 'react';
import { Button, Menu, MenuItem, TextField, Box } from '@mui/material';

function ComplexDropdown({ options, onOptionSelected}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedSub, setSelectedSub] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (option, sub) => {
        setSelectedOption(option.main);
        setSelectedSub(sub.name);
        handleClose();
        // const objectDat ={
        //     id: option.main,
        //     name: sub.name
        // }
        // console.log("objectData",objectDat);
        onOptionSelected(sub);  // Passing the sub object to the callback
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TextField
                aria-controls="simple-menu"
                aria-haspopup="true"
                label="Options"
                value={selectedOption ? `${selectedOption}: ${selectedSub}` : ''}
                onClick={handleClick}
                fullWidth
                readOnly
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <Button onClick={handleClick}>▼</Button>
                    )
                }}
                sx={{ cursor: 'pointer', width: '100%' }}
            />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    '& .MuiMenu-paper': {
                        maxHeight: '300px', 
                        overflowY: 'auto', 
                    }
                }}
            >
                {options.map((option) => (
                    <div key={option.main}>
                        <MenuItem disabled sx={{ fontSize: '16px', fontWeight: 900, color: '#000' }}>
                            {option.main}
                        </MenuItem>
                        {option.subs.map((sub) => (
                            <MenuItem key={sub.id} onClick={() => handleSelect(option, sub)} sx={{ ml: 1, color: '#000' }}>
                                {sub.name}
                            </MenuItem>
                        ))}
                    </div>
                ))}
            </Menu>
        </Box>
    );
}

export default ComplexDropdown;
