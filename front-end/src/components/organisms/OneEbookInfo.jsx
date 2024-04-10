import { MessageCircleMore } from 'lucide-react';
import BookImage from '../molecules/BookImage';
import TagsEbook from '../molecules/TagsEbook';
import { Button } from '../ui/button';

function OneEbookInfo() {
    return (
        <div className="flex m-20 ">
            <div className="w-1/2 ">
                <p className="text-6xl mb-6 "> Nom du livre </p>
                <p className="text-xl font-thin mb-2 ">Nom Auteur </p>
                <p className="text-xl font-thin mb-4">Date de publication</p>
                <p className="text-2xl mb-2">Résumé : </p>
                <p className="text-xl font-thin mb-6">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, corrupti praesentium. Tempore quos
                    similique ullam quisquam maiores! Aliquid omnis expedita ipsa deserunt qui. Sequi, omnis rem dolor
                    dolorum aut aliquam!
                </p>
                <p className="mb-6">Format Achat :</p>
                <div className="flex justify-around mb-10">
                    <Button className="px-20 py-10"> Ebook : 9€99</Button>
                    <Button className="px-20 py-10">PDF : 9€99</Button>
                </div>
                <div className="flex mb-6 text-xl font-thin ">
                    <MessageCircleMore />
                    <a href="#">&ensp; 168 commentaires sur cet ouvrage, cliquez-ici pour les découvrir</a>
                </div>
                <div className="text-center">
                    <Button className="mx-auto">Ajoutez ce livre à votre liste de souhait</Button>
                </div>
            </div>
            <div className="w-1/2 ">
                <div className="mb-4 flex justify-center">
                    <BookImage />
                </div>

                <div className="mb-4 flex justify-center">
                    <TagsEbook />
                </div>
            </div>
        </div>
    );
}

export default OneEbookInfo;
