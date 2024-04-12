import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function Cover() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("session");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        // Supprimer le token du local storage
        localStorage.removeItem('session');
        setIsAuthenticated(false);
    }

    return (
        <div className="flex items-center bg-white border m-20 2xl:w-[1400px] h-[700px] mx-8 2xl:mx-auto">
            <div className="w-1/2 flex flex-col">
                <p className="text-black text-center text-4xl p-5"> Ebooky</p>
                <p className="text-black text-center p-10"> Votre bibliothèque en ligne, rien que pour vous!</p>

                {isAuthenticated ? (
                    <div className="flex justify-center gap-x-4 ">
                        <Link to="/profile"><Button className="px-14 py-6">Mon profil</Button></Link>
                    </div>
                ) : (
                    <div className="flex justify-center gap-x-4 ">
                        <Link to="/register"><Button className="px-14 py-6">Créer un Profil</Button></Link>
                        <Link to="/login"><Button className="px-14 py-6">Se connecter</Button></Link>
                    </div>
                )}
            </div>
            <div className="w-1/2 h-full flex justify-end">
                <img src="src/assets/images/cover_img.png" alt="" className="object-cover h-full " />
            </div>
        </div>
    );
}
