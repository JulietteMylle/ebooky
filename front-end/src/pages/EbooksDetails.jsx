import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EbookDetails = () => {
    const { id } = useParams(); // Récupérer l'ID du livre depuis l'URL
    const [ebook, setEbook] = useState(null);

    useEffect(() => {
        // Fonction pour récupérer les détails du livre depuis l'API Symfony
        const fetchEbookDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:8000/ebooks/${id}`); // Endpoint vers votre API Symfony
                setEbook(response.data); // Mettre à jour l'état avec les données récupérées
            } catch (error) {
                console.error('Error fetching ebook details:', error);
            }
        };

        // Appeler la fonction pour récupérer les détails du livre lorsque le composant est monté
        fetchEbookDetails();
    }, [id]); // Ajouter 'id' comme dépendance pour recharger les détails lorsque l'ID change

    // Si le livre est en cours de chargement, afficher un indicateur de chargement
    if (!ebook) {
        return <p>Loading...</p>;
    }

    // Afficher les détails du livre
    return (
        <div className="flex justify-center">
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden my-4">
                <div className="flex flex-col md:flex-row">
                    <div className="p-4 md:w-1/2">
                        <h2 className="text-2xl font-bold mb-2">{ebook.title}</h2>
                        <p className="text-gray-600 mb-2">Prix: {ebook.price}</p>
                        <p className="text-gray-600 mb-2">Auteurs: {ebook.authors.join(', ')}</p>
                        <p className="text-gray-800">{ebook.description}</p>
                        {ebook.publisher && <p className="text-gray-600">Publisher: {ebook.publisher}</p>}
                    </div>
                    <div className="md:w-1/2">
                        <img src={`${ebook.picture}`} alt={ebook.title} className="w-full h-auto rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EbookDetails;
