import { useState, useEffect } from "react";
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
import { SiGoogle } from "react-icons/si";
import { Loader2, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [_, setLocation] = useLocation();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onSubmit = async (data: AuthFormValues) => {
    if (isRegistering) {
      await signUpWithEmail(data.email, data.password, data.name || "");
    } else {
      await signInWithEmail(data.email, data.password);
    }
  };

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

          <Button
            variant="outline"
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 mb-4"
          >
            <SiGoogle className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isRegistering && (
                <FormField
                  control={form.control}
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
              )}

              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
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

              <Button type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
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