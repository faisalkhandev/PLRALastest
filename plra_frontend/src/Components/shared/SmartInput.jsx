import React from 'react'

const SmartInput = ({ label, name, onChange, value, }) => {
  return (
    <div className='smartInput'>
      <label htmlFor="smartInput">{label}</label>
      <input id="smartInput" type="text" onChange={onChange} value={value} name={name} label={label} />
    </div>
  )
}

export default SmartInput
