import { createFileRoute } from "@tanstack/react-router";
import { SearchView } from "@/components/mail/SearchView";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Mail" },
      { name: "description", content: "Search messages by sender, recipient, subject or body." },
      { property: "og:title", content: "Search — Mail" },
      { property: "og:description", content: "Search messages by sender, recipient, subject or body." },
    ],
  }),
  component: SearchView,
});
