import { createElement, type ComponentType } from "react";
import { MaterialSymbol, type MaterialSymbolProps } from "@/components/mail/MaterialSymbol";

type IconProps = Omit<MaterialSymbolProps, "name">;
type IconComponent = ComponentType<IconProps>;

const symbol = (name: string): IconComponent => {
  return (props: IconProps) => createElement(MaterialSymbol, { name, ...props });
};

/** Gmail-like UI glyphs from Google's Material Symbols Rounded font. */
export const iconRegistry = {
  inbox: symbol("inbox"),
  star: symbol("star"),
  clock: symbol("schedule"),
  send: symbol("send"),
  "file-edit": symbol("draft"),
  bookmark: symbol("bookmark"),
  "shield-alert": symbol("report"),
  "trash-2": symbol("delete"),
  archive: symbol("archive"),
  mails: symbol("all_inbox"),
  tag: symbol("label"),
  mail: symbol("mail"),
  video: symbol("videocam"),
  chat: symbol("chat_bubble"),
  users: symbol("group"),
  tags: symbol("sell"),
  layers: symbol("layers"),
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof iconRegistry;

// Shared symbols used by the rest of the mail interface.
export const Archive = symbol("archive");
export const ArrowLeft = symbol("arrow_back");
export const ArrowRight = symbol("arrow_forward");
export const BadgeCheck = symbol("verified");
export const Bookmark = symbol("bookmark");
export const Check = symbol("check");
export const ChevronDown = symbol("expand_more");
export const ChevronDownIcon = ChevronDown;
export const ChevronLeft = symbol("chevron_left");
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRight = symbol("chevron_right");
export const ChevronRightIcon = ChevronRight;
export const ChevronUp = symbol("expand_less");
export const Clock = symbol("schedule");
export const Download = symbol("download");
export const File = symbol("description");
export const FileText = symbol("description");
export const Forward = symbol("forward");
export const Image = symbol("image");
export const Inbox = symbol("inbox");
export const Lock = symbol("lock");
export const Mail = symbol("mail");
export const MailOpen = symbol("mark_email_read");
export const MailUnread = symbol("mark_email_unread");
export const Menu = symbol("menu");
export const MessageSquare = symbol("chat_bubble");
export const Circle = symbol("radio_button_unchecked");
export const GripVertical = symbol("drag_indicator");
export const PanelLeft = symbol("menu_open");
export const Moon = symbol("dark_mode");
export const MoreHorizontal = symbol("more_horiz");
export const MoreVertical = symbol("more_vert");
export const Minus = symbol("remove");
export const Paperclip = symbol("attach_file");
export const Pencil = symbol("edit");
export const Reply = symbol("reply");
export const ReplyAll = symbol("reply_all");
export const Search = symbol("search");
export const SearchX = symbol("search_off");
export const Send = symbol("send");
export const ShieldAlert = symbol("report");
export const Smile = symbol("mood");
export const Star = ({ filled = false, className, style }: IconProps & { filled?: boolean }) =>
  createElement(
    "svg",
    {
      "aria-hidden": true,
      className: `block ${className ?? ""}`,
      style: { ...style, transform: "none", transition: "none" },
      viewBox: "0 0 24 24",
      fill: filled ? "currentColor" : "none",
      focusable: false,
    },
    createElement("path", {
      d: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      stroke: filled ? "none" : "currentColor",
      strokeLinejoin: "round",
      strokeWidth: filled ? 0 : 1.7,
    }),
  );
export const Sun = symbol("light_mode");
export const Tag = symbol("label");
export const Trash2 = symbol("delete");
export const Undo2 = symbol("undo");
export const Users = symbol("group");
export const Video = symbol("videocam");
export const X = symbol("close");
export const RotateCcw = symbol("restart_alt");
