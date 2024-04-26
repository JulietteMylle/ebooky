import React from "react";
import BookCard from "../components/molecules/BookCard";

const MyLibrary = ({ favoris, books }) => {
  // Filtrer les livres correspondants aux bookId favoris
  const favorisBooks = books.filter((book) => favoris.includes(book.id));

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center align-center font-semibold mb-8">
        Ma Bibliothèque
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {favorisBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default MyLibrary;
