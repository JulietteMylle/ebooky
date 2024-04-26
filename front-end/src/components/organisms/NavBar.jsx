import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import SearchInput from "../atoms/SearchInput";
import { ToggleTheme } from "../molecules/ToggleTheme";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-1 items-center">
          Catégories <ChevronDown className="pt-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <a href="/library">Librairie</a>

      <a href="/mylibrary">Ma Bibliothèque</a>
      {/* <span>Ma bibliothèque</span> */}
      <SearchInput />
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
