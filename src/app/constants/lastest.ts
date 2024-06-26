import { IEmployee } from "./employee";

export interface ILatestData {
  _id: string;
  employeeId: string;
  employee: IEmployee;
  timestamp: string;
  date: string;
  time: string;
  type: string;
}


export interface IMappedLatestData {
  name: string;
  id: string;
  department: string;
  activeDate: string;
  activeTime: string;
}

export const MOCK_LATEST_DATA: IMappedLatestData[] = [
  {
    name: "John Doe",
    id: "543927",
    department: "Business Development",
    activeDate: "2023-01-01",
    activeTime: "07:45:51",
  },
  {
    name: "Alice Smith",
    id: "246964",
    department: "Marketing",
    activeDate: "2023-02-15",
    activeTime: "07:32:14",
  },
  {
    name: "Bob Johnson",
    id: "345075",
    department: "Operations",
    activeDate: "2023-03-20",
    activeTime: "07:30:15",
  },
  {
    name: "Emma Brown",
    id: "783592",
    department: "Product Development",
    activeDate: "2023-04-10",
    activeTime: "07:25:25",
  },
  {
    name: "Michael Davis",
    id: "378032",
    department: "Tech and Share Services",
    activeDate: "2023-05-05",
    activeTime: "07:18:10",
  },
  {
    name: "Sophia Wilson",
    id: "678234",
    department: "Human Resources",
    activeDate: "2023-06-18",
    activeTime: "07:14:47",
  },
  {
    name: "Liam Garcia",
    id: "137603",
    department: "Business Performance",
    activeDate: "2023-07-22",
    activeTime: "07:10:23",
  },
  {
    name: "Olivia Martinez",
    id: "672953",
    department: "Marketing",
    activeDate: "2023-08-30",
    activeTime: "07:02:12",
  },
  {
    name: "Noah Rodriguez",
    id: "983024",
    department: "Operations",
    activeDate: "2023-09-12",
    activeTime: "07:00:00",
  },
  {
    name: "Ava Lopez",
    id: "153752",
    department: "Product Development",
    activeDate: "2023-10-25",
    activeTime: "06:59:45",
  },
  {
    name: "Elijah Hernandez",
    id: "116499",
    department: "Tech and Share Services",
    activeDate: "2023-11-05",
    activeTime: "06:58:45",
  },
  {
    name: "Mia Gonzalez",
    id: "125683",
    department: "Human Resources",
    activeDate: "2023-12-08",
    activeTime: "06:58:23",
  },
  {
    name: "James Perez",
    id: "987342",
    department: "Business Development",
    activeDate: "2024-01-18",
    activeTime: "06:57:24",
  },
  {
    name: "Charlotte Carter",
    id: "156382",
    department: "Business Performance",
    activeDate: "2024-02-22",
    activeTime: "06:56:59",
  },
  {
    name: "Benjamin Taylor",
    id: "334221",
    department: "Marketing",
    activeDate: "2024-03-30",
    activeTime: "06:56:44",
  },
];