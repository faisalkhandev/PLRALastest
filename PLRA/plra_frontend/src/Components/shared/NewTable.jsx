import React from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';

const columns = [
  { name: 'id', header: 'ID', defaultWidth: 200, type: 'number' },
  { name: 'gender', header: 'Gender', defaultWidth: 200 },
  { name: 'salary', header: 'Salary', defaultWidth: 200, type: 'number' },
];

const gridStyle = { height:"200px" };

const data = [
  { id: 1, gender: 'male', salary: 1200 },
  { id: 2, gender: 'female', salary: 1000 },
  { id: 3, gender: 'robot', salary: 1000 },
];

const NewTable = () => {
  return (
    <ReactDataGrid
      idProperty="id"
      columns={columns}
      dataSource={data}
      style={gridStyle}
      columnResize={true}
    />
  );
};

export default NewTable
