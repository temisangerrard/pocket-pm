import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Product Management Suite</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create and manage Product Requirements Documents (PRDs), automatically generate
            product backlogs, and prioritize features using proven frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                PRD Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Create, edit, and manage comprehensive Product Requirements Documents.
                Keep all product decisions in one place.
              </p>
              <Link to="/prd/create">
                <Button className="w-full group">
                  Create New PRD 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                AI-Powered Backlog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Transform your PRD into a detailed product backlog using AI.
                Generate, refine, and organize features automatically.
              </p>
              <Link to="/backlog/generate">
                <Button variant="outline" className="w-full group">
                  Generate Backlog
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Feature Prioritization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Prioritize features using RICE scoring and MoSCoW method.
                Get data-driven insights for your roadmap.
              </p>
              <Link to="/features">
                <Button variant="outline" className="w-full group">
                  Prioritize Features
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Your Complete Product Management Workflow
          </h2>
          <p className="text-muted-foreground">
            Start with a PRD, use AI to generate your backlog, and prioritize features
            using proven frameworks. Everything you need to build successful products,
            all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}