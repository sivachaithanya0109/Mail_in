import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { appConfig } from "@/config/appConfig";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat — Mail" }, { name: "description", content: "Chat" }, { property: "og:title", content: "Chat — Mail" }, { property: "og:description", content: "Chat" }] }),
  component: () => (
    <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-3 text-muted-foreground">
      <MessageSquare className="h-14 w-14 opacity-40" strokeWidth={1} />{appConfig.text.chatEmpty}
    </div>
  ),
});
