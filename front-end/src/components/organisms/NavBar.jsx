import  { useState, useEffect } from "react";

import Button from "../atoms/Button";
import Logo from "../atoms/Logo";

import { ToggleTheme } from "../molecules/ToggleTheme";
import { Link } from "react-router-dom";


const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className=" w-full flex items-center justify-between px-4 text-[#F2F7F3] bg-[#064e3b] dark:bg-[#26474E]">
      <div className="w-14 h-12 ">
        <Logo />
      </div>
      


      <a href="/library">Librairie</a>
      <a href="/userlibrary">Mon Espace</a>
    
      <ToggleTheme />
      {isAuthenticated ? (
        <Link to="/profile">Mon Profil</Link>
      ) : (
        <Link to="/login">Se Connecter</Link>
      )}
      <Link to="/cart">
        <Button content="Panier" icon="cart" />
      </Link>
    </div>
  );
};

export default NavBar;
