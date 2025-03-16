import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Clock, Play, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/student/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("my-learning");

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and continue learning
            </p>
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="my-learning" onValueChange={setActiveTab}>
          <TabsContent value="my-learning" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={"course-logo"}
                      width={320}
                      height={180}
                      className=""
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {course.title}
                    </CardTitle>
                    <CardDescription>
                      Instructor: {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Last watched: {course.lastWatched}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/courses/${course.id}/learn`} className="w-full">
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Mock data for enrolled courses
const enrolledCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    instructor: "Jane Smith",
    progress: 65,
    lastWatched: "HTML Forms and Validation",
    image: "/intro-web.jpg",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    instructor: "Sarah Johnson",
    progress: 30,
    lastWatched: "Introduction to Python",
    image: "/data-sci.jpg",
  },
  {
    id: 3,
    title: "UX/UI Design Principles",
    instructor: "Michael Chen",
    progress: 10,
    lastWatched: "Design Thinking Process",
    image: "/ui-ux.jpg",
  },
];
