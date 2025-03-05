import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/header";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import FeatureList from "@/pages/feature-list";
import PrdCreate from "@/pages/prd-create";
import Prds from "@/pages/prds";
import BacklogGenerate from "@/pages/backlog-generate";
import Profile from "@/pages/profile";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <ProtectedRoute path="/home">
          <>
            <Header />
            <Home />
          </>
        </ProtectedRoute>
        <ProtectedRoute path="/features">
          <>
            <Header />
            <FeatureList />
          </>
        </ProtectedRoute>
        <ProtectedRoute path="/prd/create">
          <>
            <Header />
            <PrdCreate />
          </>
        </ProtectedRoute>
        <ProtectedRoute path="/prds">
          <>
            <Header />
            <Prds />
          </>
        </ProtectedRoute>
        <ProtectedRoute path="/backlog/generate">
          <>
            <Header />
            <BacklogGenerate />
          </>
        </ProtectedRoute>
        <ProtectedRoute path="/profile">
          <>
            <Header />
            <Profile />
          </>
        </ProtectedRoute>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;