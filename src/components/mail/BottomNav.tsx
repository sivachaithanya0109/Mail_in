import { Link, useRouterState } from "@tanstack/react-router";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { iconRegistry } from "@/lib/icons";
import { filterByFolder } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { emails } = useMail();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/search") return null;
  const unread = filterByFolder(emails, "inbox", "primary").filter((e) => e.unread).length;
  const badge = unread > 99 ? "99+" : String(unread);
  const activePath = path.startsWith("/chat") ? "/chat" : path.startsWith("/meet") ? "/meet" : "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-[calc(4rem+env(safe-area-inset-bottom))] max-w-2xl bg-nav pb-[env(safe-area-inset-bottom)]">
      {appConfig.bottomNav.map((b) => {
        const Icon = iconRegistry[b.icon];
        const active = activePath === b.path;
        return (
          <Link key={b.path} to={b.path} aria-label={b.label} className="flex flex-1 items-center justify-center">
            <span className={cn("relative flex h-8 w-14 items-center justify-center rounded-full", active ? "bg-pill text-pill-foreground" : "text-muted-foreground")}>
              <Icon className="h-6 w-6" />
              {b.path === "/" && unread > 0 && (
                <span className="absolute -top-2 right-0 rounded-full bg-badge px-1.5 text-[10px] font-medium text-badge-foreground">{badge}</span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
