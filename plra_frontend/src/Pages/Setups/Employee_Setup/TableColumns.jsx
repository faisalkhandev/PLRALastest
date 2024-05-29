export const columns = [
    {
      field: "no_of_position", headerName: "Total Position", width: 120,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column" style={{ color: "#379237", textDecoration: 'underline' }}>
            {params.value}
          </span>);
      },
    },
    {
      field: "position_type", headerName: "Type", width: 120, renderCell: (params) => {
        return (<span>{params.row.position_type.position_type_name}</span>)
      }
    },
    {
      field: "job", headerName: "Job", width: 230,
      renderCell: (params) => {
        return (
          <span >
            {params.row.job.job_title}
          </span>);
      },
    },
    {
      field: "location", headerName: "Center", width: 140, renderCell: (params) => {
        return (<span>{params.row.location.center_name}</span>)
      }
    },
    {
      field: "wing", headerName: "Wing", width: 150, renderCell: (params) => {
        return (<span>{params.row.wing.wing_name}</span>)
      }
    },
    {
      field: 'position_active', headerName: 'Active', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'In-Active'}
        </span>
      )
    },
    {
      field: 'open_position', headerName: 'Status', width: 100,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Open' : 'Close'}
        </span>
      )
    },
  ];