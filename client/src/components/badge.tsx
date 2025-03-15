import type React from "react";
import { Badge } from "@/components/ui/badge";

export function CourseBadge({ children }: { children: React.ReactNode }) {
  return <Badge variant="outline">{children}</Badge>;
}
