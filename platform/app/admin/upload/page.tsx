"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { checkAuth } from "@/lib/auth";
import { uploadVideoAction } from "@/app/actions/video-actions";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const video480pRef = useRef<HTMLInputElement>(null);
  const video720pRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push("/admin/login");
      }
    };

    verifyAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    if (!formData.get("title")) {
      setError("Please enter a title for the video");
      return;
    }

    if (!formData.get("video480p") || !formData.get("video720p")) {
      setError("Please upload both 480p and 720p versions of the video");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      const result = await uploadVideoAction(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        // Redirect to admin dashboard after successful upload
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setError(result.message);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload video. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">EduVids</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="mb-6">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Upload New Video</CardTitle>
            </CardHeader>
            <form ref={formRef} onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter video title"
                    disabled={isUploading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter video description"
                    disabled={isUploading}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video480p">480p Video File</Label>
                  <Input
                    ref={video480pRef}
                    id="video480p"
                    name="video480p"
                    type="file"
                    accept="video/mp4,video/webm"
                    disabled={isUploading}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload the 480p version of your video (MP4 or WebM format)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video720p">720p Video File</Label>
                  <Input
                    ref={video720pRef}
                    id="video720p"
                    name="video720p"
                    type="file"
                    accept="video/mp4,video/webm"
                    disabled={isUploading}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload the 720p version of your video (MP4 or WebM format)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
                  <Input
                    ref={thumbnailRef}
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a thumbnail image for your video (JPEG, PNG, or WebP
                    format)
                  </p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isUploading}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={isUploading} className="gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduVids. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
