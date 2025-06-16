
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import MerchantDashboard from "./pages/MerchantDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle role-based dashboard routing
const DashboardRouter = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/auth" replace />;
  }

  // Route based on user role
  switch (userRole.name) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'merchant':
      return <Navigate to="/merchant" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    case 'editor':
      return <Navigate to="/editor" replace />;
    case 'telecaller':
      return <Navigate to="/telecaller" replace />;
    case 'incharge':
      return <Navigate to="/incharge" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } />
            
            {/* Role-specific routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['student']}>
                    <StudentPortal />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/merchant" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['merchant']}>
                    <MerchantDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['editor']}>
                    <EditorDashboard />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy routes for backward compatibility */}
            <Route 
              path="/telecaller" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['telecaller']}>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Telecaller Dashboard</h1>
                        <p className="text-gray-600">Coming soon...</p>
                      </div>
                    </div>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incharge" 
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['incharge']}>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Incharge Dashboard</h1>
                        <p className="text-gray-600">Coming soon...</p>
                      </div>
                    </div>
                  </RoleBasedRoute>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
