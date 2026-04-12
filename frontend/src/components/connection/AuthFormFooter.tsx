import { useTranslations } from "next-intl";

type Props = {
  activeTab: "signin" | "signup";
  setActiveTab: (t: "signin" | "signup") => void;
  setError: (e: string | null) => void;
};

export default function AuthFormFooter({ activeTab, setActiveTab, setError }: Props) {
  const t = useTranslations("auth");
  const clear = () => setError(null);

  return (
    <p className="text-body-sm text-gray-400 text-center pb-4">
      {activeTab === "signin" ? (
        <>
          {t("noAccount")}{" "}
          <button type="button" onClick={() => { setActiveTab("signup"); clear(); }} className="text-gray-900 font-semibold hover:underline">
            {t("signUp")}
          </button>
        </>
      ) : (
        <>
          {t("hasAccount")}{" "}
          <button type="button" onClick={() => { setActiveTab("signin"); clear(); }} className="text-gray-900 font-semibold hover:underline">
            {t("signIn")}
          </button>
        </>
      )}
    </p>
  );
}
