import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

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
    localStorage.removeItem("session");
    setIsAuthenticated(false);
  };

  return (
    // Ajout de Tailwind ici pour responsive
    <div className="flex flex-col md:flex-row items-center bg-white border m-4 md:m-10 lg:m-20 max-w-full md:max-w-[1400px] h-auto md:h-[700px] mx-2 md:mx-auto">
      <div className="w-full md:w-1/2 flex flex-col items-center  p-4">
        <p className="text-black text-center md:text-left text-2xl md:text-4xl p-5">
          {" "}
          Ebooky
        </p>
        <p className="text-black text-center md:text-left p-6 md:p-10">
          {" "}
          Votre bibliothèque en ligne, rien que pour vous!
        </p>

        {isAuthenticated ? (
          <div className="flex justify-center md:justify-start gap-x-4 ">
            <Link to="/profile">
              <Button className="px-8 md:px-14 py-3 md:py-6">Mon profil</Button>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center md:justify-start gap-x-4 ">
            <Link to="/register">
              <Button className="px-8 md:px-14 py-3 md:py-6">
                Créer un Profil
              </Button>
            </Link>
            <Link to="/login">
              <Button className="px-8 md:px-14 py-3 md:py-6">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 h-full flex justify-center md:justify-end p-4">
        <img
          src="src/assets/images/cover_img.png"
          alt="Cover Image"
          className="object-cover h-64 md:h-full w-full md:w-auto"
        />
      </div>
    </div>
  );
}
