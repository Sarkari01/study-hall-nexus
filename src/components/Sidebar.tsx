
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  title: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onItemClick, title }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <nav className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeItem === item.id && "bg-blue-600 text-white hover:bg-blue-700"
            )}
            onClick={() => onItemClick(item.id)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
