import { Lock } from "@/lib/icons";
import { useEffect } from "react";
import { toast } from "sonner";
import { appConfig } from "@/config/appConfig";
import type { Email } from "@/types/config";

export function SecuritySheet({ email, onClose }: { email: Email; onClose: () => void }) {
  const security = email.security;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-details-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[32rem] rounded-[2rem] bg-security-modal px-5 py-6 text-security-modal-foreground shadow-2xl sm:px-8"
      >
        <h2 id="security-details-title" className="mb-4 text-2xl font-normal leading-tight">
          {appConfig.text.securityTitle}
        </h2>
        {security?.mailedBy && (
          <p className="break-words text-sm font-normal leading-6">
            {appConfig.text.mailedBy}: {security.mailedBy}
          </p>
        )}
        {security?.signedBy && (
          <p className="break-words text-sm font-normal leading-6">
            {appConfig.text.signedBy}: {security.signedBy}
          </p>
        )}
        {security?.transportSecurity && (
          <p className="mt-1 text-sm font-normal leading-6">
            <span>{appConfig.text.security}: </span>
            <Lock aria-hidden="true" className="inline-block h-4 w-4 align-[-2px]" />{" "}
            <span>{security.transportSecurity || appConfig.text.standardEncryption}</span>{" "}
            <button
              type="button"
              onClick={() => toast(security?.learnMoreInfo ?? appConfig.text.learnMoreInfo)}
              className="inline whitespace-nowrap text-link underline underline-offset-2"
            >
              {appConfig.text.learnMore}
            </button>
          </p>
        )}
      </section>
    </div>
  );
}
