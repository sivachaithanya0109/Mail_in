import { Link, useRouterState } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { appConfig } from "@/config/appConfig";
import { useMail } from "@/context/MailContext";
import { filterByFolder } from "@/lib/mail-helpers";
import { iconRegistry } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function DesktopSidebar() {
  const { emails, tab, openCompose } = useMail();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const current = path === "/" ? "inbox" : path.startsWith("/folder/") ? decodeURIComponent(path.slice(8)) : "";

  const unreadCount = (id: string) =>
    filterByFolder(emails, id, id === "inbox" ? "primary" : tab).filter((email) => email.unread).length;

  const folderLink = (id: string, name: string, iconName: keyof typeof iconRegistry) => {
    const Icon = iconRegistry[iconName];
    const active = current === id;
    const count = unreadCount(id);
    const content = (
      <>
        <Icon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{name}</span>
        {count > 0 && <span className="text-xs tabular-nums">{count}</span>}
      </>
    );
    const className = cn(
      "mx-2 flex h-10 items-center gap-4 rounded-r-full px-4 text-sm transition-colors",
      active ? "bg-secondary font-medium text-secondary-foreground" : "text-foreground hover:bg-accent",
    );

    return id === "inbox" ? (
      <Link key={id} to="/" className={className}>{content}</Link>
    ) : (
      <Link key={id} to="/folder/$folderId" params={{ folderId: id }} className={className}>{content}</Link>
    );
  };

  return (
    <aside className="hidden w-[16.5rem] shrink-0 flex-col border-r border-border/60 bg-background pb-5 lg:flex">
      <div className="px-3 pb-5 pt-3">
        <button
          onClick={() => openCompose()}
          className="flex h-14 items-center gap-4 rounded-2xl bg-fab px-5 font-medium text-fab-foreground shadow-sm transition-shadow hover:shadow-md"
        >
          <Pencil aria-hidden="true" className="h-5 w-5" />
          {appConfig.text.composeLabel}
        </button>
      </div>
      <nav aria-label={appConfig.text.foldersLabel} className="min-h-0 flex-1 overflow-y-auto pr-2">
        {appConfig.folders.map((folder) =>
          folderLink(
            folder.id,
            folder.id === "inbox" ? appConfig.text.inboxChip : folder.name,
            folder.icon,
          ),
        )}
        {appConfig.app.enableLabels && appConfig.labels.length > 0 && (
          <div className="mt-5 border-t border-border/60 px-2 pt-3">
            <h2 className="px-4 pb-2 text-sm font-medium">{appConfig.text.labelsTitle}</h2>
            {appConfig.labels.map((label) =>
              folderLink(`label-${label.name}`, label.name, "tag"),
            )}
          </div>
        )}
        <div className="mt-5 border-t border-border/60 px-2 pt-3">
          {appConfig.bottomNav.slice(1).map((item) => {
            const Icon = iconRegistry[item.icon];
            const active = path.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "mx-2 flex h-10 items-center gap-4 rounded-r-full px-4 text-sm transition-colors",
                  active ? "bg-secondary font-medium text-secondary-foreground" : "text-foreground hover:bg-accent",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
