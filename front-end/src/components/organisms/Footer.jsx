import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { PiedPage } from '../atoms/PiedPage';

export const Footer = () => {
    return (
        <div className="p-4 space-y-3 text-sm ">
            <div className=" flex justify-center p-6 max-w-">
                <img src="src/assets/images/logoHorizontal.svg" alt="Logo Ebooky Horizontal" />
            </div>
            <div className="flex gap-4 place-content-center p-4 ">
                <div className="font-semibold font-sm ">
                    <h4>Adresse</h4>
                </div>
                <div> 19 Rue des écoles, Roubaix</div>
                <div className="font-semibold font-sm">
                    <h4>Constact</h4>
                </div>
                <div> 06 00 00 00 00 </div>
                <div> Ebooky@ebooky.com</div>
            </div>
            <div className="flex flex-row space-x-2 justify-center p-6 ">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <Facebook />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                    <Instagram />
                </a>

                <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
                    <Twitter />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                    <Linkedin />
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                    <Youtube />
                </a>
            </div>

            <div className="border-t p-6">
                <PiedPage />
            </div>
        </div>
    );
};
