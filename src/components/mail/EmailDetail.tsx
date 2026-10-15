import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  Archive, ArrowLeft, Bookmark, ChevronDown, ChevronUp, Clock, Download, FileText, Forward, Image as ImageIcon, Mail,
  MoreVertical, Reply, ReplyAll, ShieldAlert, Smile, Star, Tag, Trash2, Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { formatFullTime, formatListTime, sanitizeHtml, stripHtml } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { IconBtn, folderName } from "./MailList";
import { SecuritySheet } from "./SecuritySheet";

export function EmailDetail({ id }: { id: string }) {
  const { emails, update, move, removeForever, openCompose } = useMail();
  const router = useRouter();
  const navigate = useNavigate();
  const email = emails.find((e) => e.id === id);
  const [expanded, setExpanded] = useState(false);
  const [security, setSecurity] = useState(false);
  const [menu, setMenu] = useState(false);
  const [labelsOpen, setLabelsOpen] = useState(false);

  useEffect(() => {
    if (email?.unread) update([email.id], { unread: false });
  }, [email?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = () => (window.history.length > 1 ? router.history.back() : navigate({ to: "/" }));

  if (!email)
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">This message is no longer available.</p>
        <button onClick={() => navigate({ to: "/" })} className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Back to Inbox</button>
      </div>
    );

  const inBin = email.folder === "trash" || email.folder === "spam";
  const act = (fn: () => void, msg: string, leave = true) => {
    fn();
    toast(msg);
    setMenu(false);
    if (leave) back();
  };
  const quote = `On ${formatFullTime(email.timestamp)}, ${email.sender.name} <${email.sender.email}> wrote:\n${stripHtml(email.body)}`;
  const me = appConfig.profile.email.toLowerCase();
  const reSubj = (p: string) => (email.subject.toLowerCase().startsWith(p.toLowerCase()) ? email.subject : `${p} ${email.subject}`);

  const reply = () => openCompose({ to: email.sender.email, subject: reSubj("Re:"), quoted: quote });
  const replyAll = () =>
    openCompose({
      to: [email.sender, ...email.recipients].map((p) => p.email).filter((e) => e.toLowerCase() !== me).join(", "),
      cc: email.cc.map((p) => p.email).filter((e) => e.toLowerCase() !== me).join(", "),
      subject: reSubj("Re:"),
      quoted: quote,
    });
  const forward = () =>
    openCompose({
      subject: reSubj("Fwd:"),
      quoted: `---------- Forwarded message ---------\nFrom: ${email.sender.name} <${email.sender.email}>\nDate: ${formatFullTime(email.timestamp)}\nSubject: ${email.subject}\nTo: ${email.recipients.map((r) => r.email).join(", ")}\n\n${stripHtml(email.body)}`,
    });

  const menuItems: { label: string; icon: typeof Mail; run: () => void }[] = [
    { label: "Mark as unread", icon: Mail, run: () => act(() => update([email.id], { unread: true }), "Marked as unread") },
    { label: email.important ? "Mark not important" : "Mark important", icon: Bookmark, run: () => act(() => update([email.id], { important: !email.important }), email.important ? "Marked not important" : "Marked important", false) },
    ...(appConfig.app.enableLabels ? [{ label: "Change labels", icon: Tag, run: () => { setMenu(false); setLabelsOpen(true); } }] : []),
    { label: "Snooze", icon: Clock, run: () => act(() => move([email.id], "snoozed"), "Snoozed") },
    ...(inBin
      ? [
          { label: "Move to Inbox", icon: Undo2, run: () => act(() => move([email.id], "inbox"), "Moved to Inbox") },
          { label: "Delete forever", icon: Trash2, run: () => confirm("Delete this message forever?") && act(() => removeForever([email.id]), "Deleted forever") },
        ]
      : [
          { label: "Report spam", icon: ShieldAlert, run: () => act(() => move([email.id], "spam"), "Reported as spam") },
          ...(email.folder !== "inbox" ? [{ label: "Move to Inbox", icon: Undo2, run: () => act(() => move([email.id], "inbox"), "Moved to Inbox") }] : []),
        ]),
  ];

  return (
    <div className="min-h-dvh bg-background pb-24">
      <header className="sticky top-0 z-30 flex h-14 items-center bg-background px-1">
        <IconBtn label="Back" onClick={back}><ArrowLeft /></IconBtn>
        <div className="flex-1" />
        {inBin ? (
          <IconBtn label="Restore to Inbox" onClick={() => act(() => move([email.id], "inbox"), "Moved to Inbox")}><Undo2 /></IconBtn>
        ) : (
          <IconBtn label="Archive" onClick={() => act(() => move([email.id], "archive"), "Archived")}><Archive /></IconBtn>
        )}
        <IconBtn
          label={inBin ? "Delete forever" : "Delete"}
          onClick={() =>
            inBin
              ? confirm("Delete this message forever?") && act(() => removeForever([email.id]), "Deleted forever")
              : act(() => move([email.id], "trash"), "Moved to Bin")
          }
        ><Trash2 /></IconBtn>
        <IconBtn label="Mark as unread" onClick={() => act(() => update([email.id], { unread: true }), "Marked as unread")}><Mail /></IconBtn>
        <IconBtn label="More options" onClick={() => setMenu(true)}><MoreVertical /></IconBtn>
      </header>

      <div className="flex items-start gap-2 px-4 pb-4 pt-2">
        <h1 className="min-w-0 flex-1 text-[1.35rem] leading-snug">
          {email.subject}
          <span className="ml-2 inline-block rounded bg-chip px-1.5 py-0.5 align-middle text-xs text-muted-foreground">{folderName(email.folder === "archive" ? "all-mail" : email.folder === "trash" ? "trash" : email.folder)}</span>
          {email.labels.map((l) => (
            <span key={l} className="ml-1 inline-block rounded bg-chip px-1.5 py-0.5 align-middle text-xs text-muted-foreground">{l}</span>
          ))}
        </h1>
        <button aria-label={email.starred ? "Unstar" : "Star"} onClick={() => update([email.id], { starred: !email.starred })} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-accent">
          <Star className={cn("h-6 w-6", email.starred ? "fill-star text-star" : "text-muted-foreground")} />
        </button>
      </div>

      <div className="flex items-start gap-3 px-4">
        <Avatar name={email.sender.name} src={email.sender.avatarUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate font-medium">{email.sender.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{formatListTime(email.timestamp)}</span>
          </div>
          <button onClick={() => setExpanded((v) => !v)} aria-expanded={expanded} className="flex max-w-full items-center gap-1 text-sm text-muted-foreground">
            <span className="truncate">to {email.recipients.map((r) => (r.email.toLowerCase() === me ? "me" : r.name)).join(", ") || "me"}</span>
            {expanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
          </button>
        </div>
        <IconBtn label="Reply" onClick={reply} className="h-10 w-10 [&_svg]:h-5 [&_svg]:w-5"><Reply /></IconBtn>
        <IconBtn label="More" onClick={() => setMenu(true)} className="-mr-2 h-10 w-10 [&_svg]:h-5 [&_svg]:w-5"><MoreVertical /></IconBtn>
      </div>

      {expanded && (
        <div className="mx-4 mt-3 rounded-xl border p-3 text-sm">
          {[
            ["From", `${email.sender.name} • ${email.sender.email}`],
            ["To", email.recipients.map((r) => r.email).join(", ")],
            ...(email.cc.length ? [["Cc", email.cc.map((r) => r.email).join(", ")]] : []),
            ["Date", formatFullTime(email.timestamp)],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 py-0.5">
              <span className="text-muted-foreground">{k}</span><span className="break-words">{v}</span>
            </div>
          ))}
          {appConfig.app.enableSecurityDetails && (
            <button onClick={() => setSecurity(true)} className="mt-2 flex items-center gap-1.5 font-medium text-primary">
              <ShieldAlert className="h-4 w-4" /> {appConfig.text.securityLink}
            </button>
          )}
        </div>
      )}

      {!expanded && appConfig.app.enableSecurityDetails && email.security && (
        <button onClick={() => setSecurity(true)} className="ml-[68px] mt-1 text-xs font-medium text-primary">{appConfig.text.securityLink}</button>
      )}

      <article className="mail-body px-4 pt-5" dangerouslySetInnerHTML={{ __html: sanitizeHtml(email.body) }} />

      {appConfig.app.enableAttachments && email.attachments.length > 0 && (
        <div className="px-4 pt-2">
          <p className="mb-2 text-sm font-medium">{email.attachments.length} attachment{email.attachments.length > 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 gap-3">
            {email.attachments.map((a) => (
              <button key={a.name} onClick={() => toast(`${a.name} — preview not available in demo`)} className="overflow-hidden rounded-xl border text-left">
                <div className="grid h-24 place-items-center bg-muted">
                  {a.type === "image" ? <ImageIcon className="h-10 w-10 text-muted-foreground" /> : <FileText className="h-10 w-10 text-destructive" />}
                </div>
                <div className="flex items-center gap-2 p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.size}</p>
                  </div>
                  <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-4">
        {[
          { label: "Reply", icon: Reply, run: reply },
          { label: "Reply all", icon: ReplyAll, run: replyAll },
          { label: "Forward", icon: Forward, run: forward },
        ].map((b) => (
          <button key={b.label} onClick={b.run} className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full border text-sm font-medium hover:bg-accent">
            <b.icon className="h-4 w-4 shrink-0" /><span className="truncate">{b.label}</span>
          </button>
        ))}
        <button aria-label="React with emoji" onClick={() => toast("Reacted 👍")} className="grid h-10 w-10 place-items-center rounded-full border hover:bg-accent"><Smile className="h-4 w-4" /></button>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/40" onClick={() => setMenu(false)}>
          <div role="menu" onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl bg-popover py-3 pb-6 animate-in slide-in-from-bottom">
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-muted-foreground/40" />
            {menuItems.map((m) => (
              <button key={m.label} role="menuitem" onClick={m.run} className="flex h-12 w-full items-center gap-5 px-6 text-left hover:bg-accent">
                <m.icon className="h-5 w-5 text-muted-foreground" /> {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {labelsOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/40" onClick={() => setLabelsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl bg-popover p-5 pb-8">
            <h2 className="mb-3 text-lg font-medium">Labels</h2>
            {appConfig.labels.map((l) => {
              const on = email.labels.includes(l.name);
              return (
                <label key={l.id} className="flex h-12 items-center gap-4">
                  <input type="checkbox" checked={on} className="h-5 w-5 accent-primary"
                    onChange={() => update([email.id], { labels: on ? email.labels.filter((x) => x !== l.name) : [...email.labels, l.name] })} />
                  {l.name}
                </label>
              );
            })}
            <button onClick={() => { setLabelsOpen(false); toast("Labels updated"); }} className="mt-3 h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground">Done</button>
          </div>
        </div>
      )}

      {security && <SecuritySheet email={email} onClose={() => setSecurity(false)} />}
    </div>
  );
}
