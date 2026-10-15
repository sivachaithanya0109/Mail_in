import { Lock } from "lucide-react";
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-6" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-details-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[32rem] rounded-[2rem] bg-security-modal px-6 py-7 text-security-modal-foreground shadow-2xl sm:px-8"
      >
        <h2 id="security-details-title" className="mb-5 text-[1.65rem] font-normal leading-tight">
          {appConfig.text.securityTitle}
        </h2>
        {security?.mailedBy && (
          <p className="break-words text-lg leading-7">
            {appConfig.text.mailedBy}: {security.mailedBy}
          </p>
        )}
        {security?.signedBy && (
          <p className="break-words text-lg leading-7">
            {appConfig.text.signedBy}: {security.signedBy}
          </p>
        )}
        {security?.transportSecurity && (
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-lg leading-7">
            <span>{appConfig.text.security}:</span>
            <Lock aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span>{security.transportSecurity || appConfig.text.standardEncryption}</span>
            <button
              type="button"
              onClick={() => toast(security?.learnMoreInfo ?? appConfig.text.learnMoreInfo)}
              className="text-link underline underline-offset-2"
            >
              {appConfig.text.learnMore}
            </button>
          </p>
        )}
      </section>
    </div>
  );
}
