import { Mail } from "lucide-react";
import { appConfig } from "@/config/appConfig";

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-xl text-muted-foreground">
      <Mail className="h-6 w-6 text-destructive" strokeWidth={2.4} />
      <span className="font-normal">{appConfig.app.name}</span>
    </span>
  );
}
