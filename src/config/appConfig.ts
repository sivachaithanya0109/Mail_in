/**
 * ============================================================
 *  MAIL APP CONFIG — edit everything the app shows from here.
 * ============================================================
 *
 * - app:        name, default theme, feature switches
 * - profile:    the signed-in account shown in the avatar menu
 * - text:       labels and messages used across the UI
 * - folders:    drawer items (icon names come from src/lib/icons.ts)
 * - labels:     custom labels (emails reference them by `name`)
 * - bottomNav:  bottom bar buttons, each opens a folder
 * - emails:     every message. `body` accepts simple HTML (sanitized).
 *               folder: inbox | snoozed | sent | drafts | spam | trash | archive
 *               category: primary | promotions | social
 * - appearance: list density, avatars, timestamps, font
 *
 * Your taps (star, archive, delete, sent, drafts…) are saved in the browser.
 * After editing emails here, increase `app.dataVersion` to reset saved changes.
 *
 * ---- Template for a new email (copy into `emails`) ----
 * {
 *   id: "email-100", folder: "inbox", category: "primary",
 *   sender: { name: "Name", email: "name@example.com" },
 *   recipients: [{ name: "Alex Morgan", email: "alex@example.com" }],
 *   cc: [], bcc: [],
 *   subject: "Subject", preview: "Short preview line",
 *   body: "<p>Hello</p>",
 *   timestamp: "2026-10-15T09:00:00+05:30",
 *   unread: true, starred: false, important: false,
 *   attachments: [], labels: [],
 * },
 */
import type { AppConfig } from "@/types/config";

const me = { name: "Alex Morgan", email: "alex@example.com" };

export const appConfig: AppConfig = {
  app: {
    name: "Mail",
    tagline: "Your messages, organized",
    defaultTheme: "dark",
    showPromotionsTab: true,
    showSocialTab: true,
    enableSecurityDetails: true,
    enableAttachments: true,
    enableLabels: true,
    dataVersion: 2,
  },

  profile: { displayName: me.name, email: me.email, avatarUrl: "", initials: "AM" },

  text: {
    searchPlaceholder: "Search in mail",
    composeLabel: "Compose",
    emptyFolder: "Nothing in this folder",
    emptySearch: "No results found",
    securityLink: "View security details",
    demoDisclaimer: "Demo data — not independently verified",
    tabs: { primary: "Primary", promotions: "Promotions", social: "Social" },
    inboxChip: "Inbox",
    toMe: "to me",
    unsubscribe: "Unsubscribe",
    reply: "Reply",
    forward: "Forward",
    securityTitle: "Security details",
    mailedBy: "Mailed by",
    signedBy: "Signed by",
    security: "Security",
    learnMore: "Learn more",
    learnMoreInfo: "This message was sent with standard TLS encryption.",
    chatEmpty: "No conversations yet",
    meetEmpty: "No meetings scheduled",
  },

  folders: [
    { id: "all-inboxes", name: "All inboxes", icon: "mails" },
    { id: "inbox", name: "Primary", icon: "inbox" },
    { id: "starred", name: "Starred", icon: "star" },
    { id: "snoozed", name: "Snoozed", icon: "clock" },
    { id: "important", name: "Important", icon: "bookmark" },
    { id: "sent", name: "Sent", icon: "send" },
    { id: "drafts", name: "Drafts", icon: "file-edit" },
    { id: "all-mail", name: "All mail", icon: "archive" },
    { id: "spam", name: "Spam", icon: "shield-alert" },
    { id: "trash", name: "Bin", icon: "trash-2" },
  ],

  labels: [
    { id: "notifications", name: "Notifications" },
    { id: "work", name: "Work" },
    { id: "personal", name: "Personal" },
  ],

  bottomNav: [
    { label: "Mail", icon: "mail", path: "/" },
    { label: "Chat", icon: "chat", path: "/chat" },
    { label: "Meet", icon: "video", path: "/meet" },
  ],

  emails: [
    {
      id: "email-001",
      folder: "inbox",
      category: "primary",
      sender: { name: "Account Security", email: "no-reply@accounts.example.com" },
      recipients: [me],
      cc: [],
      bcc: [],
      subject: "Security alert: new sign-in on Android",
      preview: "We noticed a new sign-in to your account on an Android device. If this was you…",
      body: `<div style="text-align:center"><h2>A new sign-in on Android</h2><p>${me.email}</p></div>
<p>We noticed a new sign-in to your account on an Android device. If this was you, you don't need to do anything. If not, we'll help you secure your account.</p>
<p><a href="#">Check activity</a></p>
<p style="color:#5f6368;font-size:12px">You received this email to let you know about important changes to your account and services.</p>`,
      timestamp: "2026-10-15T18:42:00+05:30",
      unread: true,
      starred: false,
      important: true,
      attachments: [],
      labels: ["Notifications"],
      verified: true,
      unsubscribe: true,
      security: {
        from: "Account Security <no-reply@accounts.example.com>",
        to: me.email,
        replyTo: "no-reply@accounts.example.com",
        date: "15 Oct 2026, 18:42",
        subject: "Security alert: new sign-in on Android",
        mailedBy: "accounts.example.com",
        signedBy: "accounts.example.com",
        messageId: "<demo-001@accounts.example.com>",
        authentication: { spf: "PASS (demo)", dkim: "PASS (demo)", dmarc: "PASS (demo)" },
        transportSecurity: "Standard encryption (TLS).",
        isDemo: true,
      },
    },
    {
      id: "email-002",
      folder: "inbox",
      category: "primary",
      sender: { name: "Priya Sharma", email: "priya@studio.example" },
      recipients: [me],
      cc: [{ name: "Rahul Verma", email: "rahul@studio.example" }],
      bcc: [],
      subject: "Design review moved to Friday",
      preview: "Hi Alex, quick heads-up — we've moved the design review to Friday at 3pm.",
      body: `<p>Hi Alex,</p><p>Quick heads-up — we've moved the design review to <b>Friday at 3pm</b>. I've attached the latest deck so you can take a look before then.</p><p>Thanks,<br/>Priya</p>`,
      timestamp: "2026-10-15T15:10:00+05:30",
      unread: true,
      starred: true,
      important: false,
      attachments: [{ name: "Review-deck-v4.pdf", size: "2.4 MB", type: "pdf" }],
      labels: ["Work"],
      security: {
        from: "Priya Sharma <priya@studio.example>",
        to: me.email,
        cc: "rahul@studio.example",
        messageId: "<demo-002@studio.example>",
        mailedBy: "studio.example",
        signedBy: "studio.example",
        authentication: { spf: "PASS (demo)", dkim: "PASS (demo)", dmarc: "PASS (demo)" },
        transportSecurity: "Standard encryption (TLS).",
        isDemo: true,
      },
    },
    {
      id: "email-003",
      folder: "inbox",
      category: "primary",
      sender: { name: "Mom", email: "mom@family.example" },
      recipients: [me],
      cc: [],
      bcc: [],
      subject: "Photos from the weekend",
      preview: "Here are the photos from Sunday! The kids loved it.",
      body: `<p>Here are the photos from Sunday! The kids loved it. Call me when you're free ❤️</p>`,
      timestamp: "2026-10-14T20:05:00+05:30",
      unread: false,
      starred: false,
      important: false,
      attachments: [
        { name: "IMG_2041.jpg", size: "3.1 MB", type: "image" },
        { name: "IMG_2042.jpg", size: "2.8 MB", type: "image" },
      ],
      labels: ["Personal"],
    },
    {
      id: "email-004",
      folder: "inbox",
      category: "primary",
      sender: { name: "City Bank", email: "statements@citybank.example" },
      recipients: [me],
      cc: [],
      bcc: [],
      subject: "Your October statement is ready",
      preview: "Your monthly statement for account ending 4821 is now available.",
      body: `<p>Dear customer,</p><p>Your monthly statement for account ending <b>4821</b> is now available to view.</p>`,
      timestamp: "2026-10-12T09:00:00+05:30",
      unread: false,
      starred: false,
      important: false,
      attachments: [{ name: "Statement-Oct.pdf", size: "180 KB", type: "pdf" }],
      labels: [],
    },
    {
      id: "email-005",
      folder: "inbox",
      category: "promotions",
      sender: { name: "ShopNow", email: "deals@shopnow.example" },
      recipients: [me],
      cc: [],
      bcc: [],
      subject: "Festive sale: up to 60% off 🎉",
      preview: "Our biggest sale of the year starts today. Don't miss out.",
      body: `<h2>Festive sale</h2><p>Up to <b>60% off</b> across electronics, fashion and home.</p>`,
      timestamp: "2026-10-15T08:00:00+05:30",
      unread: true,
      starred: false,
      important: false,
      attachments: [],
      labels: [],
    },
    {
      id: "email-006",
      folder: "inbox",
      category: "social",
      sender: { name: "LinkUp", email: "notify@linkup.example" },
      recipients: [me],
      cc: [],
      bcc: [],
      subject: "You appeared in 12 searches this week",
      preview: "See who's looking at your profile.",
      body: `<p>You appeared in <b>12 searches</b> this week.</p>`,
      timestamp: "2026-10-13T11:30:00+05:30",
      unread: true,
      starred: false,
      important: false,
      attachments: [],
      labels: [],
    },
    {
      id: "email-007",
      folder: "sent",
      category: "primary",
      sender: me,
      recipients: [{ name: "Priya Sharma", email: "priya@studio.example" }],
      cc: [],
      bcc: [],
      subject: "Re: Wireframes",
      preview: "Looks great, ship it!",
      body: `<p>Looks great, ship it!</p>`,
      timestamp: "2026-10-11T17:20:00+05:30",
      unread: false,
      starred: false,
      important: false,
      attachments: [],
      labels: ["Work"],
    },
  ],

  appearance: {
    fontFamily: "Roboto, Arial, sans-serif",
    compactEmailList: false,
    showSenderAvatars: true,
    showTimestamps: true,
  },
};
