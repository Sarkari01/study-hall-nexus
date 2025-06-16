
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { isValidRole, getRoleRoute, ValidRole } from "@/utils/roleValidation";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import MerchantDashboard from "./pages/MerchantDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import TelecallerDashboard from "./pages/TelecallerDashboard";
import InchargeDashboard from "./pages/InchargeDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to redirect users to their appropriate dashboard based on role
const RoleDashboardRedirect = () => {
  const { userRole } = useAuth();
  
  if (!userRole) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isValidRole(userRole.name)) {
    return <Navigate to="/auth" replace />;
  }
  
  const targetRoute = getRoleRoute(userRole.name as ValidRole);
  return <Navigate to={targetRoute} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected dashboard routes with role-based access */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <RoleBasedRoute allowedRoles={["admin"]}>
                      <ErrorBoundary>
                        <AdminDashboard />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <RoleBasedRoute allowedRoles={["student"]}>
                      <ErrorBoundary>
                        <StudentPortal />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/merchant" 
                element={
                  <ProtectedRoute requiredRole="merchant">
                    <RoleBasedRoute allowedRoles={["merchant"]}>
                      <ErrorBoundary>
                        <MerchantDashboard />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute requiredRole="editor">
                    <RoleBasedRoute allowedRoles={["editor"]}>
                      <ErrorBoundary>
                        <EditorDashboard />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/telecaller" 
                element={
                  <ProtectedRoute requiredRole="telecaller">
                    <RoleBasedRoute allowedRoles={["telecaller"]}>
                      <ErrorBoundary>
                        <TelecallerDashboard />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/incharge" 
                element={
                  <ProtectedRoute requiredRole="incharge">
                    <RoleBasedRoute allowedRoles={["incharge"]}>
                      <ErrorBoundary>
                        <InchargeDashboard />
                      </ErrorBoundary>
                    </RoleBasedRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Auto-redirect based on role */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <RoleDashboardRedirect />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
