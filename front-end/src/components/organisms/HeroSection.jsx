import IconSafePaiement from "@/assets/images/IconSafePaiement.svg";
import IconEmail from "@/assets/images/IconEmail.svg";
import IconIntuitive from "@/assets/images/IconIntuitive.svg";
import CoverAtom from "../atoms/CoverAtoms";
import Cover from "../molecules/Cover";

const HeroSection = () => {
  return (
    // Ajout Tailwind sur les 2 div qui suivent pour responsive
    <div className="container mx-auto px-4">
      <Cover />
      <div className="w-full flex flex-col md:flex-row justify-evenly items-center md:-mt-8 mt-4 space-y-4 md:space-y-0">
        <CoverAtom
          Icon={() => (
            <img
              className="size-40"
              src={IconSafePaiement}
              alt="Icon Safe Paiement"
            />
          )}
          title="Paiement sécurisé"
          description="Connexion cryptée Visa, MasterCard et PayPal"
        />
        <CoverAtom
          Icon={() => (
            <img className="size-40" src={IconIntuitive} alt="Icon Intuitive" />
          )}
          title="Expérience utilisateur intuitive"
          description="Navigation facile et agréable"
        />
        <CoverAtom
          Icon={() => (
            <img className="size-40" src={IconEmail} alt="Icon Email" />
          )}
          title="Une question ? "
          description="Notre équipe aime vous aider. Le mail ici  "
        />
      </div>
    </div>
  );
};

export default HeroSection;
