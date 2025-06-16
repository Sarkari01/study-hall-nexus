
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  BookOpen, 
  CreditCard, 
  Settings, 
  BarChart3, 
  Shield,
  User
} from "lucide-react";

export interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: AdminSidebarItem[];
}

export const sidebarItems: AdminSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    id: "admin-details",
    label: "Admin Details",
    icon: <User className="h-5 w-5" />
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: "students",
        label: "Students",
        icon: <Users className="h-4 w-4" />
      },
      {
        id: "role-management",
        label: "Role Management",
        icon: <Shield className="h-4 w-4" />
      }
    ]
  },
  {
    id: "merchants",
    label: "Merchants",
    icon: <Building className="h-5 w-5" />
  },
  {
    id: "study-halls",
    label: "Study Halls",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />
  }
];
