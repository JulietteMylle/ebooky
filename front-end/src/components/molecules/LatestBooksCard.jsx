import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const NewEbooks = () => {
  const token = localStorage.getItem("session");
  let tokenValue = ""; // Déclarer tokenValue en dehors de la condition if

  if (token) {
    const parsedTokenObject = JSON.parse(token);
    tokenValue = parsedTokenObject.token; // Affecter tokenValue si le token est présent
  }

  const addToCart = async (ebookId) => {
    // Prend l'ID de l'ebook en paramètre
    try {
      // Effectuer une requête POST vers la route 'add_panier' avec l'ID de l'ebook et le token d'authentification
      const response = await axios.post(
        `https://localhost:8000/add_panier/${ebookId}`,
        {},
        { headers: { Authorization: "Bearer " + tokenValue } }
      );
      console.log(response.data); // Afficher la réponse du serveur (peut être utile pour le débogage)
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les données depuis l'API Symfony
    const fetchEbooks = async () => {
      try {
        const response = await axios.get("https://localhost:8000/newEbooks"); // Endpoint vers votre API Symfony
        setEbooks(response.data); // Mettre à jour l'état avec les données récupérées
      } catch (error) {
        console.error("Error fetching ebooks:", error);
      }
    };

    // Appeler la fonction pour récupérer les données lorsque le composant est monté
    fetchEbooks();
  }, []);

  return (
    <div>
      {/* Ajout de Tailwind ici pour resonsibe  */}
      <h2 className="text-2xl font-bold mb-4">Nouveaux ebooks</h2>
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

export default NewEbooks;
