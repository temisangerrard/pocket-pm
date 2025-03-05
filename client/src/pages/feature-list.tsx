import { useQuery, useMutation } from "@tanstack/react-query";
import { Feature } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FeatureForm from "@/components/feature-form";
import CsvImport from "@/components/csv-import";
import PriorityChart from "@/components/priority-chart";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown, Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const priorityColors = {
  must: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  should: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  could: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  wont: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
} as const;

const priorityLabels = {
  must: "Must Have",
  should: "Should Have",
  could: "Could Have",
  wont: "Won't Have",
} as const;

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

  const groupedFeatures = features?.reduce((acc, feature) => {
    const priority = feature.priority || 'should';
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/prds">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Feature Backlog</h1>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FeatureForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
          <CsvImport />
          <Link href="/backlog/generate">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              New Backlog
            </Button>
          </Link>
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
              Based on RICE scores and MoSCoW prioritization, consider including
              Must-have features and top {Math.min(3, features?.length || 0)} Should-have
              features in your next sprint.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {(['must', 'should', 'could', 'wont'] as const).map(priority => (
          groupedFeatures?.[priority]?.length ? (
            <div key={priority}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Badge variant="secondary" className={priorityColors[priority]}>
                  {priorityLabels[priority]}
                </Badge>
                <span className="text-muted-foreground">
                  ({groupedFeatures[priority].length} features)
                </span>
              </h2>
              <div className="space-y-4">
                {groupedFeatures[priority].map((feature, index) => (
                  <Card key={feature.id}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">RICE Score: </span>
                          {Number(feature.score).toFixed(2)}
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
          ) : null
        ))}
      </div>
    </div>
  );
}