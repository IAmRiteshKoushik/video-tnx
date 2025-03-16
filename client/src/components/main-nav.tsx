import { Link } from "@tanstack/react-router";
import { BookOpen, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/courses",
      label: "Courses",
    },
  ];

  return (
    <div className="flex gap-6 md:gap-10">
      <Link to="/" className="hidden items-center space-x-2 md:flex">
        <BookOpen className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          LearningPlatform
        </span>
      </Link>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">Learning Platform</span>
          </Link>
          <div className="my-4 flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <nav className="hidden gap-6 md:flex">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className={cn(
              "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
