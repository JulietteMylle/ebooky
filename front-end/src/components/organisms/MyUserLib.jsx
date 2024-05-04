import { useState, useEffect } from "react";
import axios from "axios";
// import handleAddToFavoris from "../../pages/Library";

const MyUserLib = () => {
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

  const handleDeleteFromUserLibrary = async (bookId) => {
    try {
      // Récupérer le token d'authentification stocké
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.delete(
        "https://localhost:8000/userlibrary_delete",
        {
          data: { ebook_id: bookId },

          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );

      if (
        response.data.message === "Ebook a été supprimé de votre bibliothèque"
      ) {
        console.log("Le livre a bien été supprimé de votre bibliothèque");

        // Mettre à jour l'état de la bibliothèque de l'utilisateur après la suppression du livre
        const updatedFavorites = favorites.filter((book) => book.id !== bookId);
        setFavorites(updatedFavorites);
        console.log(updatedFavorites);
      }
    } catch (error) {
      console.log("Problème lors de la suppression du livre");
    }
  };

  const handleAddToFavoris = async (bookId) => {
    try {
      // Récupérer le token d'authentification stocké
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.post(
        "https://localhost:8000/userlibrary_add_favorites",
        {
          ebook_id: bookId,

          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );

      if (
        response.data.message === "Ebooks ajoutés à vos favoris avec succès"
      ) {
        console.log("Le livre a bien été ajouté aux favoris");
      }
    } catch (error) {
      console.log("Problème lors de l'ajout aux favoris :", error);
    }
  };
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl text-center align-center font-semibold mb-8">
        Ma bibliothèque
      </h2>
      <div className="bg-white border-2 border-[#064e3b] bg-cover bg-[url('src/assets/images/cover_img.png')]">
        <p className="text-center text-2xl">
          {" "}
          Tous les livres de ma bibliothèque
        </p>
        <div className="overflow-x-auto max-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-8">
            {favorites.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-[#064e3b] shadow-xl p-3"
              >
                <img
                  src={book.picture}
                  alt={book.title}
                  className="mx-auto mb-2 w-36 h-48"
                />
                <p className="text-lg font-bold text-center mb-2">
                  {book.title}
                </p>

                <div>
                  {book.authors.map((author) => (
                    <div key={author.id}>
                      <p className="text-sm italic text-center mb-4">
                        Par{author.fullName}
                      </p>
                      <div className="flex justify-center items-center">
                        <button
                          className="bg-[#064e3b] hover:bg-[#064e3b] text-white font-semibold py-1 px-2 rounded-md w-auto flex items-center space-x-1"
                          onClick={() => handleDeleteFromUserLibrary(book.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-2 h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                        <button
                          className="  text-white font-semibold py-1 px-2 rounded-md w-auto flex items-center space-y-1"
                          onClick={() => handleAddToFavoris(book.id)}
                        >
                          {/* Quand le livre EST dans fav : icon full sinon icon vide A METTRE EN PLACE */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-star mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyUserLib;
