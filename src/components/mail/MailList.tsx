import { Link, useNavigate } from "@tanstack/react-router";
import {
  Archive, ArrowLeft, Inbox as InboxIcon, Mail, MailOpen, Menu, Paperclip, Pencil, RefreshCw, Star, Tag, Trash2, Users, Undo2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { iconRegistry } from "@/lib/icons";
import { filterByFolder, formatListTime, stripHtml } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";
import type { Category, Email } from "@/types/config";
import { Avatar } from "./Avatar";
import { ProfileMenu } from "./ProfileMenu";

export function folderName(id: string) {
  if (id.startsWith("label-")) return id.slice(6);
  return appConfig.folders.find((f) => f.id === id)?.name ?? id;
}

export function MailList({ folder }: { folder: string }) {
  const { emails, tab, setTab, update, move, removeForever, setDrawerOpen, openCompose, reload } = useMail();
  const [selected, setSelected] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const list = filterByFolder(emails, folder, tab);
  const isInbox = folder === "inbox";
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const tabs: { id: Category; label: string; icon: typeof InboxIcon }[] = [
    { id: "primary", label: appConfig.text.tabs.primary, icon: InboxIcon },
    ...(appConfig.app.showPromotionsTab ? [{ id: "promotions" as const, label: appConfig.text.tabs.promotions, icon: Tag }] : []),
    ...(appConfig.app.showSocialTab ? [{ id: "social" as const, label: appConfig.text.tabs.social, icon: Users }] : []),
  ];

  const bulk = (fn: () => void, msg: string) => {
    const ids = selected;
    fn();
    setSelected([]);
    toast(msg.replace("{n}", String(ids.length)));
  };

  const refresh = () => {
    setRefreshing(true);
    reload();
    setTimeout(() => { setRefreshing(false); toast("Up to date"); }, 600);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-20">
      {selected.length > 0 ? (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-1 bg-background px-2">
          <button aria-label="Clear selection" onClick={() => setSelected([])} className="grid h-12 w-12 place-items-center rounded-full hover:bg-accent">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="flex-1 text-lg">{selected.length}</span>
          {folder === "trash" || folder === "spam" ? (
            <>
              <IconBtn label="Move to inbox" onClick={() => bulk(() => move(selected, "inbox"), "{n} moved to Inbox")}><Undo2 /></IconBtn>
              <IconBtn label="Delete forever" onClick={() => confirm("Delete forever?") && bulk(() => removeForever(selected), "{n} deleted forever")}><Trash2 /></IconBtn>
            </>
          ) : (
            <>
              <IconBtn label="Archive" onClick={() => bulk(() => move(selected, "archive"), "{n} archived")}><Archive /></IconBtn>
              <IconBtn label="Delete" onClick={() => bulk(() => move(selected, "trash"), "{n} moved to Bin")}><Trash2 /></IconBtn>
            </>
          )}
          {list.filter((e) => selected.includes(e.id)).some((e) => e.unread) ? (
            <IconBtn label="Mark as read" onClick={() => bulk(() => update(selected, { unread: false }), "{n} marked as read")}><MailOpen /></IconBtn>
          ) : (
            <IconBtn label="Mark as unread" onClick={() => bulk(() => update(selected, { unread: true }), "{n} marked as unread")}><Mail /></IconBtn>
          )}
        </header>
      ) : (
        <header className="sticky top-0 z-30 bg-background px-3 pb-1 pt-2">
          <div className="flex h-12 items-center gap-1 rounded-full bg-search pl-1 pr-1.5">
            <IconBtn label="Open navigation drawer" onClick={() => setDrawerOpen(true)}><Menu /></IconBtn>
            <Link to="/search" className="min-w-0 flex-1 truncate text-base text-muted-foreground">{appConfig.text.searchPlaceholder}</Link>
            <button aria-label="Account" onClick={() => setProfileOpen(true)} className="rounded-full">
              <Avatar name={appConfig.profile.displayName} src={appConfig.profile.avatarUrl || undefined} label={appConfig.profile.initials} size={32} />
            </button>
          </div>
        </header>
      )}

      {isInbox && tabs.length > 1 && (
        <div role="tablist" className="flex border-b">
          {tabs.map((t) => {
            const count = filterByFolder(emails, "inbox", t.id).filter((e) => e.unread).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn("relative flex h-12 flex-1 items-center justify-center gap-1.5 text-sm font-medium",
                  tab === t.id ? "text-primary" : "text-muted-foreground")}
              >
                <t.icon className="h-4 w-4" /> {t.label}
                {t.id !== "primary" && count > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{count}</span>}
                {tab === t.id && <span className="absolute inset-x-6 bottom-0 h-[3px] rounded-t bg-primary" />}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <span className="text-xs font-medium text-muted-foreground">{isInbox ? "" : folderName(folder)}</span>
        <button aria-label="Refresh" onClick={refresh} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent">
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </button>
      </div>

      {folder === "trash" && list.length > 0 && (
        <button
          onClick={() => confirm("Empty Bin? Messages will be deleted forever.") && (removeForever(list.map((e) => e.id)), toast("Bin emptied"))}
          className="mx-4 mb-2 rounded-lg bg-muted px-4 py-3 text-left text-sm"
        >
          Messages in Bin are kept locally. <span className="font-medium text-primary">Empty Bin now</span>
        </button>
      )}

      {list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-20 text-center text-muted-foreground">
          <InboxIcon className="h-16 w-16 opacity-40" strokeWidth={1} />
          <p>{appConfig.text.emptyFolder}</p>
        </div>
      ) : (
        <ul>{list.map((e) => <Row key={e.id} email={e} selected={selected.includes(e.id)} selecting={selected.length > 0} onToggle={() => toggle(e.id)} />)}</ul>
      )}

      <button
        onClick={() => openCompose()}
        className="fixed bottom-20 right-4 z-30 flex h-14 items-center gap-3 rounded-2xl bg-fab px-5 font-medium text-fab-foreground shadow-lg transition-transform active:scale-95"
      >
        <Pencil className="h-5 w-5" /> {appConfig.text.composeLabel}
      </button>

      <BottomNav folder={folder} />
      <ProfileMenu open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

function Row({ email, selected, selecting, onToggle }: { email: Email; selected: boolean; selecting: boolean; onToggle: () => void }) {
  const { update, openCompose } = useMail();
  const navigate = useNavigate();
  const ap = appConfig.appearance;
  const isDraft = email.folder === "drafts";
  const isSent = email.folder === "sent" || isDraft;
  const who = isSent ? `To: ${email.recipients.map((r) => r.name).join(", ") || "(no recipient)"}` : email.sender.name;
  let pressTimer: ReturnType<typeof setTimeout> | undefined;

  const open = () => {
    if (selecting) return onToggle();
    if (isDraft) {
      openCompose({
        draftId: email.id,
        to: email.recipients.map((r) => r.email).join(", "),
        cc: email.cc.map((r) => r.email).join(", "),
        bcc: email.bcc.map((r) => r.email).join(", "),
        subject: email.subject === "(no subject)" ? "" : email.subject,
        body: stripHtml(email.body),
      });
      return;
    }
    navigate({ to: "/mail/$emailId", params: { emailId: email.id } });
  };

  return (
    <li
      className={cn("flex cursor-pointer gap-3 px-4 select-none", ap.compactEmailList ? "py-2" : "py-3", selected ? "bg-selected" : "active:bg-accent")}
      onClick={open}
      onPointerDown={() => (pressTimer = setTimeout(onToggle, 500))}
      onPointerUp={() => clearTimeout(pressTimer)}
      onPointerLeave={() => clearTimeout(pressTimer)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {ap.showSenderAvatars && (
        <button aria-label={selected ? "Deselect" : "Select"} onClick={(e) => { e.stopPropagation(); onToggle(); }} className="h-10 shrink-0 rounded-full">
          <Avatar name={email.sender.name} src={email.sender.avatarUrl} selected={selected} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("min-w-0 flex-1 truncate", email.unread ? "font-bold" : "")}>
            {isDraft ? <span className="text-destructive">Draft </span> : null}{who}
          </span>
          {ap.showTimestamps && <span className={cn("shrink-0 text-xs", email.unread ? "font-bold" : "text-muted-foreground")}>{formatListTime(email.timestamp)}</span>}
        </div>
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm", email.unread ? "font-bold" : "")}>{email.subject}</p>
            <p className="truncate text-sm text-muted-foreground">{email.preview || stripHtml(email.body)}</p>
          </div>
          <button
            aria-label={email.starred ? "Unstar" : "Star"}
            onClick={(e) => { e.stopPropagation(); update([email.id], { starred: !email.starred }); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-full"
          >
            <Star className={cn("h-5 w-5", email.starred ? "fill-star text-star" : "text-muted-foreground")} />
          </button>
        </div>
        {appConfig.app.enableAttachments && email.attachments.length > 0 && (
          <div className="mt-1.5 flex gap-2 overflow-hidden">
            {email.attachments.slice(0, 2).map((a) => (
              <span key={a.name} className="flex min-w-0 max-w-[48%] items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
                <Paperclip className="h-3.5 w-3.5 shrink-0 text-destructive" /><span className="truncate">{a.name}</span>
              </span>
            ))}
            {email.attachments.length > 2 && <span className="rounded-full border px-2 py-1 text-xs">+{email.attachments.length - 2}</span>}
          </div>
        )}
      </div>
    </li>
  );
}

function BottomNav({ folder }: { folder: string }) {
  const { emails } = useMail();
  const unread = filterByFolder(emails, "inbox", "primary").filter((e) => e.unread).length;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t bg-popover">
      {appConfig.bottomNav.map((b) => {
        const Icon = iconRegistry[b.icon];
        const active = folder === b.folder;
        const content = (
          <>
            <span className={cn("relative flex h-8 w-16 items-center justify-center rounded-full", active && "bg-secondary")}>
              <Icon className="h-5 w-5" />
              {b.folder === "inbox" && unread > 0 && (
                <span className="absolute -top-1 right-2 rounded-full bg-destructive px-1.5 text-[10px] font-medium text-destructive-foreground">{unread}</span>
              )}
            </span>
            <span className="text-xs font-medium">{b.label}</span>
          </>
        );
        const cls = "flex flex-1 flex-col items-center justify-center gap-1";
        return b.folder === "inbox" ? (
          <Link key={b.label} to="/" className={cls}>{content}</Link>
        ) : (
          <Link key={b.label} to="/folder/$folderId" params={{ folderId: b.folder }} className={cls}>{content}</Link>
        );
      })}
    </nav>
  );
}

export function IconBtn({ label, onClick, children, className }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-accent [&_svg]:h-6 [&_svg]:w-6", className)}>
      {children}
    </button>
  );
}
