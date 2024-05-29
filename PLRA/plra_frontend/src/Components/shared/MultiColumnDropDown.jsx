import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { AngleDown, AngleUp } from '../../Assets/Icons';
import { useTheme } from '@emotion/react';
import '../Styles.css';

const MultiColumnDropDown = ({ dropdownAlignment, behavior, headers, rows }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [searchValues, setSearchValues] = useState(Array(headers.length).fill(''));
  const [selectedRows, setSelectedRows] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e, index) => {
    const newSearchValues = [...searchValues];
    newSearchValues[index] = e.target.value.toLowerCase();
    setSearchValues(newSearchValues);
  };

  const handleRowSelect = (rowIndex) => {
    if (behavior === 'single_selector') {
      setSelectedRows([rowIndex]);
    } else if (behavior === 'multi_selector') {
      const newSelectedRows = selectedRows.includes(rowIndex)
        ? selectedRows.filter((row) => row !== rowIndex)
        : [...selectedRows, rowIndex];
      setSelectedRows(newSelectedRows);
    }
  };

  const filteredRows = rows.filter((row) =>
    row.every((cell, index) => {
      const searchValue = searchValues[index];
      return !searchValue || cell.toLowerCase().includes(searchValue);
    })
  );

  const handleConfirm = () => {
    const selectedData = selectedRows.map(rowIndex => rows[rowIndex]);
    console.log(selectedData);
  };

  return (
    <div className='multi-column' style={{ position: 'relative' }}>
      <Box
        sx={{
          width: '100%', height: '29px', border: '1px solid gray', borderRadius: '3px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', pl: 1
        }}
      >
        <p>{selectedRows.length > 0 ? selectedRows.map(row => rows[row][0]).join(', ') : 'Select'}</p>
        <Box sx={{
          width: '30px', height: '30px', backgroundColor: `${theme.palette.gray[100]}`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <AngleUp /> : <AngleDown />}
        </Box>
      </Box>

      {isOpen && (
        <Box
          className='multi-column-dropdown'
          sx={{
            position: 'absolute', [dropdownAlignment]: 0, top: 35, transform: 'translateY(-5px)',
            maxHeight: "400px", border: '1px solid gray', borderRadius: '3px',
            overflowY: 'scroll'
          }}
          ref={dropdownRef}
        >
          <table className='table' style={{}}>
            <thead>
              <tr>
                <th>
                  <button
                    className='clear-btn'
                    onClick={() => {
                      setSelectedRows([]); // Clear selected rows
                      setSearchValues(Array(headers.length).fill('')); // Clear search values
                    }}
                  >
                    Clear <br />All
                  </button>
                </th>
                {headers.map((header, index) => (
                  <th key={index}>
                    {header}
                    <br />
                    <input
                      type="text"
                      className='mutli-column-search-box'
                      placeholder={`Search`}
                      onChange={(e) => handleSearchChange(e, index)}
                      value={searchValues[index] || ''}
                      key={`search-input-${index}`} // Use a fixed key for each input
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ textAlign: 'center', cursor: 'pointer', maxHeight: '20px' }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => handleRowSelect(rowIndex)}
                      style={{ maxWidth: '13px', margin: '0px', cursor: 'pointer', maxHeight: "18px" }}
                    />
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleConfirm}>Confirm Selection</button>
        </Box>
      )}
    </div>
  );
};

export default MultiColumnDropDown;
