import avatar from "../../Assets/png/avatar.jpg";
import Logo from "../../Assets/png/Logo.png";
import {
  faHome,
  faUser,
  faClipboard,
  faCog,
  faBriefcase,
  faCalendar,
  faFileAlt,
  faClock,
  faBook,
  faCheckSquare,
  faSortDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  hrcalenderIcon,
  employeeIcon,
  leavesIcon,
  annualAssigment,
  transferIcon,
  disciplinaryIcon,
  settingIcon,
  terminationIcon,
  nocIcon,
  resignationIcon,
  progressionIcon,
  homeIcon,
  RightFromBracket,
  Cog,
} from "../../Assets/Icons/index";

export const Employee_DropDown = [
  { key: 1, route: "employee/basic_information", text: "Basic Information " },
  {
    key: 2,
    route: "employee/personal_information",
    text: "Personal Information",
  },
  { key: 3, route: "employee/employment_history", text: "Employment History" },
  {
    key: 4,
    route: "employee/contact_information",
    text: "Contact Information",
  },
  { key: 5, route: "employee/personal_document", text: "Personal Document" },
  { key: 6, route: "employee/family_information", text: "Family Information" },
  { key: 7, route: "employee/references", text: "References" },
  { key: 8, route: "employee/education", text: "Education" },
  { key: 9, route: "employee/address", text: "Address" },
  { key: 10, route: "employee/training", text: "Training" },
  { key: 11, route: "employee/skills", text: "Skills" },
];

export const TabBarData = [
  { key: 1, route: "", text: "Dashboard", icon: faHome },
  { key: 2, text: "Employee", icon: faUser },
  { key: 3, text: "Leaves", icon: faClipboard },
  { key: 4, text: "LeavePlanner", icon: faClock },
  { key: 5, text: "Attendance", icon: faFileAlt },
  { key: 6, text: "Branches", icon: faUser },
  { key: 7, route: "", text: "Performance", icon: faCheckSquare },
  { key: 8, route: "notices", text: "Notices", icon: faBriefcase },
  { key: 9, route: "", text: "Notes Pool", icon: faBook },
  { key: 10, text: "Tasks", icon: faCalendar },
  { key: 11, route: "", text: "Setting", icon: faCog },
];

export const SlideBarData = [
  {
    key: 1,
    route: "",
    text: "Dashboard",
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
    text: "Leaves",
    icon: leavesIcon,
    route: "leave",
  },
  {
    key: 4,
    text: "Annual Assessment",
    icon: annualAssigment,
    route: "AnnualAssessment",
  },
  {
    key: 5,
    text: "Administrative Transfer",
    icon: transferIcon,
    route: "Transfer",
  },
  {
    key: 6,
    text: 'E-Transfer Window',
    icon: transferIcon,
    route: 'opentransferwindow'
  },
  {
    key: 7,
    text: 'E-Transfer Process',
    icon: transferIcon,
    route: 'ETransferProcess'
  },
  {
    key: 7,
    text: 'Open Transfer Window',
    icon: transferIcon,
    route: 'opentransferwindow'
  },
  {
    key: 8,
    route: "DisciplinaryProceeding",
    text: "Disciplinary Proceeding",
    icon: disciplinaryIcon,
  },
  {
    key: 9,
    route: "ElevationProcess",
    text: "Progression Process",
    icon: progressionIcon,
  },
  {
    key: 10,
    route: "ProgressionProcess",
    text: "Elevation Process",
    icon: progressionIcon,
  },
  {
    key: 11,
    route: "NOC",
    text: "NOC",
    icon: nocIcon,
  },
  {
    key: 12,
    route: "Resignation",
    text: "Resignation",
    icon: resignationIcon,
  },
  {
    key: 13,
    route: "Termination",
    text: "Termination",
    icon: terminationIcon,
  },
  {
    key: 14,
    route: "HR_Calendar",
    text: "HR Calendar",
    icon: hrcalenderIcon,
  },

  {
    key: 15,
    route: "employee/setup/LayoutOfSetups",
    text: "Setups",
    icon: settingIcon,
  },
];

export const SlideBarBottomData = [
  { key: 1, route: "Setting", text: "Setting", icon: Cog },
  { key: 2, route: "", text: "LogOut", icon: RightFromBracket },
];

export const Sidebar_header = {
  title: "PLRA LOGO",
  avatar: avatar,
  Logo_Image: Logo,
  avatarDown: faSortDown,
  settingIcon: faCog,
  messageIcon: faEnvelope,
};
