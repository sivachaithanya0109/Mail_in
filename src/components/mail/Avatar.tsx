import { Check } from "@/lib/icons";
import { avatarClass, initials } from "@/lib/mail-helpers";
import { cn } from "@/lib/utils";

export function Avatar({
  name, src, size = 40, selected, label,
}: { name: string; src?: string | undefined; size?: number; selected?: boolean; label?: string | undefined }) {
  const style = { width: size, height: size };
  if (selected)
    return (
      <span style={style} className="grid shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-5 w-5" />
      </span>
    );
  if (src) return <img src={src} alt={name} style={style} className="shrink-0 rounded-full object-cover" />;
  return (
    <span
      style={{ ...style, fontSize: size * 0.45 }}
      className={cn("grid shrink-0 place-items-center rounded-full font-medium text-avatar-foreground", avatarClass(name))}
    >
      {label ?? initials(name)}
    </span>
  );
}
