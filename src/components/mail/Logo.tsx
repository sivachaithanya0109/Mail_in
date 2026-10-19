import { appConfig } from "@/config/appConfig";
import { Mail } from "@/lib/icons";

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-xl text-muted-foreground">
      <Mail className="h-6 w-6 text-destructive" />
      <span className="font-normal">{appConfig.app.name}</span>
    </span>
  );
}
