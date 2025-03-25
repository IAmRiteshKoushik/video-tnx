import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">EduVids</span>
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
      <main className="flex-1">
        <section className="py-24 md:py-32 lg:py-40">
          <div className="container flex flex-col items-center text-center">
            <div className="mx-auto flex max-w-[800px] flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Learn at your own pace with our video lessons
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Access high-quality educational content created by expert
                educators. No sign-up required.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/videos">
                  <Button size="lg" className="gap-2">
                    <Video className="h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-16">
          <div className="container space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Why Choose Our Platform?</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-4 rounded-lg bg-background p-6 shadow">
                <h3 className="text-xl font-bold">Free Access</h3>
                <p className="text-muted-foreground">
                  All videos are freely available without any registration
                  required.
                </p>
              </div>
              <div className="space-y-4 rounded-lg bg-background p-6 shadow">
                <h3 className="text-xl font-bold">Quality Content</h3>
                <p className="text-muted-foreground">
                  Curated educational videos created by expert educators.
                </p>
              </div>
              <div className="space-y-4 rounded-lg bg-background p-6 shadow">
                <h3 className="text-xl font-bold">Multiple Resolutions</h3>
                <p className="text-muted-foreground">
                  Choose between different video qualities to suit your internet
                  connection.
                </p>
              </div>
            </div>
          </div>
        </section>
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
