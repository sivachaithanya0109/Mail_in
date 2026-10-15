import {
  Inbox, Star, Clock, Send, File, Bookmark, ShieldAlert, Trash2, Mails, Archive,
  Tag, Mail, Video, Users, Tags, Layers,
  type LucideIcon,
} from "lucide-react";

/** Type-safe icon registry used by the config file. */
export const iconRegistry = {
  inbox: Inbox,
  star: Star,
  clock: Clock,
  send: Send,
  "file-edit": File,
  bookmark: Bookmark,
  "shield-alert": ShieldAlert,
  "trash-2": Trash2,
  archive: Archive,
  mails: Mails,
  tag: Tag,
  mail: Mail,
  video: Video,
  users: Users,
  tags: Tags,
  layers: Layers,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
