import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import Input from '../ui/input';

const SearchInput = () => {
    return (
        <div className="flex w-full max-w-sm items-center">
            <Input type="text" placeholder="Recherche par titre, auteur, série ou ISBN" className="rounded-none" />
            <Button type="submit" className="rounded-none">
                <Search className="w-5 h-5" />
            </Button>
        </div>
    );
};

export default SearchInput;
