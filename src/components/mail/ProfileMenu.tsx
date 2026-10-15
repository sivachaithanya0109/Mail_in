import { Moon, RotateCcw, Sun, X } from "lucide-react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

export function ProfileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme, reset } = useMail();
  const p = appConfig.profile;
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 p-3 pt-14" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div role="dialog" aria-label="Account" className="mx-auto max-w-md rounded-3xl bg-popover p-3" onClick={(e) => e.stopPropagation()}>
        <div className="relative flex items-center justify-center py-2">
          <button aria-label="Close" autoFocus onClick={onClose} className="absolute left-0 grid h-10 w-10 place-items-center rounded-full hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
          <span className="text-lg">{appConfig.app.name}</span>
        </div>
        <div className="rounded-2xl bg-background p-4">
          <div className="flex items-center gap-3">
            <Avatar name={p.displayName} src={p.avatarUrl || undefined} label={p.initials} size={40} />
            <div className="min-w-0">
              <p className="truncate font-medium">{p.displayName}</p>
              <p className="truncate text-sm text-muted-foreground">{p.email}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">Theme</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium capitalize",
                  theme === t ? "border-primary bg-secondary text-secondary-foreground" : "hover:bg-accent",
                )}
              >
                {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (confirm("Reset all local changes (sent, drafts, archive, bin)?")) {
                reset();
                toast("Demo data reset");
                onClose();
              }
            }}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-primary hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </button>
        </div>
        <p className="py-3 text-center text-xs text-muted-foreground">{appConfig.app.tagline}</p>
      </div>
    </div>
  );
}
