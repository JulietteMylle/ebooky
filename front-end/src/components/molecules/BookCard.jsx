import { Button } from '../ui/button';

export default function BookCard() {
    return (
        <div className="">
            <div className=" flex flex-col ">
                <img src="public/images/couverture-hp.png" className="w-60 h-80 flex flex-row pb-3" alt="" />
                <div className="flex flex-row justify-between font-bold pb-1.5">
                    <p>Nom du livre </p>
                    <p>20$</p>
                </div>
                <div>
                    <p className="text-sm">Auteur</p>
                </div>
                <Button className="m-5">Ajouter au panier</Button>
            </div>
        </div>
    );
}
