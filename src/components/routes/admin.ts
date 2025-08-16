import { CalendarClock, CalendarDays, ClipboardCheck, Clock, FileText, KeyRound, LayoutDashboard, LogOut, MessageCircleMore, Settings, Shield, Star, User, UserRoundCheck } from "lucide-react";
import { IoKeyOutline } from "react-icons/io5";

export const adminRoutes = [
{
        path: "",
        name: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        path: "requests",
        name: "Requests",
        icon: ClipboardCheck,
    },
    {
        path: "appointments",
        name: "Appointments",
        icon: CalendarDays,
    },
    {
        path: "available",
        name: "Available Timings",
        icon: CalendarClock,
    },
    {
        path: "users",
        name: "Users",
        icon: User,
    },
    {
        path: "doctors",
        name: "Doctors",
        icon: User,
    },
    {
        path: "patients",
        name: "Patients",
        icon: User,
    },
    {
        path: "services",
        name: "Speciality & Services",
        icon: Clock,
    },
    {
        path: "reviews",
        name: "Reviews",
        icon: Star,
    },
    {
        path: "accounts",
        name: "Accounts",
        icon: UserRoundCheck,
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
        path: "socialMedia",
        name: "Social Media",
        icon: Shield,
    },
    {
        path: "change-password",
        name: "Change Password",
        icon: KeyRound,
    },
];