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
import { Loader2 } from "lucide-react";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { loginMutation, registerMutation, user } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(
      isRegistering
        ? authSchema
        : authSchema.pick({ username: true, password: true })
    ),
  });

  const onSubmit = (data: AuthFormValues) => {
    if (isRegistering) {
      registerMutation.mutate({
        username: data.username,
        password: data.password,
        name: data.name!,
        email: data.email!,
        role: "product_manager", // Default role
      });
    } else {
      loginMutation.mutate({
        username: data.username,
        password: data.password,
      });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isRegistering ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isRegistering
                ? "Sign up to start managing your product development process"
                : "Sign in to continue with your product management"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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

              {isRegistering && (
                <>
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
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {(loginMutation.isPending || registerMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Need an account? Create one"}
            </Button>
          </div>
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
