import type { IconName } from "@/lib/icons";

export type ThemeMode = "light" | "dark";
export type Category = "primary" | "promotions" | "social";
export type FolderId =
  | "inbox"
  | "starred"
  | "snoozed"
  | "sent"
  | "drafts"
  | "important"
  | "spam"
  | "trash"
  | "all-mail"
  | "all-inboxes";

export interface Person {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: "pdf" | "image" | "doc" | "sheet" | "zip" | "other";
}

export interface SecurityDetails {
  from: string;
  to: string;
  cc?: string;
  replyTo?: string;
  date?: string;
  subject?: string;
  mailedBy?: string;
  signedBy?: string;
  messageId: string;
  authentication: { spf: string; dkim: string; dmarc: string };
  transportSecurity: string;
  isDemo: boolean;
}

/** Physical location of an email. "starred"/"important" are flags, not storage folders. */
export type StorageFolder = "inbox" | "snoozed" | "sent" | "drafts" | "spam" | "trash" | "archive";

export interface Email {
  id: string;
  folder: StorageFolder;
  category: Category;
  sender: Person;
  recipients: Person[];
  cc: Person[];
  bcc: Person[];
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  important: boolean;
  attachments: Attachment[];
  labels: string[];
  security?: SecurityDetails;
  /** Shows a verified badge next to the sender. Only set for senders you trust. */
  verified?: boolean;
  /** Shows the Unsubscribe action in the sender row. */
  unsubscribe?: boolean;
}

export interface FolderConfig {
  id: FolderId;
  name: string;
  icon: IconName;
}

export interface LabelConfig {
  id: string;
  name: string;
}

export interface BottomNavItem {
  label: string;
  icon: IconName;
  path: "/" | "/chat" | "/meet";
}

export interface AppConfig {
  app: {
    name: string;
    tagline: string;
    defaultTheme: ThemeMode;
    showPromotionsTab: boolean;
    showSocialTab: boolean;
    enableSecurityDetails: boolean;
    enableAttachments: boolean;
    enableLabels: boolean;
    /** Bump to wipe saved local changes after editing emails. */
    dataVersion: number;
  };
  profile: { displayName: string; email: string; avatarUrl: string; initials: string };
  text: {
    searchPlaceholder: string;
    composeLabel: string;
    emptyFolder: string;
    emptySearch: string;
    securityLink: string;
    demoDisclaimer: string;
    tabs: { primary: string; promotions: string; social: string };
    inboxChip: string;
    toMe: string;
    unsubscribe: string;
    reply: string;
    forward: string;
    securityTitle: string;
    mailedBy: string;
    signedBy: string;
    security: string;
    learnMore: string;
    learnMoreInfo: string;
    chatEmpty: string;
    meetEmpty: string;
  };
  folders: FolderConfig[];
  labels: LabelConfig[];
  bottomNav: BottomNavItem[];
  emails: Email[];
  appearance: {
    fontFamily: string;
    compactEmailList: boolean;
    showSenderAvatars: boolean;
    showTimestamps: boolean;
  };
}
