import BookCard from '../molecules/BookCard';
import NewEbooks from '../molecules/LatestBooksCard';
import { Button } from '../ui/button';
export const NewBooks = () => {
    return (
 
            <div className="space-y-4 p-5 px-16">
                
            <div className="flex flex-row justify-evenly py-9">
                <NewEbooks />
            </div>
        </div>
    );
};
