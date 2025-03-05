import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FeatureList from "@/pages/feature-list";
import PrdCreate from "@/pages/prd-create";
import Prds from "@/pages/prds";
import BacklogGenerate from "@/pages/backlog-generate";
import Profile from "@/pages/profile";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/features" component={FeatureList} />
          <Route path="/prd/create" component={PrdCreate} />
          <Route path="/prds" component={Prds} />
          <Route path="/backlog/generate" component={BacklogGenerate} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;