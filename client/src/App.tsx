import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import ReportIssue from "@/pages/ReportIssue";
import ReportDetail from "@/pages/ReportDetail";
import MapView from "@/pages/MapView";
import Assistant from "@/pages/Assistant";
import Profile from "@/pages/Profile";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Navigation />
      <Component {...rest} />
    </>
  );
}

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={() => <PrivateRoute component={Home} />} />
      <Route path="/report" component={() => <PrivateRoute component={ReportIssue} />} />
      <Route path="/report/:id" component={() => <PrivateRoute component={ReportDetail} />} />
      <Route path="/map" component={() => <PrivateRoute component={MapView} />} />
      <Route path="/assistant" component={() => <PrivateRoute component={Assistant} />} />
      <Route path="/profile" component={() => <PrivateRoute component={Profile} />} />
      <Route path="/login" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
