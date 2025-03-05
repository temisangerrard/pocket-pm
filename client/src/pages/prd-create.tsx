import { useState } from "react";
import { useLocation, Link } from "wouter";
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
import { Loader2, ListChecks } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Section = {
  title: string;
  content: string;
  order: number;
};

export default function PrdCreate() {
  const [sections, setSections] = useState<Section[]>([]);
  const [savedPrdId, setSavedPrdId] = useState<number | null>(null);
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
        title: "PRD Generated",
        description: "Your PRD is ready for review and customization.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Generating PRD",
        description: error.message || "Failed to generate PRD. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/prds", {
        name: form.getValues().description.slice(0, 50),
        description: form.getValues().description,
        sections,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "PRD Saved" });
      setSavedPrdId(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Saving PRD",
        description: error.message || "Failed to save the PRD. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSectionEdit = (index: number, field: keyof Section, value: string) => {
    setSections((current) => {
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

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
              <form
                onSubmit={form.handleSubmit((data) => generateMutation.mutate(data))}
                className="space-y-4"
              >
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
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        handleSectionEdit(index, "title", e.target.value)
                      }
                      className="font-semibold text-lg"
                    />
                    <Textarea
                      value={section.content}
                      onChange={(e) =>
                        handleSectionEdit(index, "content", e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => saveMutation.mutate()}
                    className="w-full sm:flex-1"
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save PRD
                  </Button>

                  {savedPrdId && (
                    <Link href={`/backlog/generate?prdId=${savedPrdId}`} className="w-full sm:flex-1">
                      <Button variant="outline" className="w-full">
                        <ListChecks className="mr-2 h-4 w-4" />
                        Generate Backlog
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}