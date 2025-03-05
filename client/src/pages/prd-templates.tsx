import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PrdTemplate } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, FilePlus } from "lucide-react";
import { format } from "date-fns";

export default function PrdTemplates() {
  const { data: templates, isLoading } = useQuery<PrdTemplate[]>({
    queryKey: ["/api/prd/templates"],
  });

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">PRD Templates</h1>
        <Link to="/prd/create">
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Created {format(new Date(template.createdAt), 'PPP')}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No templates yet. Create your first template!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
