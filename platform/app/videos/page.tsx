import Link from "next/link";
import { getVideos } from "@/lib/azure-storage";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft } from "lucide-react";

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function VideosPage() {
  const videos = await getVideos();

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
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Video Library
              </h1>
              <p className="text-muted-foreground">
                Browse all available educational videos
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          {videos.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-lg font-medium">No videos available yet</p>
                <p className="text-sm text-muted-foreground">
                  Check back later for new content
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video bg-muted">
                      <img
                        src={
                          video.thumbnailUrl ||
                          "/placeholder.svg?height=200&width=300"
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
                    <CardFooter className="p-4 pt-0">
                      <Button variant="secondary" className="w-full">
                        Watch Video
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
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
