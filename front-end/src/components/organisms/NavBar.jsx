import { ChevronDown } from 'lucide-react';
import Button from '../atoms/Button';
import Logo from '../atoms/Logo';
import SearchInput from '../atoms/SearchInput';
import { ToggleTheme } from '../molecules/ToggleTheme';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const NavBar = () => {
    return (
        <div className=" w-full flex items-center justify-between px-4 text-[#F2F7F3] bg-[#064e3b] dark:bg-[#26474E]">
            {/* bg-[#263B2E] text-[#F2F7F3] */}
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

            <span>Mes recommandations</span>
            <span>Ma bibliothèque</span>
            <SearchInput />
            <ToggleTheme />
            <Button content="Se connecter" />
            <Button content="Panier" icon="cart" />
        </div>
    );
};

export default NavBar;
