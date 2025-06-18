
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BookOpen, 
  Settings, 
  BarChart3,
  Shield,
  Bot,
  MessageSquare,
  Heart,
  Code,
  Brain,
  Wand2,
  MessageCircle,
  Globe,
  CreditCard,
  Receipt,
  MapPin,
  Phone,
  Image,
  Gift,
  Bell,
  DollarSign,
  Banknote
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
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: <Users className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'students',
        label: 'Students',
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: 'merchants',
        label: 'Merchants',
        icon: <Building2 className="h-4 w-4" />,
      },
      {
        id: 'role-management',
        label: 'Role Management',
        icon: <Shield className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'study-halls',
    label: 'Study Halls',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'subscription-management',
    label: 'Subscription Management',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'promotions-rewards',
    label: 'Promotions & Rewards',
    icon: <Gift className="h-5 w-5" />,
  },
  {
    id: 'push-notifications',
    label: 'Push Notifications',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    id: 'financial-management',
    label: 'Financial Management',
    icon: <DollarSign className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'payments',
        label: 'Payments',
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        id: 'transactions',
        label: 'Transactions',
        icon: <Receipt className="h-4 w-4" />,
      },
      {
        id: 'settle-now',
        label: 'Settle Now (Payouts)',
        icon: <Banknote className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: <Phone className="h-5 w-5" />,
  },
  {
    id: 'banner-management',
    label: 'Banner Management',
    icon: <Image className="h-5 w-5" />,
  },
  {
    id: 'ai-features',
    label: 'AI Features',
    icon: <Bot className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'ai-analytics',
        label: 'AI Analytics',
        icon: <Brain className="h-4 w-4" />,
      },
      {
        id: 'ai-chatbot',
        label: 'AI Chatbot',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        id: 'content-moderation',
        label: 'Content Moderation',
        icon: <Shield className="h-4 w-4" />,
      },
      {
        id: 'text-assistant',
        label: 'Text Assistant',
        icon: <Wand2 className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageCircle className="h-5 w-5" />,
    hasSubmenu: true,
    submenu: [
      {
        id: 'chat-system',
        label: 'Chat System',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        id: 'community',
        label: 'Community',
        icon: <Heart className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'developer-management',
    label: 'Developer Tools',
    icon: <Code className="h-5 w-5" />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
  },
];
