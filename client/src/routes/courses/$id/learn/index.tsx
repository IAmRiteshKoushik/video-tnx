import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Play,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/courses/$id/learn/")({
  component: RouteComponent,
});

const course = {
  id: 1,
  title: "Introduction to Web Development",
  progress: 65,
  sections: [
    {
      title: "Getting Started with HTML",
      lessons: [
        {
          id: 1,
          title: "Introduction to HTML",
          duration: "15:30",
          completed: true,
        },
        {
          id: 2,
          title: "HTML Document Structure",
          duration: "12:45",
          completed: true,
        },
        {
          id: 3,
          title: "Working with Text",
          duration: "18:20",
          completed: true,
        },
        {
          id: 4,
          title: "HTML Lists and Tables",
          duration: "22:10",
          completed: false,
        },
      ],
    },
    {
      title: "CSS Fundamentals",
      lessons: [
        {
          id: 5,
          title: "Introduction to CSS",
          duration: "14:15",
          completed: false,
        },
        {
          id: 6,
          title: "Selectors and Properties",
          duration: "20:30",
          completed: false,
        },
        { id: 7, title: "Box Model", duration: "16:45", completed: false },
        {
          id: 8,
          title: "Layouts with CSS",
          duration: "25:10",
          completed: false,
        },
      ],
    },
    {
      title: "JavaScript Basics",
      lessons: [
        {
          id: 9,
          title: "Introduction to JavaScript",
          duration: "17:20",
          completed: false,
        },
        {
          id: 10,
          title: "Variables and Data Types",
          duration: "19:45",
          completed: false,
        },
        {
          id: 11,
          title: "Functions and Events",
          duration: "23:30",
          completed: false,
        },
        {
          id: 12,
          title: "DOM Manipulation",
          duration: "28:15",
          completed: false,
        },
      ],
    },
  ],
};

function RouteComponent() {
  const [currentLessonId, setCurrentLessonId] = useState(4); // Start with the first incomplete lesson
  const [openSections, setOpenSections] = useState<string[]>(["0"]); // First section open by default

  // Find the current lesson
  let currentLesson = null;

  for (let i = 0; i < course.sections.length; i++) {
    const lesson = course.sections[i].lessons.find(
      (lesson) => lesson.id === currentLessonId,
    );
    if (lesson) {
      currentLesson = lesson;
      break;
    }
  }

  const toggleSection = (index: string) => {
    setOpenSections(
      openSections.includes(index)
        ? openSections.filter((i) => i !== index)
        : [...openSections, index],
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <Link to="/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-lg font-medium">{course.title}</h1>
          <div className="flex items-center gap-2">
            <Progress value={course.progress} className="h-2 w-32" />
            <span className="text-xs text-muted-foreground">
              {course.progress}% complete
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 overflow-auto">
          <div className="aspect-video bg-black">
            {/* Video player would go here */}
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white">
                <Play className="mx-auto h-16 w-16" />
                <h2 className="mt-4 text-xl font-medium">
                  {currentLesson?.title || "Select a lesson to start learning"}
                </h2>
              </div>
            </div>
          </div>

          <div className="container py-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {currentLesson?.title || "Select a lesson"}
                </h2>
                <p className="text-muted-foreground">
                  {currentLesson ? `Duration: ${currentLesson.duration}` : ""}
                </p>
              </div>

              <Separator />

              <div className="prose max-w-none">
                <h3>Lesson Content</h3>
                <p>
                  This is where the lesson content would be displayed. It could
                  include text, images, code examples, and other educational
                  materials to supplement the video.
                </p>

                <h4>Learning Objectives</h4>
                <ul>
                  <li>Understand the core concepts presented in this lesson</li>
                  <li>Apply the techniques demonstrated in the video</li>
                  <li>Complete the practice exercises to reinforce learning</li>
                </ul>

                <h4>Additional Resources</h4>
                <ul>
                  <li>
                    <a href="$" className="text-primary underline">
                      Downloadable PDF guide
                    </a>
                  </li>
                  <li>
                    <a href="$" className="text-primary underline">
                      Code examples on GitHub
                    </a>
                  </li>
                  <li>
                    <a href="$" className="text-primary underline">
                      Further reading
                    </a>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline">Previous Lesson</Button>
                <Button>Mark as Complete</Button>
                <Button>Next Lesson</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Sidebar */}
        <div className="w-80 overflow-auto border-l">
          <div className="p-4">
            <h2 className="font-medium">Course Content</h2>
            <p className="text-sm text-muted-foreground">
              {course.sections.reduce(
                (total, section) => total + section.lessons.length,
                0,
              )}{" "}
              lessons
            </p>
          </div>

          <div className="space-y-1">
            {course.sections.map((section, sectionIndex) => (
              <Collapsible
                key={section.title}
                open={openSections.includes(sectionIndex.toString())}
                onOpenChange={() => toggleSection(sectionIndex.toString())}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between border-y px-4 py-2 hover:bg-muted">
                  <div className="flex items-center">
                    <div className="font-medium">{section.title}</div>
                  </div>
                  {openSections.includes(sectionIndex.toString()) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1 p-1">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${
                          currentLessonId === lesson.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setCurrentLessonId(lesson.id)}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="flex-1">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {lesson.duration}
                        </span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
