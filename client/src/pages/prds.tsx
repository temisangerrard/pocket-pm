import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Prd } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, FilePlus, ListChecks } from "lucide-react";
import { format } from "date-fns";

export default function Prds() {
  const { data: prds, isLoading } = useQuery<Prd[]>({
    queryKey: ["/api/prds"],
  });

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Requirements Documents</h1>
        <Link to="/prd/create">
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Create New PRD
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {prds?.map((prd) => (
          <Card key={prd.id}>
            <CardHeader>
              <CardTitle>{prd.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {prd.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Created {format(new Date(prd.createdAt), 'PPP')}
                </div>
                <Link to={`/backlog/generate?prdId=${prd.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Generate Backlog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {prds?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No PRDs yet. Create your first PRD!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}