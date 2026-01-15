import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useLearningStore } from "@/store/learningStore";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import QuizPage from "./pages/QuizPage";
import DashboardPage from "./pages/DashboardPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useLearningStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Route that requires onboarding
const OnboardedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasCompletedOnboarding } = useLearningStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Route that requires quiz completion
const QuizCompletedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasCompletedOnboarding, hasCompletedQuiz } = useLearningStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (!hasCompletedQuiz) {
    return <Navigate to="/quiz" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz" 
            element={
              <OnboardedRoute>
                <QuizPage />
              </OnboardedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <QuizCompletedRoute>
                <DashboardPage />
              </QuizCompletedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <QuizCompletedRoute>
                <RecommendationsPage />
              </QuizCompletedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
