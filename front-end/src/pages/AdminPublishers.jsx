import { useEffect, useState } from "react";
import axios from "axios";

function AdminPublisherPage() {
    const [publishers, setPublishers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [editedPublisher, setEditedPublisher] = useState({ id: null, name: '', details: '' });

    const fetchPublishers = async () => {
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const response = await axios.get('https://localhost:8000/admin/publishers', {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            setPublishers(response.data); // Mettre à jour l'état publishers avec les données récupérées

        } catch (error) {
            console.error("Oups :", error);
            setErrorMessage("Une erreur est survenue lors de la récupération des maisons d'éditions")
        }
    };

    useEffect(() => {
        fetchPublishers();
    }, []);

    const handleEditClick = (publisher) => {
        setSelectedPublisher(publisher);
        setEditedPublisher(publisher);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPublisher({ ...editedPublisher, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.put(`https://localhost:8000/admin/editPublisher/${editedPublisher.id}`, editedPublisher, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            setSelectedPublisher(null);

            fetchPublishers();
        } catch (error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la modification de la maison d'édition");
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.delete(`https://localhost:8000/admin/deletePublisher/${id}`, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            fetchPublishers();
        } catch (error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la suppression de la maison d'édition");
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4"> Liste des maisons d'éditions</h2>
            {errorMessage && <p className="text-red-600"> {errorMessage} </p>}
            {!errorMessage && (
                <div className="overflow-x auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Nom</th>
                                <th className="px-4 py-2">Details</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publishers.map((publisher) => (
                                <tr key={publisher.id}>
                                    <td className="border px-4 py-2"> {publisher.id} </td>
                                    <td className="border px-4 py-2"> {publisher.name} </td>
                                    <td className="border px-4 py-2"> {publisher.details} </td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleEditClick(publisher)}>Modifier</button>
                                        <button onClick={() => handleDeleteClick(publisher.id)}>Supprimer</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedPublisher && (
                <div>
                    <h3>Modifier la maison d'édition</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nom :
                            <input
                                type="text"
                                name="name"
                                value={editedPublisher.name}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Détails
                            <textarea
                                name="details"
                                value={editedPublisher.details}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button type="submit">Enregistrer</button>
                    </form>
                </div>
            )}

        </div>
    );
}

export default AdminPublisherPage;
