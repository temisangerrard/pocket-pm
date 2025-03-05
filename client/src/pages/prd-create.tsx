import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PrdCreate() {
  const [sections, setSections] = useState<Array<{ title: string; content: string; order: number }>>([]);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      industry: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/prd/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setSections(data.sections);
      toast({
        title: "PRD Template Generated",
        description: "Your template is ready for review and customization.",
      });
    },
    onError: () => {
      toast({
        title: "Error Generating Template",
        description: "Failed to generate PRD template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/prd/templates", {
        name: form.getValues().description.slice(0, 50),
        description: form.getValues().description,
        sections,
      });
    },
    onSuccess: () => {
      toast({ title: "PRD Template Saved" });
      setLocation("/prd/templates");
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New PRD</h1>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Healthcare, Finance, Education"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate PRD Template
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {sections.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Generated Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))}

                <Button
                  onClick={() => saveMutation.mutate()}
                  className="w-full"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Template
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}