import { Signup } from '../atoms/Signup';

export const Newsletter = () => {
    return (
        <div className="space-y-4 p-5 px-16">
            <div className=" text-2xl font-bold align-middle ">
                <h1>Restons en contact!</h1>
            </div>
            <div>
                <h2>
                    Inscrivez-vous à notre newsletter pour rester informé de nos actualités, et des actualités des
                    livres que vous aimez.
                </h2>
            </div>
            <div className="flex-col space-y-4">
                <Signup />
            </div>
            <div className="text-xs">
                <h6> En cliquant ici vous acceptez nos Conditions générales d&apos;utilisations</h6>
            </div>
        </div>
    );
};
