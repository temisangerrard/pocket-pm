import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Pocket PM</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-2">
            Your pocket product manager. Create PRDs, generate backlogs, and prioritize features with AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8">
          <Card className="relative">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                PRD Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Create, edit, and manage comprehensive Product Requirements Documents.
                Keep all product decisions in one place.
              </p>
              <div className="space-y-2">
                <Link to="/prd/create" className="block">
                  <Button className="w-full group">
                    Create New PRD 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/prds" className="block">
                  <Button variant="outline" className="w-full group">
                    View All PRDs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                AI-Powered Backlog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Transform your PRD into a detailed product backlog using AI.
                Generate, manage, and prioritize features with RICE scoring and MoSCoW method.
              </p>
              <div className="space-y-2">
                <Link to="/backlog/generate" className="block">
                  <Button className="w-full group">
                    Generate Backlog
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/features" className="block">
                  <Button variant="outline" className="w-full group">
                    View Backlog
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 sm:mt-16 max-w-2xl mx-auto text-center px-2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Your Pocket Product Manager
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Start with a PRD, use AI to generate your backlog, and prioritize features
            using proven frameworks. Everything you need for product management,
            right in your pocket.
          </p>
        </div>
      </div>
    </div>
  );
}