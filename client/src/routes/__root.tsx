import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="container mx-auto relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">
            <Outlet />
            <TanStackRouterDevtools />
          </div>
        </div>
      </ThemeProvider>
    </>
  ),
});
