export default function TestimonialCard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="border-2 p-6 dark:border-white rounded-md bg-white">
          <p className="text-xl mb-4">⭐ ⭐ ⭐ ⭐ ⭐</p>
          <p className="text-lg leading-relaxed">
            "Ebooky est une plateforme incroyable pour les amateurs de lecture comme moi ! J'ai trouvé tant de livres intéressants ici et la gestion de ma bibliothèque est si facile. Je recommande fortement Ebooky à tous les lecteurs avides !"
          </p>
          <div className="flex items-center mt-4">
            <p className="text-lg font-semibold">BookLover82</p>
          </div>
        </div>
        <div className="border-2 p-6 dark:border-white rounded-md bg-white">
          <p className="text-xl mb-4">⭐ ⭐ ⭐ ⭐</p>
          <p className="text-lg leading-relaxed">
            "Je suis tellement impressionné par la variété de livres disponibles sur Ebooky. De la fiction à la non-fiction, il y en a pour tous les goûts. La navigation sur le site est également fluide et intuitive. Bravo à l'équipe Ebooky pour leur excellent travail !"
          </p>
          <div className="flex items-center mt-4">
            <p className="text-lg font-semibold">ReadMoreBooks</p>
          </div>
        </div>
        <div className="border-2 p-6 dark:border-white rounded-md bg-white">
          <p className="text-xl mb-4">⭐ ⭐ ⭐ ⭐ ⭐</p>
          <p className="text-lg leading-relaxed">
            "Je suis tellement impressionné par la variété de livres disponibles sur Ebooky. De la fiction à la non-fiction, il y en a pour tous les goûts. La navigation sur le site est également fluide et intuitive. Bravo à l'équipe Ebooky pour leur excellent travail !"
          </p>
          <div className="flex items-center mt-4">
            <p className="text-lg font-semibold">LiteraryExplorer99</p>
          </div>
        </div>
      </div>
    </>
  );
}
