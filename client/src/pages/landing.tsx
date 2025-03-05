import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiOpenai } from "react-icons/si";
import { Sparkles, FileText, List, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthPage from "./auth";

export default function Landing() {
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect to app if already logged in
  if (user) {
    setLocation("/home");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">Pocket PM</span>
            <Button variant="outline" onClick={() => setShowAuth(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        {showAuth ? (
          <AuthPage />
        ) : (
          <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Your AI-Powered Product Management Assistant
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Create PRDs, generate backlogs, and prioritize features with AI assistance.
                Streamline your product development process with Pocket PM.
              </p>
              <Button size="lg" onClick={() => setShowAuth(true)}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="p-6">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Smart PRD Creation</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive PRDs with AI assistance. Focus on what matters
                  while we handle the structure.
                </p>
              </Card>

              <Card className="p-6">
                <List className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Automated Backlog</h3>
                <p className="text-muted-foreground">
                  Transform your PRDs into detailed backlogs automatically. Save time
                  on manual task breakdown.
                </p>
              </Card>

              <Card className="p-6">
                <Sparkles className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">AI Prioritization</h3>
                <p className="text-muted-foreground">
                  Use RICE scoring and AI insights to prioritize your backlog
                  effectively and make data-driven decisions.
                </p>
              </Card>
            </div>

            {/* Pricing Section */}
            <div className="max-w-5xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Simple, Transparent Pricing</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">Free Trial</h3>
                    <div className="text-3xl font-bold mt-2">$0</div>
                    <p className="text-muted-foreground mt-2">14 days to explore</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                      Up to 3 PRDs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                      Basic AI features
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                      Community support
                    </li>
                  </ul>
                  <Button className="w-full" onClick={() => setShowAuth(true)}>
                    Start Free Trial
                  </Button>
                </Card>

                <Card className="p-8 bg-primary text-primary-foreground">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">Pro</h3>
                    <div className="text-3xl font-bold mt-2">$19</div>
                    <p className="text-primary-foreground/80 mt-2">per month</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Unlimited PRDs
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Advanced AI capabilities
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Custom templates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Team collaboration
                    </li>
                  </ul>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowAuth(true)}
                  >
                    Get Started
                  </Button>
                </Card>
              </div>
            </div>

            {/* Why Section */}
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why Pocket PM?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We built Pocket PM to solve the challenges modern product teams face.
                From spending too much time on documentation to struggling with
                prioritization, our AI-powered solution helps you focus on what truly
                matters - building great products.
              </p>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <SiOpenai className="h-5 w-5" />
                Powered by OpenAI
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}