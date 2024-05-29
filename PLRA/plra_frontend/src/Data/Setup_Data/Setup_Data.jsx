export const RegionHeader = [
  {
    field: "region_id",
    headerName: "Region ID",
    flex: true
  },
  {
    field: "region_name",
    headerName: "Region Name",
    flex: true
  },
]

export const PayrollCodeHeader = [
  {
    field: "classcode_id",
    headerName: "ID",
    flex: true
  },
  {
    field: "classcode",
    headerName: "Class Code",
    flex: true
  },
  {
    field: "description",
    headerName: "Description",
    flex: true
  },
]


export const EmployeeTitle = [
  {
    field: "employee_title",
    headerName: "Employee Title",
    flex: true
  },

]
export const userHeader = [
  {
    field: 'first_name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  { field: 'reporting_officer', headerName: 'Reporting Officer', flex: true, renderCell: (params) => { return <span>{params.row.reporting_officer ? params.row.reporting_officer.first_name : ""}</span> } },
  { field: 'counter_assigning_officer', headerName: 'Counter Assigning Officer', flex: true, renderCell: (params) => { return <span>{params.row.counter_assigning_officer ? params.row.counter_assigning_officer : ""}</span> } },
  { field: 'position', headerName: 'Position', flex: true, renderCell: (params) => { return <span>{params.row.position ? params.row.position.position_type : ""}</span> } },
  { field: 'center', headerName: 'Center', flex: true, renderCell: (params) => { return <span>{params.row.center ? params.row.center.center_name : ""}</span> } },
  { field: 'password', headerName: 'Password', flex: true },
  { field: 'last_login', headerName: 'Last Login', flex: true },
  { field: 'employee_no', headerName: 'Employee No', flex: true },
  { field: 'cnic', headerName: 'Cnic', flex: true },
  { field: 'father_name', headerName: 'Father Name', flex: true },
  { field: 'passport_number', headerName: 'Passport Number ', flex: true },
  { field: 'domicile_district', headerName: 'Domicile', flex: true },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: true },
  { field: 'employee_image', headerName: 'Employee Image', flex: true },
  { field: 'employee_cnic_image', headerName: ' Cnic Image', flex: true },
  { field: 'employee_domicile_image', headerName: 'Domicile Image', flex: true },
  { field: 'date_of_joining', headerName: 'Joining Date', flex: true },
  { field: 'service_duration', headerName: 'Service Duration', flex: true },
  { field: 'is_staff', headerName: 'Staff ', flex: true },
  { field: 'is_active', headerName: 'Active', flex: true },
  { field: 'is_superuser', headerName: 'Super User', flex: true },
  { field: 'title', headerName: 'Title', flex: true },
  { field: 'groups', headerName: 'Title', flex: true },
  { field: 'user_permissions', headerName: 'Title', flex: true },
]
export const ReportingHeader = [
  {
    field: 'first_name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  { field: 'reporting_officer', headerName: 'Reporting Officer', flex: true, renderCell: (params) => { return <span>{params.row.reporting_officer ? params.row.reporting_officer.first_name : ""}</span> } },
  { field: 'counter_assigning_officer', headerName: 'Counter Assigning Officer', flex: true },
  { field: 'position', headerName: 'Position', flex: true, renderCell: (params) => { return <span>{params.row.position ? params.row.position.position_type : ""}</span> } },
  { field: 'center', headerName: 'Center', flex: true, renderCell: (params) => { return <span>{params.row.center ? params.row.center.center_name : ""}</span> } },
  { field: 'password', headerName: 'Password', flex: true },
  { field: 'last_login', headerName: 'Last Login', flex: true },
  { field: 'employee_no', headerName: 'Employee No', flex: true },
  { field: 'cnic', headerName: 'Cnic', flex: true },
  { field: 'father_name', headerName: 'Father Name', flex: true },
  { field: 'passport_number', headerName: 'Passport Number ', flex: true },
  { field: 'domicile_district', headerName: 'Domicile', flex: true },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: true },
  { field: 'employee_image', headerName: 'Employee Image', flex: true },
  { field: 'employee_cnic_image', headerName: ' Cnic Image', flex: true },
  { field: 'employee_domicile_image', headerName: 'Domicile Image', flex: true },
  { field: 'date_of_joining', headerName: 'Joining Date', flex: true },
  { field: 'service_duration', headerName: 'Service Duration', flex: true },
  { field: 'is_staff', headerName: 'Staff ', flex: true },
  { field: 'is_active', headerName: 'Active', flex: true },
  { field: 'is_superuser', headerName: 'Super User', flex: true },
  { field: 'title', headerName: 'Title', flex: true },
  { field: 'groups', headerName: 'Title', flex: true },
  { field: 'user_permissions', headerName: 'Title', flex: true },

]
export const CounterAssigningHeader = [
  {
    field: 'first_name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  { field: 'reporting_officer', headerName: 'Reporting Officer', flex: true, renderCell: (params) => { return <span>{params.row.reporting_officer ? params.row.reporting_officer.first_name : ""}</span> } },
  { field: 'counter_assigning_officer', headerName: 'Counter Assigning Officer', flex: true },
  { field: 'position', headerName: 'Position', flex: true, renderCell: (params) => { return <span>{params.row.position ? params.row.position.position_type : ""}</span> } },
  { field: 'center', headerName: 'Center', flex: true, renderCell: (params) => { return <span>{params.row.center ? params.row.center.center_name : ""}</span> } },
  { field: 'password', headerName: 'Password', flex: true },
  { field: 'last_login', headerName: 'Last Login', flex: true },
  { field: 'employee_no', headerName: 'Employee No', flex: true },
  { field: 'cnic', headerName: 'Cnic', flex: true },
  { field: 'father_name', headerName: 'Father Name', flex: true },
  { field: 'passport_number', headerName: 'Passport Number ', flex: true },
  { field: 'domicile_district', headerName: 'Domicile', flex: true },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: true },
  { field: 'employee_image', headerName: 'Employee Image', flex: true },
  { field: 'employee_cnic_image', headerName: ' Cnic Image', flex: true },
  { field: 'employee_domicile_image', headerName: 'Domicile Image', flex: true },
  { field: 'date_of_joining', headerName: 'Joining Date', flex: true },
  { field: 'service_duration', headerName: 'Service Duration', flex: true },
  { field: 'is_staff', headerName: 'Staff ', flex: true },
  { field: 'is_active', headerName: 'Active', flex: true },
  { field: 'is_superuser', headerName: 'Super User', flex: true },
  { field: 'title', headerName: 'Title', flex: true },
  { field: 'groups', headerName: 'Title', flex: true },
  { field: 'user_permissions', headerName: 'Title', flex: true },

]
export const typeHeader = [
  {
    field: 'name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },

];
export const LikertScale = [
  {
    field: 'id', headerName: 'Likert Scale ID', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  {
    field: 'rating_model', headerName: 'Employee Name', flex: true,
    renderCell: (params) => { return (<span > {params.row.rating_model.name} </span>); },
  },
  { field: 'percentile_range', headerName: 'Percentile Range', flex: true },
  { field: 'grade', headerName: 'Grade', flex: true },
];

export const EmployeeHeader = [
  {
    field: "employee_no",
    headerName: "Employee No.",
    flex: true
  },
  {
    field: "first_name",
    headerName: "First Name",
    flex: true
  },
  {
    field: "last_name",
    headerName: "Last Name",
    flex: true
  },
]
export const EducationLevelHeader = [
  {
    field: "level_of_education",
    headerName: "Education Level",
    flex: true
  },
  {
    field: "description",
    headerName: "Description",
    flex: true
  },
]

export const ratingModelHeader = [
  {
    field: "id",
    headerName: "Model ID",
    flex: true
  },
  {
    field: "name",
    headerName: "Model Name",
    flex: true
  },
  {
    field: "description",
    headerName: "Description",
    flex: true
  },
];
export const districtHeader = [
  {
    field: "district_id",
    headerName: "District ID",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "district_name",
    headerName: "District Name",
    type: "string",
    flex: true,
    align: "left",
  }
];
export const JobDistrictHeader = [
  {
    field: "id",
    headerName: "District ID",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "district_name",
    headerName: "District Name",
    type: "string",
    flex: true,
    align: "left",
  }
];
export const RelationHeader = [
  {
    field: "fimaly_rec_id",
    headerName: "Family Relation ID",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "full_name",
    headerName: "Full Name",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "birth_Date",
    headerName: "Date of Birth",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "relation",
    headerName: "Relation",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "is_dependent",
    headerName: "Is Dependent",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "employee",
    headerName: "Employee Name",
    type: "string",
    flex: true,
    align: "left",
  },
];

export const divisionHeader = [
  {
    field: "division_id",
    headerName: "Division ID",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "division_name",
    headerName: "Division Name",
    type: "string",
    flex: true,
    align: "left",
  },
];
export const tehsilHeader = [
  {
    field: "t_id",
    headerName: "Tehsil ID",
    type: "string",
    flex: true,
    align: "left",
  },
  {
    field: "t_name",
    headerName: "Tehsil Name",
    type: "string",
    flex: true,
    align: "left",
  }
];
export const CountryHeader = [
  {
    field: "country_rec_id",
    headerName: "Country ID",
    type: "integer",
    flex: true,
    align: "left",
  },
  {
    field: "country_name",
    headerName: "Country Name",
    type: "string",
    flex: true,
    align: "left",
  }
];
export const CityHeader = [
  {
    field: "c_rec_id",
    headerName: "City ID",
    type: "integer",
    flex: true,
    align: "left",
  },
  {
    field: "city_name",
    headerName: "City Name",
    type: "string",
    flex: true,
    align: "left",
  }
];

export const PositionHeader = [
  { field: 'position_desc', headerName: 'Position Description', minWidth: 200 },
  {
    field: 'wing', headerName: 'Wing', minWidth: 200, renderCell: (params) => {
      return (
        <span>{params.row.wing.wing_name}</span>
      )
    }
  },
  {
    field: 'sub_wing', headerName: 'SubWing', minWidth: 200, renderCell: (params) => {
      return (
        <span>{params.row.sub_wing.sub_wing_name}</span>
      )
    }
  },
  {
    field: 'center', headerName: 'Center', minWidth: 200, renderCell: (params) => {
      return (
        <span>{params.row.location.center_name}</span>
      )
    }
  },

];

export const PpgLevelHeader = [
  {
    field: 'ppg_level',
    headerName: 'PPG Level',
    flex: 1,
  },
  { field: 'ppg_level_seniority', headerName: 'PPG Level Seniority', flex: 1 },
];
export const WingHeader = [
  { field: 'wing_id', headerName: 'Wing ID', minWidth: 200 },
  { field: 'wing_name', headerName: 'Wing Name', minWidth: 200 }
];


export const SubWingHeader = [

  {
    field: 'wing', headerName: 'Wing', flex: 1, renderCell: (params) => {
      return (
        <span>{params.row.wing.wing_name}</span>
      )
    }
  },
  { field: 'sub_wing_name', headerName: 'Sub Wing', flex: 1 },
];

export const PositionTypeHeader = [
  {
    field: "position_type_name",
    headerName: "Position Type", flex: 1
  }];
export const RatingModel = [
  {
    field: 'name', headerName: 'Name', flex: true,
    renderCell: (params) => {
      const onView = () => {
        handleRowClick(params);
      };
      return (<span onClick={onView} className='table_first_column'>  {params.value} </span>);
    },
  },
  { field: 'description', headerName: 'Description', flex: true },
  {
    field: 'year', headerName: 'Year', flex: true,
    renderCell: (params) => { return (<span > {params.row.year.hr_year} </span>); },
  },
  {
    field: 'type', headerName: 'Type', flex: true,
    renderCell: (params) => { return (<span > {params.row.type ? params.row.type.name : ""} </span>); },
  },
  { field: 'reporting_officer', headerName: 'Reporting Officer', flex: true },
];
export const yearHeader = [
  { field: 'id', headerName: 'Year Id', flex: 1 },
  { field: 'hr_celander_starting_date', headerName: 'Starting Date', flex: 1 },
  { field: 'hr_celander_ending_date', headerName: 'Ending Date', flex: 1 },
  { field: 'hr_year', headerName: 'Year', flex: 1 },
];
export const CenterHeader = [
  {
    field: 'center_id', headerName: 'Center ID', minWidth: 120,
  },
  { field: 'center_name', headerName: 'Center', minWidth: 200 },
  {
    field: 'tehsil_id', headerName: 'Tehsil', flex: true, renderCell: (params) => { return (<span > {params.row.tehsil.t_name} </span>); },
  },
  {
    field: 'district_id', headerName: 'District', flex: true, renderCell: (params) => { return (<span > {params.row.district.district_name} </span>); },
  },
]

export const JobHeader = [
  { field: 'job_title', headerName: 'Job Title', minWidth: 200 },
  { field: 'ppg_level', headerName: 'PPG', minWidth: 130, renderCell: (params) => { return (<span>{params.row.ppg_level.ppg_level}</span>) } },
  { field: 'no_of_seniority_level', headerName: 'Number of Job Level', minWidth: 200 },
];

export const JobPositionHeader = [
  { field: 'job_title', headerName: 'Job Title', minWidth: 200, renderCell: (params) => { return (<span>{params.row.position.job.job_title}</span>) } },
  { field: 'ppg_level', headerName: 'PPG', minWidth: 130, renderCell: (params) => { return (<span>{params.row.position.job.ppg_level}</span>) } },
  { field: 'no_of_seniority_level', headerName: 'Number of Job Level', minWidth: 200, renderCell: (params) => { return (<span>{params.row.position.job.no_of_seniority_level}</span>) } },
];

export const JobLevelHeader = [
  {
    field: 'job', headerName: 'Job', flex: 1,
    renderCell: (params) => {

      return (
        <span >
          {params.row.job.job_title}
        </span>
      );
    }
  },

  {
    field: 'job_abbrivation',
    headerName: 'Job Level',
    flex: 1,
    renderCell: (params) => {


      return (

        <span className="table_first_column">

          {params.row.job_abbrivation + '-' + params.row.job_abbrivation_seniority}

        </span>

      );
    }

  },
];

export const etransferwindow = [
  {
    field: 'p_rec_id', headerName: 'open position ID', minWidth: 120,
  },
  { field: 'position_desc', headerName: 'Position Desc', minWidth: 300 },
  {
    field: 'job_title', headerName: 'Job Title', minWidth: 150  // Added this line
  },
  {
    field: 'center_name', headerName: 'Center', minWidth: 150  // Added this line
  },
  {
    field: 'district', headerName: 'District', minWidth: 150  // Added this line
  },
  {
    field: 'division', headerName: 'Division', minWidth: 150  // Added this line
  },
  {
    field: 'region', headerName: 'Region', minWidth: 150  // Added this line
  },
  {
    field: 'tehsil', headerName: 'Tehsil', minWidth: 150  // Added this line
  },
  {
    field: 'position_type', headerName: 'Position Type', minWidth: 150  // Added this line
  },
  {
    field: 'sub_wing', headerName: 'Sub Wing', minWidth: 150  // Added this line
  },
  {
    field: 'wing', headerName: 'Wing', minWidth: 150  // Added this line
  },
]
