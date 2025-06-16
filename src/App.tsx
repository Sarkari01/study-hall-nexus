
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Redirect root to admin */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              
              {/* Admin dashboard route */}
              <Route 
                path="/admin" 
                element={
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                } 
              />
              
              <Route 
                path="/student" 
                element={
                  <ErrorBoundary>
                    <StudentPortal />
                  </ErrorBoundary>
                } 
              />
              
              <Route 
                path="/merchant" 
                element={
                  <ErrorBoundary>
                    <MerchantDashboard />
                  </ErrorBoundary>
                } 
              />
              
              <Route 
                path="/editor" 
                element={
                  <ErrorBoundary>
                    <EditorDashboard />
                  </ErrorBoundary>
                } 
              />
              
              <Route 
                path="/telecaller" 
                element={
                  <ErrorBoundary>
                    <TelecallerDashboard />
                  </ErrorBoundary>
                } 
              />
              
              <Route 
                path="/incharge" 
                element={
                  <ErrorBoundary>
                    <InchargeDashboard />
                  </ErrorBoundary>
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
