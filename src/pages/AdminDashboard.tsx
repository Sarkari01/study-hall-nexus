import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Users, MessageSquare, FileText, Settings } from "lucide-react";
import StudyHallsTable from "@/components/admin/StudyHallsTable";
import { useStudyHalls } from "@/hooks/useStudyHalls";

const AdminDashboard = () => {
  const studyHalls = useStudyHalls();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Tabs defaultValue="study-halls" className="space-y-4">
              <TabsList className="flex flex-col space-y-2">
                <TabsTrigger value="study-halls" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <PieChart className="mr-2 h-4 w-4" /> Study Halls
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <Users className="mr-2 h-4 w-4" /> Users
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" /> Messages
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <FileText className="mr-2 h-4 w-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Dashboard Content</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Tabs defaultValue="study-halls" className="h-full">
              <TabsList>
                <TabsTrigger value="study-halls">Study Halls</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="study-halls">
                <StudyHallsTable data={studyHalls.studyHalls || []} />
              </TabsContent>
              <TabsContent value="users">
                <div>Users Content</div>
              </TabsContent>
              <TabsContent value="messages">
                <div>Messages Content</div>
              </TabsContent>
              <TabsContent value="reports">
                <div>Reports Content</div>
              </TabsContent>
              <TabsContent value="settings">
                <div>Settings Content</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
