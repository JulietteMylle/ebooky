import IconSafePaiement from '@/assets/images/IconSafePaiement.svg';
import IconEmail from '@/assets/images/IconEmail.svg';
import IconIntuitive from '@/assets/images/IconIntuitive.svg';
import CoverAtom from '../atoms/CoverAtoms';
import Cover from '../molecules/Cover';

const HeroSection = () => {
    return (
        <div className="">
            <Cover />
            <div className=" w-full flex justify-evenly -mt-8 ">
                <CoverAtom
                    Icon={() => <img className='size-40' src={IconSafePaiement} alt="Icon Safe Paiement" />}
                    title="Paiement sécurisé"
                    description="Connexion cryptée Visa, MasterCard et PayPal"
                />
                <CoverAtom
                    Icon={() => <img className='size-40' src={IconIntuitive} alt="Icon Intuitive" />}
                    title="Expérience utilisateur intuitive"
                    description="Navigation facile et agréable"
                />
                <CoverAtom
                    Icon={() => <img className='size-40' src={IconEmail} alt="Icon Email" />}
                    title="Une question ? "
                    description="Notre équipe aime vous aider. Le mail ici  "
                />
            </div>
        </div>
    );
};

export default HeroSection;


