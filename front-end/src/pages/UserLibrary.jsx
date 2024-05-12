import React, { useState, useEffect } from "react";
import axios from "axios";
import MyUserLib from "../components/organisms/MyUserLib";
import { Link } from "react-router-dom";

function UserLibrary() {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        const response = await axios.get("https://localhost:8000/userCommandes", {
          headers: { Authorization: `Bearer ${tokenValue}` },
        });

        // Mapper les données pour obtenir une liste unique de livres
        const books = response.data.reduce((acc, order) => {
          order.orderLines.forEach((orderLine) => {
            const existingBook = acc.find((book) => book.ebook_id === orderLine.ebook_id);
            if (!existingBook) {
              acc.push(orderLine);
            }
          });
          return acc;
        }, []);

        setUserBooks(books);
      } catch (error) {
        console.error("Error fetching user books:", error);
      }
    };

    fetchUserBooks();
  }, []);

  return (
    <div className="container mx-auto">
      <MyUserLib />
      <div className="bg-white border m-8 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos livres commandés sur Ebooky</h2>
        <div className="flex flex-wrap -mx-4">
          {userBooks.map((book, index) => (
            <div key={index} className="w-1/4 px-4 mb-4">
              <div className="border rounded-lg overflow-hidden h-[350px]">
                <img src={book.picture} className="w-full h-48 object-cover" alt={book.ebook_title} />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{book.ebook_title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{book.ebook_authors.join(", ")}</p>
                  <div className="flex justify-end">
                    <Link to={`/ebooks/${book.ebook_id}`} className="bg-gray-200 hover:bg-gray-300 text-white font-semibold py-2 px-4 rounded-md flex items-center" style={{ backgroundColor: '#064E3B' }}>
                      Voir plus
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserLibrary;
