import type { CSSProperties, HTMLAttributes } from "react";

export type MaterialSymbolProps = HTMLAttributes<HTMLSpanElement> & {
  name: string;
  filled?: boolean;
};

export function MaterialSymbol({ name, filled = false, className, style, ...props }: MaterialSymbolProps) {
  const symbolStyle: CSSProperties = {
    ...style,
    fontVariationSettings: `"FILL" ${filled ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" 24`,
  };

  return (
    <span
      aria-hidden="true"
      className={`material-symbol ${className ?? ""}`}
      style={symbolStyle}
      {...props}
    >
      {name}
    </span>
  );
}
