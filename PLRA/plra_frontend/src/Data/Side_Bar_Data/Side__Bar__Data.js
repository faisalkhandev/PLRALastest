import avatar from '../../Assets/png/avatar.jpg'
import Logo from '../../Assets/png/Logo.png'
import {
  faHome, faUser, faClipboard, faCog,
  faBriefcase, faCalendar, faFileAlt, faClock,
  faBook, faCheckSquare, faSortDown, faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import {
  faEnvelope
} from '@fortawesome/free-regular-svg-icons';

//Dashboard Icon

import homeIcon from '../../../public/Assets/svg/home.svg'
import employeeIcon from '../../Assets/svg/employeIcon.svg';
import leavesIcon from '../../Assets/svg/leavesIcon.svg';
import annualAssigment from '../../Assets/svg/annualAssigment.svg';
import transferIcon from '../../Assets/svg/transferIcon.svg';
import disciplinaryIcon from '../../Assets/svg/disciplinaryIcon.svg';
import settingIcon from '../../Assets/svg/settingIcon.svg';
import hrcalenderIcon from '../../Assets/svg/hrcalender.svg';
import terminationIcon from '../../Assets/svg/terminationIcon.svg';
import nocIcon from '../../Assets/svg/nocIcon.svg';
import resignationIcon from '../../Assets/svg/resignation.svg';
import progressionIcon from '../../Assets/svg/progression.svg';


export const Employee_DropDown = [
  { key: 1, route: "employee/basic_information", text: "Basic Information " },
  { key: 2, route: "employee/personal_information", text: "Personal Information" },
  { key: 3, route: "employee/employment_history", text: "Employment History" },
  { key: 4, route: "employee/contact_information", text: "Contact Information" },
  { key: 5, route: "employee/personal_document", text: "Personal Document" },
  { key: 6, route: "employee/family_information", text: "Family Information" },
  { key: 7, route: "employee/references", text: "References" },
  { key: 8, route: "employee/education", text: "Education" },
  { key: 9, route: "employee/address", text: "Address" },
  { key: 10, route: "employee/training", text: "Training" },
  { key: 11, route: "employee/skills", text: "Skills" },
]


export const TabBarData = [
  {
    key: 1,
    route: '',
    text: 'Dashboard',
    icon: faHome,
  },
  {
    key: 2,
    text: "Employee",
    icon: faUser,
    dropdownItems: [
      { key: 1, route: "employee/basic_information", text: "Basic Information " },
      { key: 2, route: "employee/personal_information", text: "Personal Information" },
      { key: 3, route: "employee/employment_history", text: "Employment History" },
      { key: 4, route: "employee/contact_information", text: "Contact Information" },
      { key: 5, route: "employee/personal_document", text: "Personal Document" },
      { key: 6, route: "employee/family_information", text: "Family Information" },
      { key: 7, route: "employee/references", text: "References" },
      { key: 8, route: "employee/education", text: "Education" },
      { key: 9, route: "employee/address", text: "Address" },
      { key: 10, route: "employee/training", text: "Training" },
      { key: 11, route: "employee/skills", text: "Skills" },
    ],
  },
  {
    key: 3,
    text: 'Leaves',
    icon: faClipboard,
  },
  {
    key: 4,
    text: 'LeavePlanner',
    icon: faClock,
    dropdownItems: [
      { key: 1, route: 'LeavePlanner', text: 'Option1' },
      { key: 2, route: 'LeavePlanner/Option2', text: 'Option2' },
      { key: 3, route: 'LeavePlanner/Option3', text: 'Option3' },
    ],
  },
  {
    key: 5,
    text: 'Attendance',
    icon: faFileAlt,
    dropdownItems: [
      { key: 1, route: 'Payroll', text: 'Option1' },
      { key: 2, route: 'Payroll/Option2', text: 'Option2' },
      { key: 3, route: 'Payroll/Option3', text: 'Option3' },
    ],
  },
  {
    key: 6,
    text: 'Branches',
    icon: faUser,
    dropdownItems: [
      { key: 1, route: 'branches', text: 'Option1' },
      { key: 2, route: 'branches/Option2', text: 'Option2' },
      { key: 3, route: 'branches/Option3', text: 'Option3' },
    ],
  },
  {
    key: 7,
    route: '',
    text: 'Performance',
    icon: faCheckSquare,
  },
  {
    key: 8,
    route: 'notices',
    text: 'Notices',
    icon: faBriefcase,
  },
  {
    key: 9,
    route: '',
    text: 'Notes Pool',
    icon: faBook,
  },
  {
    text: 'Tasks',
    icon: faCalendar,
  },
  {
    key: 11,
    route: '',
    text: 'Setting',
    icon: faCog,
  },
];

export const SlideBarData = [
  {
    key: 1,
    route: '',
    text: 'Dashboard',
    icon: homeIcon,
  },
  {
    key: 2,
    text: "Employee",
    icon: employeeIcon,
    route: "employee",
  },
  {
    key: 3,
    text: 'Leaves',
    icon: leavesIcon,
    route: 'leave',
  },
  {
    key: 4,
    text: 'Annual Assessment',
    icon: annualAssigment,
    route: 'AnnualAssessment',
  },
  {
    key: 5,
    text: 'Transfer',
    icon: transferIcon,
    route: 'Transfer'
  },
  {
    key: 6,
    route: 'DisciplinaryProceeding',
    text: 'Disciplinary Proceeding',
    icon: disciplinaryIcon,
  },
  {
    key: 7,
    route: 'ElevationProcess',
    text: 'Elevation Process',
    icon: progressionIcon,
  },
  {
    key: 8,
    route: 'NOC',
    text: 'NOC',
    icon: nocIcon,
  },
  {
    key: 9,
    route: 'Resignation',
    text: 'Resignation',
    icon: resignationIcon,
  },
  {
    key: 10,
    route: 'Termination',
    text: 'Termination',
    icon: terminationIcon,
  },
  {
    key: 11,
    route: 'HR_Calendar',
    text: 'HR Calendar',
    icon: hrcalenderIcon,
  },

  {
    key: 12,
    route: 'employee/setup/wing',
    text: "Setups",
    icon: settingIcon,
  },
];

export const SlideBarBottomData = [
  {
    key: 1,
    route: 'Setting',
    text: 'Setting',
    icon: faCog,
  },
  {
    key: 2,
    route: '',
    text: 'LogOut',
    icon: faRightFromBracket,
  },
]

export const Sidebar_header = {
  title: "PLRA LOGO",
  avatar: avatar,
  Logo_Image: Logo,
  avatarDown: faSortDown,
  settingIcon: faCog,
  messageIcon: faEnvelope
};