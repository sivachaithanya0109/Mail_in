import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { appConfig } from "@/config/appConfig";
import type { Category, Email, StorageFolder, ThemeMode } from "@/types/config";

const STORE_KEY = `mail-demo-state-v${appConfig.app.dataVersion}`;
const THEME_KEY = "mail-demo-theme";

interface Stored {
  overrides: Record<string, Partial<Email>>;
  created: Email[];
  removed: string[];
}

export interface ComposeDraft {
  draftId?: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  quoted?: string;
}

interface MailCtx {
  emails: Email[];
  update: (ids: string[], patch: Partial<Email>) => void;
  move: (ids: string[], folder: StorageFolder) => void;
  removeForever: (ids: string[]) => void;
  saveEmail: (email: Email) => void;
  reset: () => void;
  reload: () => void;
  tab: Category;
  setTab: (t: Category) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  compose: ComposeDraft | null;
  openCompose: (d?: Partial<ComposeDraft>) => void;
  closeCompose: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

const Ctx = createContext<MailCtx | null>(null);
const empty: Stored = { overrides: {}, created: [], removed: [] };

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function normalize(e: Partial<Email> & { id: string }): Email {
  return {
    folder: "inbox", category: "primary", recipients: [], cc: [], bcc: [], subject: "(no subject)",
    preview: "", body: "", timestamp: new Date().toISOString(), unread: false, starred: false,
    important: false, attachments: [], labels: [], sender: { name: "Unknown", email: "" },
    ...e,
  } as Email;
}

export function MailProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Category>("primary");
  const [theme, setThemeState] = useState<ThemeMode>(appConfig.app.defaultTheme);
  const [compose, setCompose] = useState<ComposeDraft | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setStored(load());
    const t = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (t === "light" || t === "dark") setThemeState(t);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORE_KEY, JSON.stringify(stored));
  }, [stored, hydrated]);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const emails = useMemo(() => {
    const base = appConfig.emails
      .filter((e) => e && e.id && !stored.removed.includes(e.id))
      .map((e) => normalize({ ...e, ...stored.overrides[e.id] }));
    const created = stored.created
      .filter((e) => !stored.removed.includes(e.id))
      .map((e) => normalize({ ...e, ...stored.overrides[e.id] }));
    return [...created, ...base];
  }, [stored]);

  const update = useCallback((ids: string[], patch: Partial<Email>) => {
    setStored((s) => {
      const overrides = { ...s.overrides };
      ids.forEach((id) => (overrides[id] = { ...overrides[id], ...patch }));
      return { ...s, overrides };
    });
  }, []);

  const move = useCallback((ids: string[], folder: StorageFolder) => update(ids, { folder }), [update]);

  const removeForever = useCallback((ids: string[]) => {
    setStored((s) => ({ ...s, removed: [...new Set([...s.removed, ...ids])] }));
  }, []);

  const saveEmail = useCallback((email: Email) => {
    setStored((s) => {
      const overrides = { ...s.overrides };
      delete overrides[email.id];
      return { ...s, overrides, created: [email, ...s.created.filter((e) => e.id !== email.id)] };
    });
  }, []);

  const reset = useCallback(() => setStored(empty), []);
  const reload = useCallback(() => setStored(load()), []);

  const openCompose = useCallback(
    (d?: Partial<ComposeDraft>) => setCompose({ to: "", cc: "", bcc: "", subject: "", body: "", ...d }),
    [],
  );
  const closeCompose = useCallback(() => setCompose(null), []);

  return (
    <Ctx.Provider
      value={{ emails, update, move, removeForever, saveEmail, reset, reload, tab, setTab, theme, setTheme,
        compose, openCompose, closeCompose, drawerOpen, setDrawerOpen }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMail() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMail must be used inside MailProvider");
  return c;
}
