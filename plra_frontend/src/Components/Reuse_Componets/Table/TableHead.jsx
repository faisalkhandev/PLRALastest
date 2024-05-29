import React, { useState, useMemo } from 'react'

function TableHead({ i, numericFilters, alphaNumericFilters, onFilterSearch, onAscendingClick, onDescendingClick }) {
    const [filterDropDown, setfilterDropDown] = useState(false);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterValue1, setFilterValue1] = useState('');
    const [filterValue2, setFilterValue2] = useState('');
    const [arrow, setArrow] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {
                    arrow === true ?
                        <p>{i.headerName} <span className="icon-arrow" onClick={(e) => { setArrow(false); onDescendingClick(i.fieldName) }} >&darr;</span> </p>
                        :
                        <p>{i.headerName} <span className="icon-arrow" onClick={(e) => { setArrow(true); onAscendingClick(i.fieldName) }} >&uarr;</span> </p>
                }
                <span onClick={() => setfilterDropDown(!filterDropDown)} style={{ marginRight: "10px" }} >&#11206;</span>
            </div>

            {filterDropDown ?
                <div style={{ position: 'absolute', bottom: "-8rem", right: 0, height: "8rem", width: "100%" }} >
                    {i.type === "numeric" ? <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', gap: 4, backgroundColor: 'var(--light-gray)', boxShadow: "3px 3px 3px 3px white", borderRadius: "5px" }} >
                        <p style={{ marginLeft: '10px' }} >{i.fieldName}</p>
                        <select style={{ marginLeft: '10px', padding: "0.3rem", width: "90%" }} onChange={(e) => { setFilterField(e.target.value) }} >
                            {
                                numericFilters.map((j) => {
                                    return <option value={j.name}>{j.name}</option>
                                })
                            }
                        </select>
                        {
                            filterField == 'between' ?
                                <div style={{ display: 'flex' }}>
                                    <input type="number" style={{ backgroundColor: 'var(--white-color)', padding: "0.3rem", paddingLeft: '10px', width: '36%', alignContent: 'center', marginLeft: '10px' }} onChange={(e) => { setFilterValue1(e.target.value) }} />
                                    <p>&nbsp;&nbsp;to</p>
                                    <input type="number" style={{ backgroundColor: 'var(--white-color)', padding: "0.3rem", paddingLeft: '10px', width: '36%', alignContent: 'center', marginLeft: '10px' }} onChange={(e) => { setFilterValue2(e.target.value) }} />
                                </div>
                                :
                                <input type="number" style={{ backgroundColor: 'var(--white-color)', padding: "0.3rem", paddingLeft: '10px', width: '90%', alignContent: 'center', marginLeft: '10px' }} onChange={(e) => { setFilterValue(e.target.value) }} />

                        }
                        <button type="submit" style={{ backgroundColor: 'var(--white-color)', padding: "0.3rem", margin: "5px", marginLeft: '10px', width: "90%" }} onClick={(e) => {
                            e.preventDefault();
                            if (filterField == 'between') {
                                onFilterSearch(filterField, `${filterValue1},${filterValue2}`, i.fieldName)

                            }
                            else {
                                onFilterSearch(filterField, filterValue, i.fieldName)
                            }
                        }} >Search</button>
                    </div> :
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', gap: 4, backgroundColor: 'var(--green-dark)', boxShadow: "3px 3px 3px 3px var(--gray-light)" }} >
                            <p style={{ marginLeft: '10px' }} >{i.fieldName}</p>
                            <select style={{ marginLeft: '10px', padding: "0.3rem", width: '90%' }} onChange={(e) => { setFilterField(e.target.value) }} >
                                {
                                    alphaNumericFilters.map((j) => {
                                        return <option value={j.name}>{j.name}</option>
                                    })
                                }
                            </select>
                            <input type="text" style={{ backgroundColor: 'var(--light-gray)', padding: "0.3rem", paddingLeft: '10px', width: '90%', alignContent: 'center', marginLeft: '10px' }} onChange={(e) => { setFilterValue(e.target.value) }} />
                            <button type="submit" style={{ backgroundColor: 'var(--light-gray)', padding: "0.3rem", margin: "5px", marginLeft: '10px', width: "90%" }} onClick={(e) => { e.preventDefault(); onFilterSearch(filterField, filterValue, i.fieldName) }} >Search</button>
                        </div>}
                </div> : <></>
            }

        </div>
    )
}

export default TableHead