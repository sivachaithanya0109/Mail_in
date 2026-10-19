import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "@/lib/icons";
import { appConfig } from "@/config/appConfig";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat â€” Mail" }, { name: "description", content: "Chat" }, { property: "og:title", content: "Chat â€” Mail" }, { property: "og:description", content: "Chat" }] }),
  component: () => (
    <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-3 text-muted-foreground lg:h-full lg:rounded-3xl lg:bg-card">
      <MessageSquare className="h-14 w-14 opacity-40" />{appConfig.text.chatEmpty}
    </div>
  ),
});
