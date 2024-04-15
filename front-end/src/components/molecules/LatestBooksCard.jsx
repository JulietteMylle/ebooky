import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            <h2>Nouveaux ebooks</h2>
            <ul>
                {ebooks.map((ebook, index) => (
                    <li key={index}>
                        <h3>{ebook.title}</h3>
                        <p>Prix: {ebook.price}</p>
                        <p>Auteurs: {ebook.authors.join(', ')}</p>
                        <img src={`https://localhost:8000${ebook.picture}`} alt={ebook.title} /> {/* Afficher l'image */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewEbooks;
