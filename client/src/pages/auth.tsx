import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, error, login, register } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/home");
    return null;
  }

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        const regData = data as RegisterFormValues;
        await register(regData.username, regData.password, regData.name, regData.email);
      } else {
        const loginData = data as LoginFormValues;
        await login(loginData.username, loginData.password);
      }
    } catch (err) {
      // Error is handled by the mutations
      console.error("Auth error:", err);
      toast({
        title: "Authentication Error",
        description: err instanceof Error ? err.message : "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Reset Password",
      description: "Please contact support to reset your password.",
    });
  };

  const currentForm = isRegistering ? registerForm : loginForm;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isRegistering
                ? "Sign up to start managing your product development process"
                : "Sign in to continue with your product management"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {error.message || "There was an error with authentication. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          <Form {...currentForm}>
            <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={currentForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isRegistering && (
                <>
                  <FormField
                    control={currentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={currentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={currentForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isRegistering && (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal text-sm"
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </Button>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isRegistering ? "Already have an account? " : "Need an account? "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Sign in" : "Create one"}
            </Button>
          </p>
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