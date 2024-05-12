import { useState, useEffect } from "react";
import axios from "axios";
import MyUserLib from "../components/organisms/MyUserLib";
// import Favoris from "../components/organisms/Favoris";
import GetFavoris from "../components/molecules/GetFavoris";

function UserLibrary() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        const response = await axios.get("https://localhost:8000/userlibrary", {
          headers: { Authorization: `Bearer ${tokenValue}` },
        });

        const bookIds = response.data.items.map((item) => item.id);
        const promises = bookIds.map((id) =>
          axios.get(`https://localhost:8000/books/${id}`)
        );

        const bookDetails = await Promise.all(promises);

        // Mettre à jour les détails des livres dans l'état
        const updatedFavorites = bookDetails.map((response) => response.data);

        setFavorites(updatedFavorites);
        console.log(bookIds);
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
    <div className="container mx-auto">
      <MyUserLib />
      <div className="bg-white border m-8">
        <GetFavoris />
        <div className="overflow-x-auto max-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-8 "></div>
        </div>
      </div>
    </div>
  );
}

export default UserLibrary;
