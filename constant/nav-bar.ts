import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutGrid,
  MessagesSquare,
  MonitorCog,
  Presentation,
  Ticket,
  UserCheck,
} from "lucide-react";

export const navBar = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    role: ["superadmin", "admin", "teacher"],
  },
  {
    label: "Institution",
    href: "/institution",
    icon: GraduationCap,
    role: ["superadmin"],
  },
  {
    label: "Scoreboard",
    href: "/scoreboard",
    icon: ClipboardList,
    role: ["admin", "teacher"],
  },
  {
    label: "Course",
    href: "/course",
    icon: BookOpen,
    role: ["superadmin", "admin", "teacher"],
  },
  {
    label: "Purchase",
    href: "/purchase",
    icon: MonitorCog,
    role: ["superadmin", "admin"],
  },
  {
    label: "Classroom",
    href: "/classroom",
    icon: Presentation,
    role: ["admin", "teacher"],
  },
  {
    label: "Teacher",
    href: "/teacher",
    icon: UserCheck,
    role: ["admin"],
  },
  {
    label: "Student",
    href: "/student",
    icon: GraduationCap,
    role: ["admin"],
  },
  {
    label: "Feedback",
    href: "/feedback",
    icon: MessagesSquare,
    role: ["teacher"],
  },

  {
    label: "Tickets",
    href: "/tickets",
    icon: Ticket,
    role: ["admin", "superadmin"],
  },
  {
    label: "Grade and Section",
    href: "/grade-section",
    icon: Ticket,
    role: ["admin", "teacher"],
  },
];
