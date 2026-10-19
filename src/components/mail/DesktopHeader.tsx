import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { appConfig } from "@/config/appConfig";
import { Avatar } from "./Avatar";
import { Logo } from "./Logo";
import { ProfileMenu } from "./ProfileMenu";

export function DesktopHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="hidden h-[4.5rem] shrink-0 items-center gap-6 bg-background px-6 lg:flex">
        <Link to="/" className="flex w-[15rem] shrink-0 items-center pl-1">
          <Logo />
        </Link>
        <Link
          to="/search"
          aria-label={appConfig.text.searchPlaceholder}
          className="flex h-[3.5rem] w-full max-w-[52rem] items-center gap-4 rounded-full bg-search px-5 text-muted-foreground transition-colors hover:bg-accent"
        >
          <Search aria-hidden="true" className="h-6 w-6 shrink-0" />
          <span className="truncate text-base">{appConfig.text.searchPlaceholder}</span>
        </Link>
        <div className="flex-1" />
        <button
          aria-label={appConfig.text.account}
          onClick={() => setProfileOpen(true)}
          className="rounded-full p-1 transition-colors hover:bg-accent"
        >
          <Avatar
            name={appConfig.profile.displayName}
            src={appConfig.profile.avatarUrl || undefined}
            label={appConfig.profile.initials}
            size={38}
          />
        </button>
      </header>
      <ProfileMenu open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
