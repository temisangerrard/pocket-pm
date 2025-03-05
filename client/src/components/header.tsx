import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold">Pocket PM</a>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}