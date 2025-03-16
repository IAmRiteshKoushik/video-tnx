import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  BarChart,
  BookOpen,
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
  Upload,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/educator/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Educator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your courses and track student progress
            </p>
          </div>
          <Link to="/dashboard/educator/courses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,655</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Courses
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    +1 new this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Videos
                  </CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">74</div>
                  <p className="text-xs text-muted-foreground">
                    +8 new this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent course and student activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New Student Enrollment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 new students enrolled in "Introduction to Web
                        Development"
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Video Published</p>
                      <p className="text-xs text-muted-foreground">
                        You published "CSS Grid Layout" in "Responsive Web
                        Design"
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <BarChart className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Course Milestone</p>
                      <p className="text-xs text-muted-foreground">
                        "Advanced JavaScript Concepts" reached 800+ students
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>
                  Manage and update your course content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Students
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Videos
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Last Updated
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={"logo"}
                              width={60}
                              height={40}
                              className="rounded object-cover"
                            />
                            <div className="font-medium">{course.title}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.students}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.videos}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.lastUpdated}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Video
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                View Students
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  View and manage students enrolled in your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{course.title}</h3>
                        <Badge variant="outline">
                          {course.students} students
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">
                          <Users className="mr-2 h-4 w-4" />
                          View Student List
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Mock data for educator courses
const courses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    students: 1245,
    videos: 24,
    lastUpdated: "2023-12-15",
    image: "intro-web.jpg",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    students: 843,
    videos: 32,
    lastUpdated: "2024-01-20",
    image: "adv-react.jpg",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    students: 567,
    videos: 18,
    lastUpdated: "2024-02-05",
    image: "data-sci.png",
  },
];
