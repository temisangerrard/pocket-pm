import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FeatureList from "@/pages/feature-list";
import PrdCreate from "@/pages/prd-create";
import Prds from "@/pages/prds";
import BacklogGenerate from "@/pages/backlog-generate";
import Profile from "@/pages/profile";
import AuthPage from "@/pages/auth";
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
      <Header />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/auth" component={AuthPage} />
            <ProtectedRoute path="/" component={Home} />
            <ProtectedRoute path="/features" component={FeatureList} />
            <ProtectedRoute path="/prd/create" component={PrdCreate} />
            <ProtectedRoute path="/prds" component={Prds} />
            <ProtectedRoute path="/backlog/generate" component={BacklogGenerate} />
            <ProtectedRoute path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
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