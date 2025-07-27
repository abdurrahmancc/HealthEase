import { CalendarDays, FileText, LayoutDashboard, MessageCircleMore, Settings, Star } from "lucide-react";

export const patientRoutes = [
  {
    path: "",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "appointments",
    name: "My Appointments",
    icon: CalendarDays,
  },
  {
    path: "favourites",
    name: "Favourites",
    icon: Star,
  },
  {
    path: "medicalrecords",
    name: "Medical Records",
    icon: FileText,
  },
  {
    path: "message",
    name: "Message",
    icon: MessageCircleMore,
  },
  {
    path: "settings",
    name: "Settings",
    icon: Settings,
  },
];