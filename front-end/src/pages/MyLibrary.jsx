import { useState, useEffect } from "react";
import axios from "axios";

function MyLibrary() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        const response = await axios.get(
          "https://localhost:8000/mylibrary/favorites"
        );
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des livres de la bibliothèque :",
          error
        );
      }
    };

    fetchLibraryBooks();
  }, []);

  return (
    <div>
      <h2>Ma bibliothèque</h2>
      <ul>
        {favorites &&
          favorites.map((book) => (
            <li key={book.id}>
              {book.title} - {book.author}{" "}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MyLibrary;
