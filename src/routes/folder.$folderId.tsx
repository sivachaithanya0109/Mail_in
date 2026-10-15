import { createFileRoute } from "@tanstack/react-router";
import { MailList } from "@/components/mail/MailList";

export const Route = createFileRoute("/folder/$folderId")({
  head: () => ({
    meta: [
      { title: "Folder — Mail" },
      { name: "description", content: "Browse messages in this folder." },
      { property: "og:title", content: "Folder — Mail" },
      { property: "og:description", content: "Browse messages in this folder." },
    ],
  }),
  component: FolderPage,
});

function FolderPage() {
  const { folderId } = Route.useParams();
  return <MailList key={folderId} folder={folderId} />;
}
