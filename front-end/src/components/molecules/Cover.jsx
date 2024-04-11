import { Button } from '../ui/button';

export default function Cover() {
    return (
        <div className="flex items-center bg-white border m-20 2xl:w-[1400px] h-[700px] mx-8 2xl:mx-auto">
            {/* 2xl = ecran de +1500  */}
            <div className="w-1/2 flex flex-col">
                <p className="text-black text-center text-4xl p-5"> Ebooky</p>
                <p className="text-black text-center p-10"> Votre bibliothèque en ligne, rien que pour vous!</p>
                <div className="flex justify-center gap-x-4 ">
                    <a href="/register"><Button className="px-14 py-6">Créer un Profil</Button></a>
                    <a href="/login"><Button className="px-14 py-6">Se connecter</Button></a>
                </div>
            </div>
            <div className="w-1/2 h-full flex justify-end">
                <img src="src/assets/images/cover_img.png" alt="" className="object-cover h-full " />
            </div>
        </div>
    );
}
