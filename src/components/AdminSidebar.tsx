import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  Calendar, 
  CreditCard, 
  ArrowRightLeft, 
  DollarSign, 
  MapPin, 
  UserPlus, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Users2,
  Settings,
  Code
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminSidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: Array<{
    id: string;
    label: string;
  }>;
}

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  expandedItems: string[];
  onToggleExpand: (itemId: string) => void;
}

const sidebarItems: AdminSidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    id: "students",
    label: "Students",
    icon: <Users className="h-5 w-5" />
  },
  {
    id: "merchants",
    label: "Merchants",
    icon: <Building2 className="h-5 w-5" />
  },
  {
    id: "study-halls",
    label: "Study Halls",
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <ArrowRightLeft className="h-5 w-5" />
  },
  {
    id: "settle-now",
    label: "Settle Now (Payouts)",
    icon: <DollarSign className="h-5 w-5" />
  },
  {
    id: "locations",
    label: "Locations",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    id: "leads",
    label: "Leads",
    icon: <UserPlus className="h-5 w-5" />
  },
  {
    id: "banners",
    label: "Banner Management",
    icon: <Megaphone className="h-5 w-5" />
  },
  {
    id: "community",
    label: "Community Feed",
    icon: <Users2 className="h-5 w-5" />
  },
  {
    id: "chat",
    label: "Chat System",
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    id: "ai-features",
    label: "AI Features",
    icon: <Code className="h-5 w-5" />,
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
    icon: <TrendingUp className="h-5 w-5" />,
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
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
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

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onItemClick,
  expandedItems,
  onToggleExpand
}) => {
  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">Sarkari Ninja</h2>
        <p className="text-sm text-gray-600">Advanced Management System</p>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map(item => (
          <div key={item.id}>
            {item.hasSubmenu ? (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-between text-left", 
                      expandedItems.includes(item.id) && "bg-gray-100"
                    )} 
                    onClick={() => onToggleExpand(item.id)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </div>
                    {expandedItems.includes(item.id) ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                  {item.submenu?.map(subItem => (
                    <Button 
                      key={subItem.id} 
                      variant={activeItem === subItem.id ? "default" : "ghost"} 
                      className={cn(
                        "w-full justify-start text-sm", 
                        activeItem === subItem.id && "bg-blue-600 text-white hover:bg-blue-700"
                      )} 
                      onClick={() => onItemClick(subItem.id)}
                    >
                      {subItem.label}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button 
                variant={activeItem === item.id ? "default" : "ghost"} 
                className={cn(
                  "w-full justify-start", 
                  activeItem === item.id && "bg-blue-600 text-white hover:bg-blue-700"
                )} 
                onClick={() => onItemClick(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
