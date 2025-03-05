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

function Router() {
  return (
    <>
      <Header />
      <main>
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
      </main>
    </>
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