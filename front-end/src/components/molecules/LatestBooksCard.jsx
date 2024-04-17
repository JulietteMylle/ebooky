import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NewEbooks = () => {
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
                    <Link key={index} to={`/ebooks/${ebook.id}`} className="hover:no-underline">
                        <div className="bg-white shadow-md p-4 rounded-md">
                            <img src={`${ebook.picture}`} alt={ebook.title} className="w-full h-auto rounded-md" /> {/* Afficher l'image */}

                            <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                            <p className="text-gray-600 mb-2">Prix: {ebook.price}</p>
                            <p className="text-gray-600 mb-4">Auteurs: {ebook.authors.join(', ')}</p>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NewEbooks;
