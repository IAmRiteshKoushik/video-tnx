import { Link, createFileRoute } from "@tanstack/react-router";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/courses/"!</div>;
}

// Mock data for courses
const courses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    instructor: "Jane Smith",
    category: "Development",
    level: "Beginner",
    students: 1245,
    image: "/placeholder.svg?height=220&width=400",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns",
    instructor: "John Doe",
    category: "Development",
    level: "Advanced",
    students: 843,
    image: "/placeholder.svg?height=220&width=400",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Introduction to data analysis and visualization",
    instructor: "Sarah Johnson",
    category: "Data Science",
    level: "Intermediate",
    students: 976,
    image: "/placeholder.svg?height=220&width=400",
  },
  {
    id: 4,
    title: "UX/UI Design Principles",
    description: "Learn the core principles of user experience design",
    instructor: "Michael Chen",
    category: "Design",
    level: "Beginner",
    students: 654,
    image: "/placeholder.svg?height=220&width=400",
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms",
    instructor: "Alex Rodriguez",
    category: "Data Science",
    level: "Intermediate",
    students: 1089,
    image: "/placeholder.svg?height=220&width=400",
  },
  {
    id: 6,
    title: "Mobile App Development with Flutter",
    description: "Build cross-platform mobile apps with Flutter",
    instructor: "Emily Wilson",
    category: "Development",
    level: "Intermediate",
    students: 732,
    image: "/placeholder.svg?height=220&width=400",
  },
];

export default function CoursesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Course Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and enroll in courses from top educators
          </p>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex w-full items-center space-x-2 md:w-2/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-8"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={400}
                  height={220}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge>{course.level}</Badge>
                </div>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Instructor: {course.instructor}
                </p>
                <p className="text-sm text-muted-foreground">
                  {course.students.toLocaleString()} students enrolled
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full">Enroll Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
