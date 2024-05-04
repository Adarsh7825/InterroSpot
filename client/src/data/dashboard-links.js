import { ACCOUNT_TYPE } from "../utils/constants";
export const sidebarLinks = [
  {
    id: 1,
    name: "My Profile",
    path: "/dashboard/my-profile",
    icon: "VscAccount",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard/candidate",
    type: ACCOUNT_TYPE.CANDIDATE,
    icon: "VscDashboard",
  },
  {
    id: 3,
    name: "My Courses",
    path: "/dashboard/interviewer",
    type: ACCOUNT_TYPE.INTERVIEWER,
    icon: "VscVm",
  },
  {
    id: 4,
    name: "Add Course",
    path: "/dashboard/recruiter",
    type: ACCOUNT_TYPE.RECRUITER,
    icon: "VscAdd",
  },
];
