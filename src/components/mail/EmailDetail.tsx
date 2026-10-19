import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Forward,
  Image as ImageIcon,
  Lock,
  Mail,
  MoreVertical,
  Reply,
  ReplyAll,
  ShieldAlert,
  Smile,
  Star,
  Tag,
  Trash2,
  Undo2,
} from "@/lib/icons";
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
  const [reactionsOpen, setReactionsOpen] = useState(false);

  useEffect(() => {
    if (email?.unread) update([email.id], { unread: false });
  }, [email?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = () => (window.history.length > 1 ? router.history.back() : navigate({ to: "/" }));

  if (!email)
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">{appConfig.text.messageUnavailable}</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          {appConfig.text.backToInbox}
        </button>
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
  const reSubj = (p: string) =>
    email.subject.toLowerCase().startsWith(p.toLowerCase())
      ? email.subject
      : `${p} ${email.subject}`;

  const reply = () =>
    openCompose({
      to: email.sender.email,
      subject: reSubj(appConfig.text.replyPrefix),
      quoted: quote,
    });
  const replyAll = () =>
    openCompose({
      to: [email.sender, ...email.recipients]
        .map((p) => p.email)
        .filter((e) => e.toLowerCase() !== me)
        .join(", "),
      cc: email.cc
        .map((p) => p.email)
        .filter((e) => e.toLowerCase() !== me)
        .join(", "),
      subject: reSubj(appConfig.text.replyPrefix),
      quoted: quote,
    });
  const forward = () =>
    openCompose({
      subject: reSubj(appConfig.text.forwardPrefix),
      quoted: appConfig.text.forwardedMessageTemplate
        .replace("{from}", `${email.sender.name} <${email.sender.email}>`)
        .replace("{date}", formatFullTime(email.timestamp))
        .replace("{subject}", email.subject)
        .replace("{to}", email.recipients.map((r) => r.email).join(", "))
        .replace("{body}", stripHtml(email.body)),
    });

  const menuItems: { label: string; icon: typeof Mail; run: () => void }[] = [
    {
      label: appConfig.text.markAsUnread,
      icon: Mail,
      run: () => act(() => update([email.id], { unread: true }), appConfig.text.markedAsUnread),
    },
    {
      label: appConfig.text.replyAll,
      icon: ReplyAll,
      run: () => {
        setMenu(false);
        replyAll();
      },
    },
    {
      label: email.important ? appConfig.text.markNotImportant : appConfig.text.markImportant,
      icon: Bookmark,
      run: () =>
        act(
          () => update([email.id], { important: !email.important }),
          email.important ? appConfig.text.markedNotImportant : appConfig.text.markedImportant,
          false,
        ),
    },
    ...(appConfig.app.enableLabels
      ? [
          {
            label: appConfig.text.changeLabels,
            icon: Tag,
            run: () => {
              setMenu(false);
              setLabelsOpen(true);
            },
          },
        ]
      : []),
    {
      label: appConfig.text.snooze,
      icon: Clock,
      run: () => act(() => move([email.id], "snoozed"), appConfig.text.snoozed),
    },
    ...(email.unsubscribe
      ? [
          {
            label: appConfig.text.unsubscribe,
            icon: Mail,
            run: () => {
              setMenu(false);
              toast(appConfig.text.unsubscribeNotice);
            },
          },
        ]
      : []),
    ...(inBin
      ? [
          {
            label: appConfig.text.moveToInbox,
            icon: Undo2,
            run: () => act(() => move([email.id], "inbox"), appConfig.text.movedToInbox),
          },
          {
            label: appConfig.text.deleteForever,
            icon: Trash2,
            run: () =>
              confirm(appConfig.text.deleteForeverConfirmation) &&
              act(() => removeForever([email.id]), appConfig.text.deletedForever),
          },
        ]
      : [
          {
            label: appConfig.text.reportSpam,
            icon: ShieldAlert,
            run: () => act(() => move([email.id], "spam"), appConfig.text.reportedSpam),
          },
          ...(email.folder !== "inbox"
            ? [
                {
                  label: appConfig.text.moveToInbox,
                  icon: Undo2,
                  run: () => act(() => move([email.id], "inbox"), appConfig.text.movedToInbox),
                },
              ]
            : []),
        ]),
  ];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] lg:h-full lg:rounded-3xl lg:bg-card lg:pb-0">
      <header className="z-30 flex h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 items-center bg-background px-1 pt-[env(safe-area-inset-top)] lg:h-14 lg:px-4 lg:pt-0">
        <IconBtn label={appConfig.text.back} onClick={back}>
          <ArrowLeft />
        </IconBtn>
        <div className="flex-1" />
        {inBin ? (
          <IconBtn
            label={appConfig.text.restoreToInbox}
            onClick={() => act(() => move([email.id], "inbox"), appConfig.text.movedToInbox)}
          >
            <Undo2 />
          </IconBtn>
        ) : (
          <IconBtn
            label={appConfig.text.archive}
            onClick={() => act(() => move([email.id], "archive"), appConfig.text.archived)}
          >
            <Archive />
          </IconBtn>
        )}
        <IconBtn
          label={inBin ? appConfig.text.deleteForever : appConfig.text.delete}
          onClick={() =>
            inBin
              ? confirm(appConfig.text.deleteForeverConfirmation) &&
                act(() => removeForever([email.id]), appConfig.text.deletedForever)
              : act(() => move([email.id], "trash"), appConfig.text.movedToBin)
          }
        >
          <Trash2 />
        </IconBtn>
        <IconBtn
          label={appConfig.text.markAsUnread}
          onClick={() =>
            act(() => update([email.id], { unread: true }), appConfig.text.markedAsUnread)
          }
        >
          <Mail />
        </IconBtn>
        <IconBtn label={appConfig.text.moreOptions} onClick={() => setMenu(true)}>
          <MoreVertical />
        </IconBtn>
      </header>

      <div className="flex min-h-[4.75rem] shrink-0 items-center gap-2 px-4 py-3 lg:min-h-0 lg:px-10 lg:pb-5 lg:pt-7">
        <h1 className="min-w-0 flex-1 text-[1.35rem] leading-snug">
          <span className="break-words">{email.subject}</span>{" "}
          <span className="inline-block shrink-0 rounded bg-chip px-1.5 py-0.5 align-middle text-xs text-muted-foreground dark:bg-[#3b4b72] dark:text-[#d3e3fd]">
            {email.folder === "inbox"
              ? appConfig.text.inboxChip
              : folderName(email.folder === "archive" ? "all-mail" : email.folder)}
          </span>
        </h1>
        <button
          aria-label={email.starred ? appConfig.text.unstar : appConfig.text.star}
          onClick={() => update([email.id], { starred: !email.starred })}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-accent"
        >
          <Star
            className={cn(
              "h-6 w-6",
              email.starred ? "fill-star text-star" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 lg:px-10 lg:overscroll-auto">
        <section className="relative rounded-[1.75rem] bg-card px-4 py-4 lg:mx-auto lg:max-w-6xl lg:rounded-none lg:px-0 lg:py-2">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3">
            <Avatar name={email.sender.name} src={email.sender.avatarUrl} />
            <div className="min-w-0 pt-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="truncate font-medium">{email.sender.name}</span>
                {email.verified && (
                  <BadgeCheck
                    aria-label={appConfig.text.verifiedSender}
                    className="h-4 w-4 shrink-0 fill-sky-400 text-background"
                  />
                )}
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatListTime(email.timestamp)}
                </span>
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="flex max-w-full items-center gap-1 pt-1 text-sm text-muted-foreground"
              >
                <span className="truncate">{appConfig.text.toMe}</span>
                {expanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>
            </div>
            {email.unsubscribe && (
              <button
                onClick={() => toast(appConfig.text.unsubscribeNotice)}
                className="pt-2 text-sm font-medium text-link"
              >
                {appConfig.text.unsubscribe}
              </button>
            )}
            <IconBtn
              label={appConfig.text.moreSenderActions}
              onClick={() => setMenu(true)}
              className="-mr-2 -mt-1 h-10 w-10 [&_svg]:h-5 [&_svg]:w-5"
            >
              <MoreVertical />
            </IconBtn>
          </div>

          {expanded && (
            <div className="mt-4 rounded-2xl bg-panel p-4 text-sm lg:absolute lg:left-12 lg:top-14 lg:z-40 lg:mt-0 lg:w-[min(32rem,calc(100vw-22rem))] lg:rounded-sm lg:border lg:border-[#dadce0] lg:bg-white lg:p-4 lg:text-sm lg:text-[#202124] lg:shadow-[0_2px_6px_rgba(60,64,67,0.3)]">
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 lg:grid-cols-[6.25rem_minmax(0,1fr)] lg:gap-x-3 lg:gap-y-1">
                <span className="text-muted-foreground lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.messageFrom}</span>
                <span className="break-words lg:hidden">{email.sender.email}</span>
                <span className="hidden break-words lg:block lg:text-[#202124]">
                  <strong className="font-medium">{email.sender.name}</strong>{" "}
                  <span className="text-[#5f6368]">&lt;{email.sender.email}&gt;</span>
                </span>
                <span className="text-muted-foreground lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.messageTo}</span>
                <span className="break-words lg:text-[#202124]">
                  {email.recipients.map((r) => r.email).join(", ")}
                </span>
                <span className="text-muted-foreground lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.messageDate}</span>
                <span className="break-words lg:text-[#202124]">{formatFullTime(email.timestamp)}</span>
                {email.security?.subject && (
                  <>
                    <span className="hidden text-muted-foreground lg:block lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.messageSubject}</span>
                    <span className="hidden break-words lg:block lg:text-[#202124]">{email.security.subject}</span>
                  </>
                )}
                {email.security?.mailedBy && (
                  <>
                    <span className="hidden text-muted-foreground lg:block lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.mailedByCompact}</span>
                    <span className="hidden break-words lg:block lg:text-[#202124]">{email.security.mailedBy}</span>
                  </>
                )}
                {email.security?.signedBy && (
                  <>
                    <span className="hidden text-muted-foreground lg:block lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.signedByCompact}</span>
                    <span className="hidden break-words lg:block lg:text-[#202124]">{email.security.signedBy}</span>
                  </>
                )}
                {email.security?.transportSecurity && (
                  <>
                    <span className="hidden text-muted-foreground lg:block lg:whitespace-nowrap lg:text-right lg:text-[#5f6368] lg:after:content-[':']">{appConfig.text.security.toLowerCase()}</span>
                    <span className="hidden items-center gap-1.5 lg:flex lg:text-[#202124]">
                      <Lock className="h-4 w-4 shrink-0 text-[#5f6368]" />
                      <span>{email.security.transportSecurity || appConfig.text.standardEncryption}</span>
                      {appConfig.app.enableSecurityDetails && (
                        <button
                          onClick={() => window.innerWidth < 1024 && setSecurity(true)}
                          className="shrink-0 text-link underline"
                        >
                          {appConfig.text.learnMore}
                        </button>
                      )}
                    </span>
                  </>
                )}
              </div>
              {email.security?.transportSecurity && (
                <div className="mt-3 grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-3 lg:hidden">
                  <Lock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="min-w-0 text-sm leading-5 text-foreground">
                    <span>
                      {email.security.transportSecurity || appConfig.text.standardEncryption}
                    </span>
                  </p>
                  {appConfig.app.enableSecurityDetails && (
                    <button
                      onClick={() => window.innerWidth < 1024 && setSecurity(true)}
                      className="col-start-2 mt-1 text-left text-sm font-medium leading-5 text-link"
                    >
                      {appConfig.text.securityLink}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <article
            className="mail-body pt-5"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(email.body) }}
          />

          {appConfig.app.enableAttachments && email.attachments.length > 0 && (
            <div className="pt-3">
              <p className="mb-2 text-sm font-medium">
                {appConfig.text.attachmentCount
                  .replace("{count}", String(email.attachments.length))
                  .replace("{plural}", email.attachments.length > 1 ? "s" : "")}
              </p>
              <div className="hidden gap-3 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(13rem,13rem))]">
                {email.attachments.map((a) => (
                  <button
                    key={`desktop-${a.name}`}
                    onClick={() =>
                      toast(appConfig.text.attachmentPreviewUnavailable.replace("{name}", a.name))
                    }
                    className="w-[13rem] overflow-hidden rounded-sm border border-[#dadce0] bg-white text-left text-[#202124] shadow-sm"
                  >
                    <div className="grid h-28 place-items-center bg-[#f8f9fa]">
                      <div className="relative h-[5.5rem] w-[4rem] overflow-hidden border border-[#dadce0] bg-white p-2 shadow-sm">
                        <div className="absolute right-0 top-0 h-3 w-3 border-b border-l border-[#dadce0] bg-[#f8f9fa]" />
                        {a.type === "image" ? (
                          <ImageIcon className="mx-auto mt-4 h-7 w-7 text-[#80868b]" />
                        ) : (
                          <div className="space-y-1.5 pt-2">
                            <div className="h-1 w-7 rounded bg-[#dadce0]" />
                            <div className="h-1 w-10 rounded bg-[#e8eaed]" />
                            <div className="h-1 w-8 rounded bg-[#e8eaed]" />
                            <div className="mt-2 h-3 w-full rounded-sm bg-[#f1f3f4]" />
                            <div className="h-1 w-9 rounded bg-[#e8eaed]" />
                            <div className="h-1 w-7 rounded bg-[#e8eaed]" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex h-11 min-w-0 items-center gap-2 border-t border-[#dadce0] px-2">
                      <span className="grid h-5 min-w-7 shrink-0 place-items-center rounded-sm bg-[#d93025] px-1 text-[9px] font-bold text-white">
                        {a.name.split(".").pop()?.slice(0, 3).toUpperCase()}
                      </span>
                      <span className="truncate text-xs">{a.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                {email.attachments.map((a) => (
                  <button
                    key={a.name}
                    onClick={() =>
                      toast(appConfig.text.attachmentPreviewUnavailable.replace("{name}", a.name))
                    }
                    className="overflow-hidden rounded-xl border text-left"
                  >
                    <div className="grid h-24 place-items-center bg-muted">
                      {a.type === "image" ? (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      ) : (
                        <FileText className="h-10 w-10 text-destructive" />
                      )}
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
        </section>
      </div>

      <div className="relative z-20 grid shrink-0 grid-cols-[1fr_1fr_auto] items-center gap-2 px-4 pb-3 pt-2 lg:mx-10 lg:grid-cols-[auto_auto_1fr] lg:justify-start lg:border-t lg:border-border/70 lg:bg-card lg:px-0 lg:pb-4 lg:pt-4">
        {[
          { label: appConfig.text.reply, icon: Reply, run: reply },
          { label: appConfig.text.forward, icon: Forward, run: forward },
        ].map((b) => (
          <button
            key={b.label}
            onClick={b.run}
            className="flex h-14 min-w-0 items-center justify-center gap-2 rounded-full bg-reply-action text-base font-medium text-reply-action-foreground hover:bg-reply-action/90 lg:h-11 lg:min-w-32 lg:border lg:border-muted-foreground/60 lg:bg-transparent lg:px-6 lg:text-foreground lg:hover:bg-accent"
          >
            <b.icon className="h-5 w-5 shrink-0" />
            <span className="truncate">{b.label}</span>
          </button>
        ))}
        <button
          aria-label={appConfig.text.reactToMessage}
          aria-expanded={reactionsOpen}
          onClick={() => setReactionsOpen((v) => !v)}
          className="grid h-12 w-12 place-items-center rounded-full bg-reply-action text-reply-action-foreground hover:bg-reply-action/90 lg:h-11 lg:w-11 lg:border lg:border-muted-foreground/60 lg:bg-transparent lg:text-foreground lg:hover:bg-accent"
        >
          <Smile className="h-6 w-6" />
        </button>
        {reactionsOpen && (
          <div
            role="menu"
            aria-label={appConfig.text.reactToMessage}
            className="absolute bottom-full right-4 mb-2 flex gap-1 rounded-full bg-popover p-2 shadow-lg"
          >
            {appConfig.text.reactions.map((emoji) => (
              <button
                key={emoji}
                role="menuitem"
                aria-label={appConfig.text.reactionLabel.replace("{emoji}", emoji)}
                onClick={() => {
                  toast(appConfig.text.reacted.replace("{emoji}", emoji));
                  setReactionsOpen(false);
                }}
                className="grid h-10 w-10 place-items-center rounded-full text-xl hover:bg-accent"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {menu && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/40 lg:items-start lg:justify-end lg:bg-transparent"
          onClick={() => setMenu(false)}
        >
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-popover py-3 pb-6 animate-in slide-in-from-bottom lg:mr-8 lg:mt-16 lg:w-80 lg:rounded-2xl lg:pb-3 lg:shadow-xl"
          >
            <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-muted-foreground/40" />
            {menuItems.map((m) => (
              <button
                key={m.label}
                role="menuitem"
                onClick={m.run}
                className="flex h-12 w-full items-center gap-5 px-6 text-left hover:bg-accent"
              >
                <m.icon className="h-5 w-5 text-muted-foreground" /> {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {labelsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/40 lg:items-center lg:justify-center"
          onClick={() => setLabelsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl bg-popover p-5 pb-8 lg:max-w-md lg:rounded-3xl lg:shadow-xl"
          >
            <h2 className="mb-3 text-lg font-medium">{appConfig.text.labelsTitle}</h2>
            {appConfig.labels.map((l) => {
              const on = email.labels.includes(l.name);
              return (
                <label key={l.id} className="flex h-12 items-center gap-4">
                  <input
                    type="checkbox"
                    checked={on}
                    className="h-5 w-5 accent-primary"
                    onChange={() =>
                      update([email.id], {
                        labels: on
                          ? email.labels.filter((x) => x !== l.name)
                          : [...email.labels, l.name],
                      })
                    }
                  />
                  {l.name}
                </label>
              );
            })}
            <button
              onClick={() => {
                setLabelsOpen(false);
                toast(appConfig.text.labelsUpdated);
              }}
              className="mt-3 h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground"
            >
              {appConfig.text.done}
            </button>
          </div>
        </div>
      )}

      {security && (
        <div className="lg:hidden">
          <SecuritySheet email={email} onClose={() => setSecurity(false)} />
        </div>
      )}
    </div>
  );
}
