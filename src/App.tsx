
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import MerchantDashboard from "./pages/MerchantDashboard";
import EditorDashboard from "./pages/EditorDashboard";
import TelecallerDashboard from "./pages/TelecallerDashboard";
import InchargeDashboard from "./pages/InchargeDashboard";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import MobileStudentApp from "./components/mobile/MobileStudentApp";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth route */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Public booking route - no authentication required */}
                <Route path="/book/:id" element={<BookingPage />} />
                
                {/* Mobile Student App - Main route for mobile users */}
                <Route 
                  path="/" 
                  element={
                    isMobile ? (
                      <MobileStudentApp />
                    ) : (
                      <Navigate to="/admin" replace />
                    )
                  } 
                />
                
                {/* Protected Admin route */}
                <Route 
                  path="/admin" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="admin">
                        <ErrorBoundary>
                          <AdminDashboard />
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
                  } 
                />
                
                {/* Protected Student route - with mobile optimization */}
                <Route 
                  path="/student" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="student">
                        <ErrorBoundary>
                          {isMobile ? <MobileStudentApp /> : <StudentPortal />}
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
                  } 
                />
                
                {/* Protected Merchant route */}
                <Route 
                  path="/merchant" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="merchant">
                        <ErrorBoundary>
                          <MerchantDashboard />
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
                  } 
                />
                
                {/* Protected Editor route */}
                <Route 
                  path="/editor" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="editor">
                        <ErrorBoundary>
                          <EditorDashboard />
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
                  } 
                />
                
                {/* Protected Telecaller route */}
                <Route 
                  path="/telecaller" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="telecaller">
                        <ErrorBoundary>
                          <TelecallerDashboard />
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
                  } 
                />
                
                {/* Protected Incharge route */}
                <Route 
                  path="/incharge" 
                  element={
                    <AuthenticationGuard>
                      <RoleGuard requiredRole="incharge">
                        <ErrorBoundary>
                          <InchargeDashboard />
                        </ErrorBoundary>
                      </RoleGuard>
                    </AuthenticationGuard>
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
};

export default App;
