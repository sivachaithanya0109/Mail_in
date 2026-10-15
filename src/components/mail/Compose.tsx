import { ArrowLeft, ChevronDown, ChevronUp, Paperclip, Send, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import { useMail, type ComposeDraft } from "@/context/MailContext";
import { escapeHtml, isValidEmail, parseAddresses } from "@/lib/mail-helpers";
import type { Attachment, Email } from "@/types/config";

export function Compose() {
  const { compose } = useMail();
  if (!compose) return null;
  return <ComposeForm key={compose.draftId ?? "new"} initial={compose} />;
}

function ComposeForm({ initial }: { initial: ComposeDraft }) {
  const { closeCompose, saveEmail, removeForever } = useMail();
  const [f, setF] = useState(initial);
  const [showCc, setShowCc] = useState(!!(initial.cc || initial.bcc));
  const [files, setFiles] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof ComposeDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const build = (folder: "sent" | "drafts"): Email => {
    const text = f.body + (f.quoted ? `\n\n${f.quoted}` : "");
    return {
      id: f.draftId ?? `local-${Date.now()}`,
      folder, category: "primary",
      sender: { name: appConfig.profile.displayName, email: appConfig.profile.email },
      recipients: parseAddresses(f.to), cc: parseAddresses(f.cc), bcc: parseAddresses(f.bcc),
      subject: f.subject.trim() || "(no subject)",
      preview: text.slice(0, 120),
      body: escapeHtml(text).split("\n").map((l) => `<p>${l || "&nbsp;"}</p>`).join(""),
      timestamp: new Date().toISOString(),
      unread: false, starred: false, important: false, attachments: files, labels: [],
    };
  };

  const dirty = !!(f.to || f.cc || f.bcc || f.subject || f.body);

  const close = () => {
    if (dirty) { saveEmail(build("drafts")); toast("Draft saved"); }
    closeCompose();
  };

  const send = (): void => {
    if (sending) return;
    const all = [...parseAddresses(f.to), ...parseAddresses(f.cc), ...parseAddresses(f.bcc)];
    if (!parseAddresses(f.to).length) { toast.error("Add at least one recipient"); return; }
    const bad = all.find((a) => !isValidEmail(a.email));
    if (bad) { toast.error(`"${bad.email}" isn't a valid address`); return; }
    setSending(true);
    saveEmail(build("sent"));
    toast("Message sent (saved to Sent — demo only)");
    closeCompose();
  };

  const discard = () => {
    if (dirty && !confirm("Discard this draft?")) return;
    if (f.draftId) removeForever([f.draftId]);
    toast("Draft discarded");
    closeCompose();
  };

  const field = "min-w-0 flex-1 bg-transparent py-3 outline-none";
  return (
    <div role="dialog" aria-label="Compose" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background animate-in slide-in-from-bottom">
      <header className="sticky top-0 z-10 flex h-14 items-center bg-background px-1">
        <button aria-label="Close and save draft" onClick={close} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent"><ArrowLeft className="h-6 w-6" /></button>
        <span className="flex-1 text-lg">Compose</span>
        <button aria-label="Attach file" onClick={() => fileRef.current?.click()} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent"><Paperclip className="h-5 w-5" /></button>
        <button aria-label="Send" disabled={sending} onClick={send} className="grid h-12 w-12 place-items-center rounded-full text-primary hover:bg-accent disabled:opacity-50"><Send className="h-5 w-5" /></button>
        <button aria-label="Discard" onClick={discard} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent"><Trash2 className="h-5 w-5" /></button>
        <input ref={fileRef} type="file" multiple hidden onChange={(e) => {
          const list = Array.from(e.target.files ?? []).map((x) => ({
            name: x.name, size: x.size > 1e6 ? `${(x.size / 1e6).toFixed(1)} MB` : `${Math.ceil(x.size / 1e3)} KB`,
            type: (x.type.startsWith("image") ? "image" : x.type.includes("pdf") ? "pdf" : "other") as Attachment["type"],
          }));
          setFiles((p) => [...p, ...list]);
          e.target.value = "";
        }} />
      </header>
      <div className="flex items-center gap-3 border-b px-4 text-muted-foreground">
        <span className="w-12">From</span><span className="truncate py-3 text-foreground">{appConfig.profile.email}</span>
      </div>
      <div className="flex items-center gap-3 border-b px-4">
        <label htmlFor="to" className="w-12 text-muted-foreground">To</label>
        <input id="to" autoFocus={!initial.to} type="email" multiple value={f.to} onChange={set("to")} className={field} />
        <button aria-label="Show Cc and Bcc" onClick={() => setShowCc((v) => !v)} className="text-muted-foreground">{showCc ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
      </div>
      {showCc && (
        <>
          <div className="flex items-center gap-3 border-b px-4"><label htmlFor="cc" className="w-12 text-muted-foreground">Cc</label><input id="cc" value={f.cc} onChange={set("cc")} className={field} /></div>
          <div className="flex items-center gap-3 border-b px-4"><label htmlFor="bcc" className="w-12 text-muted-foreground">Bcc</label><input id="bcc" value={f.bcc} onChange={set("bcc")} className={field} /></div>
        </>
      )}
      <div className="border-b px-4"><input aria-label="Subject" placeholder="Subject" value={f.subject} onChange={set("subject")} className={`${field} w-full placeholder:text-muted-foreground`} /></div>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {files.map((a, i) => (
            <span key={i} className="flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
              <Paperclip className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{a.name}</span><span className="text-muted-foreground">{a.size}</span>
              <button aria-label={`Remove ${a.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
        </div>
      )}
      <textarea aria-label="Message" placeholder="Compose email" autoFocus={!!initial.to} value={f.body} onChange={set("body")}
        className="min-h-48 flex-1 resize-none bg-transparent px-4 py-3 outline-none placeholder:text-muted-foreground" />
      {f.quoted && <pre className="mx-4 mb-6 whitespace-pre-wrap border-l-2 pl-3 font-sans text-sm text-muted-foreground">{f.quoted}</pre>}
    </div>
  );
}
