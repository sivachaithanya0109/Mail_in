import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { iconRegistry } from "@/lib/icons";
import { filterByFolder } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Drawer() {
  const { drawerOpen, setDrawerOpen, emails, tab } = useMail();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = path === "/" ? "inbox" : path.startsWith("/folder/") ? decodeURIComponent(path.slice(8)) : "";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  const unread = (id: string) =>
    filterByFolder(emails, id, id === "inbox" ? "primary" : tab).filter((e) => e.unread).length;

  const item = (id: string, name: string, Icon: React.ComponentType<{ className?: string }>) => {
    const count = unread(id);
    const active = current === id;
    const inner = (
      <>
        <Icon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{name}</span>
        {count > 0 && id !== "sent" && id !== "trash" && <span className="text-xs">{count}</span>}
      </>
    );
    const cls = cn(
      "flex h-12 items-center gap-5 rounded-full px-5 text-sm font-medium",
      active ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-accent",
    );
    return id === "inbox" ? (
      <Link key={id} to="/" className={cls} onClick={() => setDrawerOpen(false)}>{inner}</Link>
    ) : (
      <Link key={id} to="/folder/$folderId" params={{ folderId: id }} className={cls} onClick={() => setDrawerOpen(false)}>
        {inner}
      </Link>
    );
  };

  return (
    <>
      <div
        aria-hidden
        onClick={() => setDrawerOpen(false)}
        className={cn("fixed inset-0 z-40 bg-foreground/40 transition-opacity lg:hidden", drawerOpen ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <nav
        aria-label="Folders"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-80 flex-col overflow-y-auto rounded-r-2xl bg-popover pb-6 transition-transform duration-200",
          "lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center px-5"><Logo /></div>
        <div className="mx-2 border-t pt-2">{appConfig.folders.slice(0, 2).map((f) => item(f.id, f.name, iconRegistry[f.icon]))}</div>
        {appConfig.app.showSocialTab || appConfig.app.showPromotionsTab ? <div className="mx-4 my-2 border-t" /> : null}
        <div className="px-2">
          <p className="px-5 py-2 text-xs font-medium text-muted-foreground">All labels</p>
          {appConfig.folders.slice(2).map((f) => item(f.id, f.name, iconRegistry[f.icon]))}
        </div>
        {appConfig.app.enableLabels && appConfig.labels.length > 0 && (
          <div className="mt-2 border-t px-2 pt-2">
            <p className="px-5 py-2 text-xs font-medium text-muted-foreground">Labels</p>
            {appConfig.labels.map((l) => item(`label-${l.name}`, l.name, iconRegistry.tag))}
          </div>
        )}
      </nav>
    </>
  );
}
