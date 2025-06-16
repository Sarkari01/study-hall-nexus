
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  ArrowRightLeft, 
  MapPin, 
  Phone, 
  Image, 
  Brain, 
  MessageCircle, 
  Megaphone, 
  Settings, 
  Code, 
  BarChart3,
  UserCog,
  Bell,
  Gift,
  UserCheck
} from 'lucide-react';

export interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: AdminSidebarItem[];
}

export const sidebarItems: AdminSidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: <Users className="h-4 w-4" />,
    hasSubmenu: true,
    submenu: [
      { id: 'admin-details', label: 'Admin Details', icon: <UserCog className="h-3 w-3" /> },
      { id: 'students', label: 'Students', icon: <Users className="h-3 w-3" /> },
      { id: 'merchants', label: 'Merchants', icon: <Building2 className="h-3 w-3" /> },
      { id: 'role-management', label: 'Role Management', icon: <UserCheck className="h-3 w-3" /> }
    ]
  },
  {
    id: 'study-halls',
    label: 'Study Halls',
    icon: <Building2 className="h-4 w-4" />
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: <Calendar className="h-4 w-4" />
  },
  {
    id: 'financial-management',
    label: 'Financial Management',
    icon: <DollarSign className="h-4 w-4" />,
    hasSubmenu: true,
    submenu: [
      { id: 'payments', label: 'Payment History', icon: <CreditCard className="h-3 w-3" /> },
      { id: 'transactions', label: 'Transactions', icon: <ArrowRightLeft className="h-3 w-3" /> },
      { id: 'settle-now', label: 'Settle Now', icon: <DollarSign className="h-3 w-3" /> }
    ]
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: <MapPin className="h-4 w-4" />
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Phone className="h-4 w-4" />
  },
  {
    id: 'banner-management',
    label: 'Banner Management',
    icon: <Image className="h-4 w-4" />
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: <Brain className="h-4 w-4" />,
    hasSubmenu: true,
    submenu: [
      { id: 'ai-analytics', label: 'AI Analytics', icon: <BarChart3 className="h-3 w-3" /> },
      { id: 'ai-chatbot', label: 'AI Chatbot', icon: <MessageCircle className="h-3 w-3" /> },
      { id: 'content-moderation', label: 'Content Moderation', icon: <UserCheck className="h-3 w-3" /> },
      { id: 'text-assistant', label: 'Text Assistant', icon: <Brain className="h-3 w-3" /> }
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="h-4 w-4" />,
    hasSubmenu: true,
    submenu: [
      { id: 'chat-system', label: 'Chat System', icon: <MessageCircle className="h-3 w-3" /> },
      { id: 'community', label: 'Community', icon: <Users className="h-3 w-3" /> }
    ]
  },
  {
    id: 'subscription-management',
    label: 'Subscription Management',
    icon: <CreditCard className="h-4 w-4" />
  },
  {
    id: 'promotions-rewards',
    label: 'Promotions & Rewards',
    icon: <Gift className="h-4 w-4" />
  },
  {
    id: 'push-notifications',
    label: 'Push Notifications',
    icon: <Bell className="h-4 w-4" />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />
  },
  {
    id: 'developer-management',
    label: 'Developer Management',
    icon: <Code className="h-4 w-4" />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />
  }
];
