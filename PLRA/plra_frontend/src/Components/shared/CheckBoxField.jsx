import React from 'react';

const CheckBoxField = ({ checked, onCheck, label, value, styles }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '8px' }}>
      <label style={{ width: '18px', height: '18px', backgroundColor: '#ccc', position: 'relative' }}>
        <input name={value} type="checkbox" checked={checked} onChange={onCheck} style={{ position: 'absolute', opacity: 0, cursor: 'pointer' }} />
        <div style={{ width: '18px', height: '18px', position: 'absolute', top: '0', left: '0' }}></div>
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" className="celebrate" style={{ display: 'none' }}>
          <polygon points="0,0 10,10"></polygon>
          <polygon points="0,25 10,25"></polygon>
          <polygon points="0,50 10,40"></polygon>
          <polygon points="50,0 40,10"></polygon>
          <polygon points="50,25 40,25"></polygon>
          <polygon points="50,50 40,40"></polygon>
        </svg>
      </label>
      <label htmlFor='checkbox' style={{ fontSize: '14px', ...styles }}>{label}</label>
    </div>
  );
};

export default CheckBoxField;
