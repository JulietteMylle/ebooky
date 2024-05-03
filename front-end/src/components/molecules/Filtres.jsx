import { useState } from "react";
import BookCard from "./BookCard";

const Filters = () => {
  const [filteredBooks, setFilteredBooks] = useState(ebooks);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");

  const filterBooks = () => {
    let filtered = ebooks;

    // Filtrer par genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    // Filtrer par auteur
    if (selectedAuthor !== "all") {
      filtered = filtered.filter((book) => book.author === selectedAuthor);
    }

    // Mettre à jour la liste des livres filtrés
    setFilteredBooks(filtered);
  };

  // Écoute des changements de filtre
  useEffect(() => {
    filterBooks();
  }, [selectedGenre, selectedAuthor]);

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="font-bold text-xl">Tous nos livres</h1>

      {/* Filtres */}
      <div className="flex space-x-4 mt-4">
        {/* Sélecteur de genre */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="all">Tous les genres</option>
          {/* Liste des genres */}
        </select>

        {/* Sélecteur d'auteur */}
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
        >
          <option value="all">Tous les auteurs</option>
          {/* Liste des auteurs */}
        </select>
      </div>

      {/* Affichage des livres filtrés */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
};

export default Filters;
