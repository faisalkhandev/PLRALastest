import React from 'react'
import '../Styles.css'
import { Calendar, Upload } from '../../Assets/Icons/index'

const DataInput = () => {
    return (
        <div style={{ width: "100%",  display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
            <p style={{ display: 'inline-block', width: '160px', fontSize: '14px' }}>CNIC image : </p>

            <label htmlFor='dateInput' className='InputFilee'>
                <p style={{ opacity: 0.5, fontSize: "14px" }}>Upload File</p>
                <div className='uploadBox'><Calendar /></div>
            </label>
            <input id='dateInput' type="data"  style={{ display: 'none' }}/>


            {/* 
            <label for="DataInput" className="InputLable">
                <p style={{ textDecoration:'underline' }}>
                    Upload File <span style={{ marginLeft: '10px' }}><TrashFile /></span>
                </p>
                <div><p style={{ color:'green' , fontSize:'16px'}}>Max File Size : 5MB</p></div>
            </label>
            <input id="DataInput" type="file" style={{ display: 'none' }} multiple/> */}
        </div>
    )
}

export default DataInput
