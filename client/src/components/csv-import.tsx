import { useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InsertFeature } from "@shared/schema";
import { FileUp } from "lucide-react";

export default function CsvImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (feature: InsertFeature) => {
      await apiRequest("POST", "/api/features", feature);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/features"] });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          const feature: InsertFeature = {
            title: row.title || "",
            description: row.description || "",
            reach: parseInt(row.reach) || 5,
            impact: parseInt(row.impact) || 5,
            confidence: parseInt(row.confidence) || 5,
            effort: parseInt(row.effort) || 5,
            priority: (row.priority?.toLowerCase() || "should") as "must" | "should" | "could" | "wont",
          };
          mutation.mutate(feature);
        });
        toast({ title: "Features imported successfully" });
      },
      error: () => {
        toast({
          title: "Error importing CSV",
          variant: "destructive",
        });
      },
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={mutation.isPending}
      >
        <FileUp className="mr-2 h-4 w-4" />
        Import CSV
      </Button>
    </div>
  );
}