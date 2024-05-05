import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EbookDetails = () => {
    const { id } = useParams(); // Récupérer l'ID du livre depuis l'URL
    const [ebook, setEbook] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

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

    useEffect(() => {
        // Fonction pour récupérer les commentaires du livre depuis l'API Symfony
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://localhost:8000/ebooks/${id}/comments`);
                setComments(response.data); // Mettre à jour l'état avec les commentaires récupérés
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        // Appeler la fonction pour récupérer les commentaires lorsque le composant est monté
        fetchComments();
    }, [id]); // Ajouter 'id' comme dépendance pour recharger les commentaires lorsque l'ID change

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;
            await axios.post(
                `https://localhost:8000/ebooks/${id}/newComment`,
                { content: comment },
                { headers: { Authorization: "Bearer " + tokenValue } }
            );
            // Actualiser la liste des commentaires après avoir ajouté un nouveau commentaire
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Si le livre est en cours de chargement, afficher un indicateur de chargement
    if (!ebook) {
        return <p>Loading...</p>;
    }

    // Afficher les détails du livre et la liste des commentaires
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
                <div className="p-4">
                    {/* Formulaire de commentaire */}
                    <form onSubmit={handleSubmitComment}>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Ajouter un commentaire..."
                            rows="4"
                            value={comment}
                            onChange={handleCommentChange}
                        ></textarea>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600"
                            type="submit"
                        >
                            Soumettre
                        </button>
                    </form>
                    {/* Liste des commentaires */}
                    <div className="mt-4">
    <h3 className="text-lg font-semibold mb-2">Commentaires:</h3>
    <ul>
        {comments.map((comment) => (
            <li key={comment.id} className="mb-4">
                <div className="border rounded-md p-4">
                <p className="text-gray-500">
                        {new Date(comment.date.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',

                        })}
                    </p>
                    <p className="font-semibold">{comment.username}</p>
                    <p className="text-gray-600">{comment.content}</p>
                   
                </div>
            </li>
        ))}
    </ul>
</div>

                </div>
            </div>
        </div>
    );
};

export default EbookDetails;
