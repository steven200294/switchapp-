"use client";

import { useTranslations } from "next-intl";
import { Mail, Check, Loader2 } from "@/shared/ui/icons";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useSendEmailVerificationMutation } from "@/shared/auth/hooks/useAuthMutations";

export default function EmailVerificationBadge() {
  const t = useTranslations("emailVerification");
  const user = useAuthStore((s) => s.user);
  const mutation = useSendEmailVerificationMutation();

  if (!user || user.email_confirmed_at) return null;

  const handleResend = () => {
    if (mutation.isPending || mutation.isSuccess) return;
    mutation.mutate(user.email);
  };

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={mutation.isPending || mutation.isSuccess}
      className="w-full max-w-2xl mx-auto md:max-w-none bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-4 flex items-center gap-3 hover:border-amber-300 transition-all text-left disabled:opacity-70"
    >
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
        {mutation.isSuccess ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : mutation.isPending ? (
          <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
        ) : (
          <Mail className="w-5 h-5 text-amber-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-body text-amber-900">
          {mutation.isSuccess ? t("sent") : t("banner")}
        </p>
        {!mutation.isSuccess && (
          <p className="text-body-sm text-amber-700">{t("resend")}</p>
        )}
        {mutation.isError && (
          <p className="text-body-xs text-red-500 mt-1">{mutation.error.message}</p>
        )}
      </div>
    </button>
  );
}
