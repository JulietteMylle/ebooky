import BookCard from '../molecules/BookCard';
import { Button } from '../ui/button';
export const NewBooks = () => {
    return (
        <div>
            <div className="space-y-4 p-5 px-16">
                <div className="flex flex-row justify-between">
                    <h2 className="text-2xl font-bold align-middle">Nouveautés</h2>
                    <Button> Voir plus </Button>
                </div>
                <h5>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h5>
            </div>
            <div className="flex flex-row justify-evenly py-9">
                <BookCard />
                <BookCard />
                <BookCard />
                <BookCard />
            </div>
        </div>
    );
};
