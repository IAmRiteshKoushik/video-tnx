import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Plus, Upload } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/dashboard/educator/courses/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([
    { title: "Section 1", lessons: [{ title: "", videoUrl: "" }] },
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: `Section ${sections.length + 1}`,
        lessons: [{ title: "", videoUrl: "" }],
      },
    ]);
  };

  const addLesson = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.push({ title: "", videoUrl: "" });
    setSections(updatedSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate course creation process
    setTimeout(() => {
      setIsLoading(false);
      navigate({ to: "/dashboard/educator" });
    }, 1500);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center">
          <Link to="/dashboard/educator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Course</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>
                    Provide the basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Introduction to Web Development"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn in this course"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="data-science">
                            Data Science
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select required>
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                  <CardDescription>
                    Upload a thumbnail image for your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-10">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        Drag and drop your image here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1280x720px (16:9 ratio)
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    Organize your course into sections and lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="multiple" className="w-full">
                    {sections.map((section, sectionIndex) => (
                      <AccordionItem
                        key={sectionIndex}
                        value={`section-${sectionIndex}`}
                      >
                        <AccordionTrigger>
                          <div className="flex w-full items-center justify-between">
                            <Input
                              value={section.title}
                              onChange={(e) => {
                                const updatedSections = [...sections];
                                updatedSections[sectionIndex].title =
                                  e.target.value;
                                setSections(updatedSections);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mr-2 w-full"
                              placeholder="Section Title"
                            />
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="space-y-2 rounded-lg border p-3"
                              >
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`lesson-${sectionIndex}-${lessonIndex}`}
                                  >
                                    Lesson Title
                                  </Label>
                                  <Input
                                    id={`lesson-${sectionIndex}-${lessonIndex}`}
                                    value={lesson.title}
                                    onChange={(e) => {
                                      const updatedSections = [...sections];
                                      updatedSections[sectionIndex].lessons[
                                        lessonIndex
                                      ].title = e.target.value;
                                      setSections(updatedSections);
                                    }}
                                    placeholder="e.g. Introduction to HTML"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`video-${sectionIndex}-${lessonIndex}`}
                                  >
                                    Video Upload
                                  </Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id={`video-${sectionIndex}-${lessonIndex}`}
                                      value={lesson.videoUrl}
                                      onChange={(e) => {
                                        const updatedSections = [...sections];
                                        updatedSections[sectionIndex].lessons[
                                          lessonIndex
                                        ].videoUrl = e.target.value;
                                        setSections(updatedSections);
                                      }}
                                      placeholder="Video URL or upload"
                                    />
                                    <Button variant="outline" size="icon">
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addLesson(sectionIndex)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Lesson
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button type="button" variant="outline" onClick={addSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                  <CardDescription>
                    Configure the visibility and availability of your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Course Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Course
                      </>
                    ) : (
                      "Publish Course"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
