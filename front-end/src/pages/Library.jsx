import { useEffect, useState } from "react";
import axios from "axios";
import Filter from "../components/molecules/Filters";
// import BookCard from "../components/molecules/BookCard";

function Library() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoris, setFavoris] = useState([]);

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

  const handleAddToFavoris = async (bookId) => {
    try {
      // Récupérer le token d'authentification stocké
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.post(
        "https://localhost:8000/mylibrary",
        {
          bookId: bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );

      if (response.data.success) {
        setFavoris((prevFavoris) => [...prevFavoris, bookId]);
      }
    } catch (error) {
      console.error("Probleme de récupération du book", error);
    }
    console.log(favoris);
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md w-full mr-2"
              onClick={() => handleAddToFavoris(book.id)}
            >
              Ajouter aux favoris
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md w-full">
              Voir plus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Library;
