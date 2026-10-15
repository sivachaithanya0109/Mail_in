import { createFileRoute } from "@tanstack/react-router";
import { MailList } from "@/components/mail/MailList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inbox — Mail" },
      { name: "description", content: "A mobile-first email inbox demo with folders, labels, search and themes." },
      { property: "og:title", content: "Inbox — Mail" },
      { property: "og:description", content: "A mobile-first email inbox demo with folders, labels, search and themes." },
    ],
  }),
  component: () => <MailList folder="inbox" />,
});
