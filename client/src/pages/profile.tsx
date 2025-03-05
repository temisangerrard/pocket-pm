import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Calendar, Briefcase, Pencil, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const ROLES = {
  product_manager: "Product Manager",
  product_owner: "Product Owner",
  scrum_master: "Scrum Master",
  technical_lead: "Technical Lead",
  developer: "Developer",
  designer: "Designer",
  qa_engineer: "QA Engineer",
  business_analyst: "Business Analyst",
  stakeholder: "Stakeholder",
  project_manager: "Project Manager",
  ux_researcher: "UX Researcher",
  data_analyst: "Data Analyst",
  marketing_specialist: "Marketing Specialist",
  sales_representative: "Sales Representative",
  customer_success: "Customer Success",
  operations_manager: "Operations Manager",
  executive: "Executive",
  consultant: "Consultant",
  other: "Other"
} as const;

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedRole, setEditedRole] = useState<keyof typeof ROLES>(user?.role as keyof typeof ROLES || "product_manager");

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({ title: "Profile updated successfully" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full" /></div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSave = () => {
    if (!editedName.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({
      name: editedName,
      role: editedRole,
    });
  };

  const handleEdit = () => {
    setEditedName(user?.name || "");
    setEditedRole(user?.role as keyof typeof ROLES || "product_manager");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profile</h1>
          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              className="ml-auto"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {user ? getInitials(isEditing ? editedName : user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold"
                    placeholder="Enter your name"
                  />
                ) : (
                  <CardTitle className="text-2xl">{user?.name}</CardTitle>
                )}
                <Badge variant="outline" className="mt-2">
                  {isEditing ? (
                    <Select 
                      value={editedRole} 
                      onValueChange={(value: keyof typeof ROLES) => setEditedRole(value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    ROLES[user?.role as keyof typeof ROLES] || "Unknown Role"
                  )}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    Role: {isEditing ? ROLES[editedRole] : ROLES[user.role as keyof typeof ROLES] || "Unknown Role"}
                  </span>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleSave} 
                      className="flex-1" 
                      disabled={updateMutation.isPending || !editedName.trim()}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}