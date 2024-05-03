import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const NewEbooks = () => {
    const token = localStorage.getItem("session");
    let tokenValue = ''; // Déclarer tokenValue en dehors de la condition if

    if (token) {
        const parsedTokenObject = JSON.parse(token);
        tokenValue = parsedTokenObject.token; // Affecter tokenValue si le token est présent
    }

    const addToCart = async (ebookId) => { // Prend l'ID de l'ebook en paramètre
        try {
            // Effectuer une requête POST vers la route 'add_panier' avec l'ID de l'ebook et le token d'authentification
            const response = await axios.post(`https://localhost:8000/add_panier/${ebookId}`, {}, { headers: { Authorization: "Bearer " + tokenValue } });
            console.log(response.data); // Afficher la réponse du serveur (peut être utile pour le débogage)
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const [ebooks, setEbooks] = useState([]);

    useEffect(() => {
        // Fonction pour récupérer les données depuis l'API Symfony
        const fetchEbooks = async () => {
            try {
                const response = await axios.get('https://localhost:8000/newEbooks'); // Endpoint vers votre API Symfony
                setEbooks(response.data); // Mettre à jour l'état avec les données récupérées
            } catch (error) {
                console.error('Error fetching ebooks:', error);
            }
        };

        // Appeler la fonction pour récupérer les données lorsque le composant est monté
        fetchEbooks();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Nouveaux ebooks</h2>
            <div className="grid grid-cols-5 gap-4">
                {ebooks.map((ebook, index) => (
                    <div key={index}>
                        <Link to={`/ebooks/${ebook.id}`} className="hover:no-underline">
                            <div className="bg-white shadow-md p-4 rounded-md">
                                <img src={`${ebook.picture}`} alt={ebook.title} className="w-full h-auto rounded-md" /> {/* Afficher l'image */}
                                <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                                <p className="text-gray-600 mb-2">Prix: {ebook.price}</p>
                                <p className="text-gray-600 mb-4">Auteurs: {ebook.authors.join(', ')}</p>
                            </div>
                        </Link>
                        <button onClick={() => addToCart(ebook.id)}> {/* Appeler la fonction addToCart avec l'ID de l'ebook */}
                            Ajouter au panier
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewEbooks;
