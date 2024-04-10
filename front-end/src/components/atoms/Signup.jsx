import { Button } from '../ui/button';

export const Signup = () => {
    return (
        <div className="">
            <div className="flex w-full max-w-sm items-center space-x-4">
                <input className="border border-black w-full p-2" type="text" placeholder="Entrez votre Email"></input>
                <Button type="submit" className="w-50 h-50 rounded-none">
                    {' '}
                    S&apos;inscrire
                </Button>
            </div>
        </div>
    );
};
