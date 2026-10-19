export type GmailIconName = "menu";

export function GmailIcon({ name, className }: { name: GmailIconName; className?: string }) {
  const asset = `url("/icons/material/outlined/${name}.svg")`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] ${className ?? ""}`}
      style={{ maskImage: asset, WebkitMaskImage: asset }}
    />
  );
}
