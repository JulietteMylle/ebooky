import { useEffect, useState } from "react";
import axios from "axios";

export default function BookCard({ book }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:8000/books")
      .then((response) => {
        const booksData = response.data;
        setBooks(booksData);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des livres :", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 m-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white border border-gray-200 rounded-md p-4"
        >
          <img src={book.picture} alt={book.title} className="mx-auto mb-2" />
          <h2 className="text-lg font-bold text-center mb-2">{book.title}</h2>
          <p className="text-sm italic text-center mb-4">
            {/* {book.authors.map((author) => author.fullName).join(", ")}
             */}
            {book.authors &&
              book.authors.map((author) => author.fullName).join(", ")}
          </p>
          {/* Placeholder for your button */}
          <button className="bg-transparent border border-gray-500 text-gray-500 font-semibold py-2 px-4 rounded-md w-full">
            Votre bouton
          </button>
        </div>
      ))}
    </div>
  );
}
