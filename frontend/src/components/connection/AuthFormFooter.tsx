type Props = {
  activeTab: "signin" | "signup";
  setActiveTab: (t: "signin" | "signup") => void;
  setError: (e: string | null) => void;
};

export default function AuthFormFooter({ activeTab, setActiveTab, setError }: Props) {
  const clear = () => setError(null);

  return (
    <p className="text-[13px] text-gray-400 text-center pb-4">
      {activeTab === "signin" ? (
        <>
          Pas encore de compte ?{" "}
          <button type="button" onClick={() => { setActiveTab("signup"); clear(); }} className="text-gray-900 font-semibold hover:underline">
            S&apos;inscrire
          </button>
        </>
      ) : (
        <>
          Déjà un compte ?{" "}
          <button type="button" onClick={() => { setActiveTab("signin"); clear(); }} className="text-gray-900 font-semibold hover:underline">
            Se connecter
          </button>
        </>
      )}
    </p>
  );
}
