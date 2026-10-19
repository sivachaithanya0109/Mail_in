import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, SearchX, X } from "lucide-react";
import { useState } from "react";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { formatListTime, searchEmails, stripHtml } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

export function SearchView() {
  const { emails } = useMail();
  const router = useRouter();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const results = searchEmails(emails, q);
  return (
    <div className="flex h-dvh flex-col bg-background lg:h-full lg:rounded-3xl lg:bg-card">
      <header className="z-30 flex h-16 shrink-0 items-center gap-1 border-b bg-background px-1 lg:h-14 lg:px-4">
        <button aria-label="Back" onClick={() => (window.history.length > 1 ? router.history.back() : navigate({ to: "/" }))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={appConfig.text.searchPlaceholder} aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" />
        {q && <button aria-label="Clear search" onClick={() => setQ("")} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent"><X className="h-5 w-5" /></button>}
      </header>
      {q && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground"><SearchX className="h-14 w-14 opacity-40" strokeWidth={1} />{appConfig.text.emptySearch}</div>
      )}
      <ul className="min-h-0 flex-1 overflow-y-auto">
        {results.map((e) => (
          <li key={e.id}>
            <Link to="/mail/$emailId" params={{ emailId: e.id }} className="flex gap-3 px-4 py-3 active:bg-accent">
              <Avatar name={e.sender.name} src={e.sender.avatarUrl} />
              <div className="min-w-0 flex-1">
                <div className="flex gap-2"><span className={cn("min-w-0 flex-1 truncate", e.unread && "font-bold")}>{e.sender.name}</span><span className="shrink-0 text-xs text-muted-foreground">{formatListTime(e.timestamp)}</span></div>
                <p className={cn("truncate text-sm", e.unread && "font-bold")}>{e.subject}</p>
                <p className="truncate text-sm text-muted-foreground">{e.preview || stripHtml(e.body)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
