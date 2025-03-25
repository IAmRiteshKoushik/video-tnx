import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoById } from "@/lib/azure-storage";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft } from "lucide-react";
import VideoPlayer from "@/components/video-player";

interface VideoPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideoById(params.id);

  if (!video) {
    notFound();
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
          <nav>
            <Link href="/admin/login">
              <Button variant="ghost" size="sm">
                Educator Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container max-w-5xl">
          <div className="mb-6">
            <Link href="/videos">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Videos
              </Button>
            </Link>
          </div>
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <div className="overflow-hidden rounded-lg border">
              <VideoPlayer
                videoUrl480p={video.url480p}
                videoUrl720p={video.url720p}
              />
            </div>
            {video.description && (
              <div className="space-y-4 rounded-lg border p-6">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground">{video.description}</p>
              </div>
            )}
          </div>
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
