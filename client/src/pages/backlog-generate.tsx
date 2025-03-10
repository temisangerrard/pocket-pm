import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Prd } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, ListChecks, FileText } from "lucide-react";

export default function BacklogGenerate() {
  // Get PRD ID from URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const urlPrdId = searchParams.get('prdId');

  const [selectedPrdId, setSelectedPrdId] = useState<string>(urlPrdId || "");
  const [customDescription, setCustomDescription] = useState("");
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: prds } = useQuery<Prd[]>({
    queryKey: ["/api/prds"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { prdId?: number; description?: string }) => {
      const res = await apiRequest(
        "POST",
        "/api/backlog/generate",
        data
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({ 
        title: "Backlog items generated successfully",
        description: "View and prioritize your new features in the backlog."
      });
      setLocation("/features");
    },
    onError: (error: Error) => {
      toast({
        title: "Error Generating Backlog",
        description: error.message || "Failed to generate backlog items. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (selectedPrdId) {
      generateMutation.mutate({ prdId: parseInt(selectedPrdId) });
    }
  }, []); // Run once on mount to auto-generate if PRD ID is in URL

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/prds">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Generate Product Backlog</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Use Existing PRD</CardTitle>
              <CardDescription>
                Select a PRD to use as a base for generating backlog items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPrdId}
                onValueChange={setSelectedPrdId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a PRD" />
                </SelectTrigger>
                <SelectContent>
                  {prds?.map((prd) => (
                    <SelectItem key={prd.id} value={prd.id.toString()}>
                      {prd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPrdId && (
                <Button
                  className="w-full mt-4"
                  onClick={() =>
                    generateMutation.mutate({
                      prdId: parseInt(selectedPrdId),
                    })
                  }
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate from PRD
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Description</CardTitle>
              <CardDescription>
                Or describe your product to generate backlog items from scratch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe your product and its key features..."
                className="mb-4"
              />
              <Button
                className="w-full"
                onClick={() =>
                  generateMutation.mutate({
                    description: customDescription,
                  })
                }
                disabled={!customDescription.trim() || generateMutation.isPending}
              >
                {generateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate from Description
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/prds" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Back to PRDs
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                <ListChecks className="mr-2 h-4 w-4" />
                View Backlog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}