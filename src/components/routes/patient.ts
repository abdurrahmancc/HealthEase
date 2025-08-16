import { CalendarDays, FileText, KeyRound, LayoutDashboard, MessageCircleMore, Settings, Star } from "lucide-react";

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
    name: "Profile Settings",
    icon: Settings,
  },
  {
    path: "change-password",
    name: "Change Password",
    icon: KeyRound,
  },
];