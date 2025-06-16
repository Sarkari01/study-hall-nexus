
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortal from "./pages/StudentPortal";
import MerchantDashboard from "./pages/MerchantDashboard";
import EditorDashboard from "./pages/EditorDashboard";
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Direct dashboard routes without authentication */}
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
            
            {/* Placeholder routes for remaining roles */}
            <Route 
              path="/telecaller" 
              element={
                <ErrorBoundary>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Telecaller Dashboard</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/incharge" 
              element={
                <ErrorBoundary>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Incharge Dashboard</h1>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </ErrorBoundary>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
