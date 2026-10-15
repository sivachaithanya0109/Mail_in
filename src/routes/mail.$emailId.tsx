import { createFileRoute } from "@tanstack/react-router";
import { EmailDetail } from "@/components/mail/EmailDetail";

export const Route = createFileRoute("/mail/$emailId")({
  head: () => ({
    meta: [
      { title: "Message — Mail" },
      { name: "description", content: "Read a message, reply, forward, archive or view security details." },
      { property: "og:title", content: "Message — Mail" },
      { property: "og:description", content: "Read a message, reply, forward, archive or view security details." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const { emailId } = Route.useParams();
  return <EmailDetail key={emailId} id={emailId} />;
}
