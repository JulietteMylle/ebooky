// frontend/Library.js
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/molecules/BookCard";
// import Filters from "../components/molecules/Filtres";

function Library() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:8000/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des livres :", error);
      });
  }, []);

  return (
    // <div>
    //   <h1>Library</h1>
    //   <div>
    //     {books.map((book) => (
    //       <div key={book.id}>
    //         <h2>{book.title}</h2>
    //         <p>Author: {book.author}</p>
    //         {/* Ajoutez d'autres informations sur le livre si nécessaire */}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="flex flex-col items-center w-full">
      <h1 className="font-bold text-xl">Tous nos livres</h1>
      {/* <div>
        <Filters />
      </div> */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
      </div>

      {books.map((ebook) => (
        <li key={ebook.id}>
          {ebook.title} - {ebook.author}
        </li>
      ))}
    </div>
  );
}

export default Library;
