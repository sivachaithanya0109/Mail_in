import { createFileRoute } from "@tanstack/react-router";
import { Video } from "lucide-react";
import { appConfig } from "@/config/appConfig";

export const Route = createFileRoute("/meet")({
  head: () => ({ meta: [{ title: "Meet — Mail" }, { name: "description", content: "Meet" }, { property: "og:title", content: "Meet — Mail" }, { property: "og:description", content: "Meet" }] }),
  component: () => (
    <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-3 text-muted-foreground lg:h-full lg:rounded-3xl lg:bg-card">
      <Video className="h-14 w-14 opacity-40" strokeWidth={1} />{appConfig.text.meetEmpty}
    </div>
  ),
});
