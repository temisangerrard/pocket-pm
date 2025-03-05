import { useQuery, useMutation } from "@tanstack/react-query";
import { Feature } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import FeatureForm from "@/components/feature-form";
import CsvImport from "@/components/csv-import";
import PriorityChart from "@/components/priority-chart";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown, Plus, Trash2 } from "lucide-react";

export default function FeatureList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: features, isLoading } = useQuery<Feature[]>({
    queryKey: ["/api/features"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/features/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
      toast({ title: "Feature deleted successfully" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, order }: { id: number; order: number }) => {
      await apiRequest("PATCH", `/api/features/${id}/order`, { order });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
    },
  });

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Feature Backlog</h1>
        <div className="flex gap-4">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FeatureForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
          <CsvImport />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="pt-6">
            <PriorityChart features={features || []} />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Sprint Planning Suggestions</h3>
            <p className="text-muted-foreground">
              Based on RICE scores, consider including the top {Math.min(3, features?.length || 0)} features
              in your next sprint for maximum impact.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {features?.map((feature, index) => (
          <Card key={feature.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">RICE Score: </span>
                  {feature.score.toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (index > 0) {
                      reorderMutation.mutate({
                        id: feature.id,
                        order: index - 1,
                      });
                    }
                  }}
                  disabled={index === 0}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(feature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
