"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Upload, LogOut, Trash2 } from "lucide-react";
import { checkAuth, logout } from "@/lib/auth";
import { getVideos } from "@/lib/azure-storage";

interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
  url480p: string;
  url720p: string;
  description?: string;
  uploadDate: Date;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      try {
        const videoData = await getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your educational videos
              </p>
            </div>
            <Link href="/admin/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload New Video
              </Button>
            </Link>
          </div>

          {videos.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-lg font-medium">No videos uploaded yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by uploading your first educational video
                </p>
                <Link href="/admin/upload">
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={
                        "/thumbnail.jpg"
                      }
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Uploaded:{" "}
                      {new Date(video.uploadDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <Link href={`/videos/${video.id}`}>
                      <Button variant="secondary" size="sm">
                        View Video
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting === video.id}
                      className="gap-2"
                    >
                      {isDeleting === video.id ? (
                        <>Deleting...</>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
