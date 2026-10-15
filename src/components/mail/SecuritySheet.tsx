import { ChevronDown, ChevronUp, Copy, Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import { formatFullTime } from "@/lib/mail-helpers";
import type { Email } from "@/types/config";

export function SecuritySheet({ email, onClose }: { email: Email; onClose: () => void }) {
  const [showAuth, setShowAuth] = useState(false);
  const s = email.security;
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  const rows: [string, string | undefined][] = [
    ["from", s?.from ?? `${email.sender.name} <${email.sender.email}>`],
    ["to", s?.to ?? email.recipients.map((r) => r.email).join(", ")],
    ["cc", s?.cc ?? (email.cc.map((r) => r.email).join(", ") || undefined)],
    ["reply-to", s?.replyTo],
    ["date", s?.date ?? formatFullTime(email.timestamp)],
    ["subject", s?.subject ?? email.subject],
    ["mailed-by", s?.mailedBy],
    ["signed-by", s?.signedBy],
    ["message-id", s?.messageId],
  ];

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v).then(() => toast("Copied to clipboard"), () => toast("Couldn't copy"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/40" onClick={onClose}>
      <div role="dialog" aria-label="Security details" onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-popover p-5 pb-8 animate-in slide-in-from-bottom">
        <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-muted-foreground/40" />
        <h2 className="mb-1 text-lg font-medium">Message details</h2>
        {(!s || s.isDemo) && (
          <p className="mb-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 shrink-0" /> {appConfig.text.demoDisclaimer}
          </p>
        )}
        <dl className="space-y-1">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-2 py-1 text-sm">
              <dt className="text-right text-muted-foreground">{k}:</dt>
              <dd className="break-words">{v}</dd>
              <button aria-label={`Copy ${k}`} onClick={() => copy(v!)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
          {s && (
            <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-2 py-1 text-sm">
              <dt className="text-right text-muted-foreground">security:</dt>
              <dd className="flex items-center gap-1.5"><Lock className="h-4 w-4 shrink-0" />{s.transportSecurity}</dd>
            </div>
          )}
        </dl>
        {s && (
          <div className="mt-3 rounded-xl border">
            <button onClick={() => setShowAuth((v) => !v)} aria-expanded={showAuth}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium">
              Authentication results {showAuth ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showAuth && (
              <div className="space-y-2 border-t px-4 py-3 text-sm">
                {(["spf", "dkim", "dmarc"] as const).map((k) => (
                  <div key={k} className="flex justify-between gap-3">
                    <span className="uppercase text-muted-foreground">{k}</span>
                    <span className="flex items-center gap-1">{s.authentication[k]}
                      <button aria-label={`Copy ${k}`} onClick={() => copy(s.authentication[k])} className="grid h-7 w-7 place-items-center rounded-full hover:bg-accent"><Copy className="h-3.5 w-3.5" /></button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={onClose} autoFocus className="mt-5 h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground">Close</button>
      </div>
    </div>
  );
}
