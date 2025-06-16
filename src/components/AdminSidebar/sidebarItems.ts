
import React from 'react';
import { Users, Building2, Calendar, CreditCard, ArrowRightLeft, DollarSign, MapPin, UserPlus, TrendingUp, LayoutDashboard, Megaphone, MessageSquare, Users2, Settings, Code, Package, Gift, Bell, BookOpen, Shield } from "lucide-react";

export interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: Array<{
    id: string;
    label: string;
  }>;
}

export const sidebarItems: AdminSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: React.createElement(LayoutDashboard, { className: "h-5 w-5" })
  },
  {
    id: "students",
    label: "Students",
    icon: React.createElement(Users, { className: "h-5 w-5" })
  },
  {
    id: "merchants",
    label: "Merchants",
    icon: React.createElement(Building2, { className: "h-5 w-5" })
  },
  {
    id: "study-halls",
    label: "Study Halls",
    icon: React.createElement(Calendar, { className: "h-5 w-5" })
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: React.createElement(BookOpen, { className: "h-5 w-5" })
  },
  {
    id: "subscriptions",
    label: "Subscription Management",
    icon: React.createElement(Package, { className: "h-5 w-5" }),
    hasSubmenu: true,
    submenu: [
      {
        id: "subscription-plans",
        label: "Subscription Plans"
      },
      {
        id: "merchant-subscriptions",
        label: "Merchant Subscriptions"
      },
      {
        id: "payment-history",
        label: "Payment History"
      }
    ]
  },
  {
    id: "promotions",
    label: "Promotions & Rewards",
    icon: React.createElement(Gift, { className: "h-5 w-5" }),
    hasSubmenu: true,
    submenu: [
      {
        id: "coupons",
        label: "Coupon Management"
      },
      {
        id: "reward-rules",
        label: "Reward Rules"
      },
      {
        id: "wallet-management",
        label: "Wallet Management"
      }
    ]
  },
  {
    id: "notifications",
    label: "Push Notifications",
    icon: React.createElement(Bell, { className: "h-5 w-5" })
  },
  {
    id: "payments",
    label: "Payments",
    icon: React.createElement(CreditCard, { className: "h-5 w-5" })
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: React.createElement(ArrowRightLeft, { className: "h-5 w-5" })
  },
  {
    id: "settle-now",
    label: "Settle Now (Payouts)",
    icon: React.createElement(DollarSign, { className: "h-5 w-5" })
  },
  {
    id: "locations",
    label: "Locations",
    icon: React.createElement(MapPin, { className: "h-5 w-5" })
  },
  {
    id: "leads",
    label: "Leads",
    icon: React.createElement(UserPlus, { className: "h-5 w-5" })
  },
  {
    id: "banners",
    label: "Banner Management",
    icon: React.createElement(Megaphone, { className: "h-5 w-5" })
  },
  {
    id: "community",
    label: "Community Feed",
    icon: React.createElement(Users2, { className: "h-5 w-5" })
  },
  {
    id: "chat",
    label: "Chat System",
    icon: React.createElement(MessageSquare, { className: "h-5 w-5" })
  },
  {
    id: "ai-features",
    label: "AI Features",
    icon: React.createElement(Code, { className: "h-5 w-5" }),
    hasSubmenu: true,
    submenu: [
      {
        id: "ai-chatbot",
        label: "24/7 AI Assistant"
      },
      {
        id: "content-moderation",
        label: "Content Moderation"
      },
      {
        id: "smart-text-assistant",
        label: "Smart Text Assistant"
      },
      {
        id: "ai-analytics",
        label: "AI Analytics & Predictions"
      }
    ]
  },
  {
    id: "revenue",
    label: "Our Revenue (Reports)",
    icon: React.createElement(TrendingUp, { className: "h-5 w-5" }),
    hasSubmenu: true,
    submenu: [
      {
        id: "daily-revenue",
        label: "Daily Revenue"
      },
      {
        id: "weekly-revenue",
        label: "Weekly Revenue"
      },
      {
        id: "monthly-revenue",
        label: "Monthly Revenue"
      },
      {
        id: "merchant-revenue",
        label: "By Merchant"
      },
      {
        id: "location-revenue",
        label: "By Location"
      }
    ]
  },
  {
    id: "role-management",
    label: "Role Management",
    icon: React.createElement(Shield, { className: "h-5 w-5" })
  },
  {
    id: "settings",
    label: "Settings",
    icon: React.createElement(Settings, { className: "h-5 w-5" }),
    hasSubmenu: true,
    submenu: [
      {
        id: "general-settings",
        label: "General Settings"
      },
      {
        id: "developer-management",
        label: "Developer Management"
      }
    ]
  }
];
