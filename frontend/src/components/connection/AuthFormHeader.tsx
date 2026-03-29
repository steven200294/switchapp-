const EMOJI_URL =
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Woman%20Medium-Light%20Skin%20Tone.png";

interface AuthFormHeaderProps {
  activeTab: "signin" | "signup";
}

export default function AuthFormHeader({ activeTab }: AuthFormHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h2 className="text-[28px] font-bold text-gray-900 mb-1">
        {activeTab === "signin" ? "Connexion" : "Créer un compte"}
      </h2>
      <p className="text-[14px] text-gray-400">
        {activeTab === "signin"
          ? "Bon retour, veuillez entrer vos informations"
          : "Inscrivez-vous pour commencer"}
      </p>
      <img
        src={EMOJI_URL}
        alt="Woman Medium-Light Skin Tone"
        width={120}
        height={120}
        className="mx-auto mt-2"
      />
    </div>
  );
}
