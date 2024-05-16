import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TopRatedBookCard = () => {
  const token = localStorage.getItem("session");
  let tokenValue = "";

  if (token) {
    const parsedTokenObject = JSON.parse(token);
    tokenValue = parsedTokenObject.token;
  }

  const addToCart = async (ebookId) => {
    try {
      const response = await axios.post(
        `https://localhost:8000/add_panier/${ebookId}`,
        {},
        { headers: { Authorization: "Bearer " + tokenValue } }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await axios.get(
          "https://localhost:8000/topRatedBooks"
        );
        setEbooks(response.data);
      } catch (error) {
        console.error("Error fetching ebooks:", error);
      }
    };

    fetchEbooks();
  }, []);

  return (
    // Ajout de tailwind ici pour responsive
    <div>
      <h2 className="text-2xl font-bold mb-4">Nos ebooks les mieux notés</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ebooks.map((ebook, index) => (
          <div key={index}>
            <Link to={`/ebooks/${ebook.id}`} className="hover:no-underline">
              <div className="bg-white shadow-md p-4 rounded-md transition-transform transform hover:scale-105 h-full flex flex-col justify-between">
                <div>
                  <img
                    src={`${ebook.picture}`}
                    alt={ebook.title}
                    className="w-full h-auto rounded-md"
                  />
                  <div className="flex flex-col mt-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {ebook.title}
                    </h3>
                    <p className="text-gray-600 mb-2">Prix: {ebook.price} €</p>
                    <p className="text-gray-600 mb-4">
                      Auteurs: {ebook.authors.join(", ")}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    style={{ backgroundColor: "#054E3B" }}
                    className="text-white px-4 py-2 rounded-md transition-opacity duration-300 ease-in-out hover:bg-opacity-90 hover:text-opacity-90"
                    onClick={() => addToCart(ebook.id)}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedBookCard;
