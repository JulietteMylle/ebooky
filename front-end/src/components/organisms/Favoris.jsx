import { useState, useEffect } from "react";
import axios from "axios";

const Favoris = () => {
  const [favoris, setFavoris] = useState([]);

  const fetchFavoris = async () => {
    try {
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.get(
        "https://localhost:8000/userlibrary_favorites",
        {
          headers: { Authorization: `Bearer ${tokenValue}` },
        }
      );
      const favorisData = response.data.items;
      setFavoris(favorisData);
    } catch (error) {
      console.log("Erreur lors de la récupération de vos favoris", error);
    }
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  const handleUpdateStatus = async (ebookId, isFavorite) => {
    try {
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.put(
        `https://localhost:8000/books/${ebookId}/update`,
        { status: isFavorite ? "favorite" : "not_favorite" },
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );

      fetchFavoris();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de l'ebook :",
        error
      );
    }
  };

  return (
    <div>
      <h1>Mes favoris</h1>
      <ul>
        {favoris.map((favori) => (
          <li key={favori.id}>
            {favori.title}
            <button
              onClick={() => handleUpdateStatus(favori.id, !favori.is_favorite)}
            >
              {favori.is_favorite
                ? "Retirer des favoris"
                : "Ajouter aux favoris"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favoris;
