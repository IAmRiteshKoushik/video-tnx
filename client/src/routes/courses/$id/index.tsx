import { createFileRoute } from "@tanstack/react-router";
import { Clock, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/courses/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                width={800}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{course.category}</Badge>
                <Badge>{course.level}</Badge>
              </div>

              <h1 className="text-3xl font-bold">{course.title}</h1>

              <p className="text-muted-foreground">{course.description}</p>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.students.toLocaleString()} students
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.duration} total
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={course.instructorImage || "/placeholder.svg"}
                  alt={course.instructor}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructorTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Enroll in this course</CardTitle>
                <CardDescription>
                  Get access to all course materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Price</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Updated</span>
                    <span>{course.lastUpdated}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="curriculum">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="space-y-4">
              {course.sections.map((section, sectionIndex) => (
                <Card key={sectionIndex}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <Play className="h-4 w-4 text-primary" />
                            </div>
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructorImage || "/placeholder.svg"}
                    alt={course.instructor}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle>{course.instructor}</CardTitle>
                    <CardDescription>{course.instructorTitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{course.instructorBio}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// This would normally come from a database
const course = {
  id: 1,
  title: "Introduction to Web Development",
  description:
    "Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch. This comprehensive course covers everything you need to know to start your journey as a web developer.",
  instructor: "Jane Smith",
  instructorTitle: "Senior Web Developer",
  instructorBio:
    "Jane has over 10 years of experience in web development and has worked with companies like Google and Facebook.",
  category: "Development",
  level: "Beginner",
  students: 1245,
  duration: "12 hours",
  lastUpdated: "January 2024",
  image: "/placeholder.svg?height=400&width=800",
  instructorImage: "/placeholder.svg?height=100&width=100",
  sections: [
    {
      title: "Getting Started with HTML",
      lessons: [
        { title: "Introduction to HTML", duration: "15:30" },
        { title: "HTML Document Structure", duration: "12:45" },
        { title: "Working with Text", duration: "18:20" },
        { title: "HTML Lists and Tables", duration: "22:10" },
      ],
    },
    {
      title: "CSS Fundamentals",
      lessons: [
        { title: "Introduction to CSS", duration: "14:15" },
        { title: "Selectors and Properties", duration: "20:30" },
        { title: "Box Model", duration: "16:45" },
        { title: "Layouts with CSS", duration: "25:10" },
      ],
    },
    {
      title: "JavaScript Basics",
      lessons: [
        { title: "Introduction to JavaScript", duration: "17:20" },
        { title: "Variables and Data Types", duration: "19:45" },
        { title: "Functions and Events", duration: "23:30" },
        { title: "DOM Manipulation", duration: "28:15" },
      ],
    },
  ],
};
