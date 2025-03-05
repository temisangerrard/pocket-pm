import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FeatureList from "@/pages/feature-list";
import PrdCreate from "@/pages/prd-create";
import Prds from "@/pages/prds";
import BacklogGenerate from "@/pages/backlog-generate";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/features" component={FeatureList} />
      <Route path="/prd/create" component={PrdCreate} />
      <Route path="/prds" component={Prds} />
      <Route path="/backlog/generate" component={BacklogGenerate} />
      <Route component={NotFound} />
    </Switch>
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