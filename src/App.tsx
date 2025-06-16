
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import MerchantDashboard from "./pages/MerchantDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import TelecallerDashboard from "./pages/TelecallerDashboard";
import InchargeDashboard from "./pages/InchargeDashboard";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Authentication route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Redirect root to auth */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              
              {/* Protected role-based routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/student" 
                element={
                  <ProtectedRoute requiredRole="student">
                    <ErrorBoundary>
                      <StudentPortal />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/merchant" 
                element={
                  <ProtectedRoute requiredRole="merchant">
                    <ErrorBoundary>
                      <MerchantDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute requiredRole="editor">
                    <ErrorBoundary>
                      <EditorDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/telecaller" 
                element={
                  <ProtectedRoute requiredRole="telecaller">
                    <ErrorBoundary>
                      <TelecallerDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/incharge" 
                element={
                  <ProtectedRoute requiredRole="incharge">
                    <ErrorBoundary>
                      <InchargeDashboard />
                    </ErrorBoundary>
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
