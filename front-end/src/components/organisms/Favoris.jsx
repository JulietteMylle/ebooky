import { useState, useEffect } from "react";
import axios from "axios";

const Favoris = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const fetchFavoriteBooks = async (bookId) => {
      try {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        const response = await axios.get(
          "https://localhost:8000/userlibrary_favorites",
          {
            ebooks: [bookId],
          },
          {
            headers: { Authorization: `Bearer ${tokenValue}` },
          }
        );
        // Mettre à jour l'état avec les favoris récupérés
        setFavoriteBooks(response.data.favoris);
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    // Appeler la fonction pour récupérer les favoris lors du montage du composant
    fetchFavoriteBooks();
  }, []);

  return (
    <div>
      <h2>Mes favoris</h2>
      <ul>
        {favoriteBooks &&
          favoriteBooks.map((book) => <li key={book.id}>{book.id}</li>)}
      </ul>
    </div>
  );
};

export default Favoris;
