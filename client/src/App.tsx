import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import Header from "@/components/header";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import FeatureList from "@/pages/feature-list";
import PrdCreate from "@/pages/prd-create";
import Prds from "@/pages/prds";
import BacklogGenerate from "@/pages/backlog-generate";
import Profile from "@/pages/profile";
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
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home">
        <>
          <Header />
          <Home />
        </>
      </Route>
      <Route path="/features">
        <>
          <Header />
          <FeatureList />
        </>
      </Route>
      <Route path="/prd/create">
        <>
          <Header />
          <PrdCreate />
        </>
      </Route>
      <Route path="/prds">
        <>
          <Header />
          <Prds />
        </>
      </Route>
      <Route path="/backlog/generate">
        <>
          <Header />
          <BacklogGenerate />
        </>
      </Route>
      <Route path="/profile">
        <>
          <Header />
          <Profile />
        </>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;