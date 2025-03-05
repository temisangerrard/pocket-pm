import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { Loader2 } from "lucide-react";

export default function BacklogGenerate() {
  const [selectedPrdId, setSelectedPrdId] = useState<string>("");
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
      toast({ title: "Backlog items generated successfully" });
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Generate Product Backlog</h1>

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
        </div>
      </div>
    </div>
  );
}
