import type { Category, Email, FolderId } from "@/types/config";

/** Strips scripts, event handlers and javascript: URLs from configurable HTML. */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|form)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatListTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (d.getFullYear() === now.getFullYear())
    return d.toLocaleDateString([], { day: "numeric", month: "short" });
  return d.toLocaleDateString([], { day: "numeric", month: "numeric", year: "2-digit" });
}

export function formatFullTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase().slice(0, 1);
}

const avatarClasses = ["bg-avatar-1", "bg-avatar-2", "bg-avatar-3", "bg-avatar-4", "bg-avatar-5", "bg-avatar-6"];
export function avatarClass(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return avatarClasses[h % avatarClasses.length];
}

export function filterByFolder(emails: Email[], folder: string, tab: Category): Email[] {
  const notBin = (e: Email) => e.folder !== "trash" && e.folder !== "spam";
  let list: Email[];
  if (folder.startsWith("label-")) {
    const name = folder.slice(6);
    list = emails.filter((e) => notBin(e) && e.labels.some((l) => l.toLowerCase() === name.toLowerCase()));
  } else {
    switch (folder as FolderId) {
      case "inbox": list = emails.filter((e) => e.folder === "inbox" && e.category === tab); break;
      case "all-inboxes": list = emails.filter((e) => e.folder === "inbox"); break;
      case "starred": list = emails.filter((e) => e.starred && notBin(e)); break;
      case "important": list = emails.filter((e) => e.important && notBin(e)); break;
      case "all-mail": list = emails.filter((e) => notBin(e) && e.folder !== "drafts"); break;
      default: list = emails.filter((e) => e.folder === folder);
    }
  }
  return [...list].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export function searchEmails(emails: Email[], q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return emails
    .filter((e) =>
      [e.sender.name, e.sender.email, ...e.recipients.flatMap((r) => [r.name, r.email]), e.subject, stripHtml(e.body)]
        .join(" ")
        .toLowerCase()
        .includes(s),
    )
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export function parseAddresses(s: string) {
  return s
    .split(/[,;]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const m = x.match(/^(.*)<(.+)>$/);
      return m ? { name: m[1].trim() || m[2], email: m[2].trim() } : { name: x.split("@")[0], email: x };
    });
}

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
