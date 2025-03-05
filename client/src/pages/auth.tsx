import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiGoogle } from "react-icons/si";

export default function AuthPage() {
  const { user, signInWithGoogle } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to Pocket PM</h1>
            <p className="text-muted-foreground">
              Sign in to start managing your product development process
            </p>
          </div>

          <Button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2"
          >
            <SiGoogle className="h-4 w-4" />
            Sign in with Google
          </Button>
        </Card>
      </div>

      <div className="hidden md:flex flex-col justify-center p-8 bg-muted">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4">Pocket PM</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your pocket product manager. Create PRDs, generate backlogs, and
            prioritize features with AI assistance.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              ✨ AI-powered PRD generation
            </li>
            <li className="flex items-center">
              📊 Intelligent backlog management
            </li>
            <li className="flex items-center">
              🎯 Feature prioritization with RICE scoring
            </li>
            <li className="flex items-center">
              📱 Mobile-responsive design
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}