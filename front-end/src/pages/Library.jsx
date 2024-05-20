import { useEffect, useState } from "react";
import axios from "axios";
import Filter from "../components/molecules/Filters";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function Library() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:8000/books")
      .then((response) => {
        const booksData = response.data;
        setBooks(booksData);
        setFilteredBooks(booksData);

        // Extraction des catégories à partir des données des livres
        const uniqueCategories = [
          ...new Set(booksData.flatMap((book) => book.category)),
        ];
        setCategories(uniqueCategories);

        const uniqueAuthors = [
          ...new Set(booksData.flatMap((book) => book.authors)),
        ];
        setAuthors(uniqueAuthors);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des livres :", error);
      });
  }, []);

  //   const handleAddToFavoris = async (bookId) => {
  //     try {
  //       const token = localStorage.getItem("session");
  //       const parsedTokenObject = JSON.parse(token);
  //       const tokenValue = parsedTokenObject.token;

  //       const response = await axios.post(
  //         "https://localhost:8000/userlibrary_add_favorites",
  //         {
  //           id: bookId,
  //           is_favorite: true,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${tokenValue}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         console.log("Livre ajouté avec succès aux favoris");
  //       }
  //     } catch (error) {
  //       console.error("Problème lors de l'ajout du livre aux favoris :", error);
  //     }
  //   };

  const handleAddToUserLib = async (bookId) => {
    try {
      // Récupérer le token d'authentification stocké
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      // Effectuer une requête POST vers l'endpoint '/favorites_add' avec l'ID de l'ebook et le token d'authentification
      const response = await axios.post(
        `https://localhost:8000/favorites_add`,
        { ebook_id: bookId }, // Envoyer l'ID de l'ebook dans le corps de la requête
        { headers: { Authorization: "Bearer " + tokenValue } }
      );
      console.log(response.data); // Afficher la réponse du serveur (peut être utile pour le débogage)
    } catch (error) {
      console.error("Error adding item to favorites:", error);
    }
  };

  const handleFilter = (filters) => {
    let filteredBooksData = [...books];
    if (filters.author) {
      filteredBooksData = filteredBooksData.filter((book) =>
        book.authors.some((author) => author.fullName === filters.author)
      );
    }
    if (filters.title) {
      filteredBooksData = filteredBooksData.filter((book) =>
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    if (filters.category) {
      filteredBooksData = filteredBooksData.filter((book) =>
        book.category.some((category) => category.name === filters.category)
      );
    }
    setFilteredBooks(filteredBooksData);
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>Librairie Ebooky</title>
        <meta
          name="description"
          content="Explorez la librairie Ebooky pour découvrir une vaste collection de livres électroniques.
           Trouvez vos auteurs et catégories préférés."
        />
      </Helmet>

      <h1 className="text-3xl text-center align-center font-semibold mb-8">
        Librairie Ebooky
      </h1>
      
      <div className="m-7">
        <Filter
          authors={authors}
          categories={categories}
          handleFilter={handleFilter}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white border border-gray-200 rounded-md p-4"
          >
            <img
              src={book.picture}
              alt={book.title}
              className="mx-auto mb-2 w-48 h-64"
            />
            <h2 className="text-lg font-bold text-center mb-2">{book.title}</h2>
            <p className="text-sm italic text-center mb-4">
              {book.authors.map((author) => author.fullName).join(", ")}
            </p>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md w-full mr-2 flex items-center"
              onClick={() => handleAddToUserLib(book.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#064e3b"
                stroke="064e3b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-library-big mr-1"
              >
                <rect width="8" height="18" x="3" y="3" rx="1" />
                <path d="M7 3v18" />
                <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
              </svg>
              Ajouter à ma bibliothèque
            </button>
            <Link
              to={`/ebooks/${book.id}`}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md w-full mr-2 flex items-center"
            >
              Voir plus
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
