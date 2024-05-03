import { useEffect, useState } from "react";
import axios from "axios";

function AdminAuthorPage() {
    const [authors, setAuthors] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [editedAuthor, setEditedAuthor] = useState({ id: null, fullName: '', biography: '' });

    const fetchAuthors = async () => {
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const response = await axios.get('https://localhost:8000/admin/authors', {
                headers: { Authorization: "Bearer " + tokenValue },
            });
            if (Array.isArray(response.data)) {
                setAuthors(response.data);
            } else {
                console.error("La réponse ne contient pas un tableau d'auteurs.");
            }

        } catch (error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la récupération des auteurs");
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleEditClick = (author) => {
        setSelectedAuthor(author);
        setEditedAuthor(author);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAuthor({ ...editedAuthor, [name]: value });
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

            await axios.put(`https://localhost:8000/admin/editAuthor/${editedAuthor.id}`, editedAuthor, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            // Réinitialiser l'auteur sélectionné après la modification réussie
            setSelectedAuthor(null);

            // Rafraîchir la liste des auteurs
            fetchAuthors();
        } catch (error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la modification de l'auteur");
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

            await axios.delete(`https://localhost:8000/admin/deleteAuthors/${id}`, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            // Rafraîchir la liste des auteurs après la suppression réussie
            fetchAuthors();
        } catch (error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la suppression de l'auteur");
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4"> Liste des auteurs</h2>
            {errorMessage && <p className="text-red-600"> {errorMessage} </p>}
            {!errorMessage && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Nom</th>
                                <th className="px-4 py-2">Biographie</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authors.map((author) => (
                                <tr key={author.id}>
                                    <td className="border px-4 py-2"> {author.id} </td>
                                    <td className="border px-4 py-2"> {author.fullName} </td>
                                    <td className="border px-4 py-2"> {author.biography} </td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleEditClick(author)}>Modifier</button>
                                        <button onClick={() => handleDeleteClick(author.id)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedAuthor && (
                <div>
                    <h3>Modifier l'auteur</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nom:
                            <input
                                type="text"
                                name="fullName"
                                value={editedAuthor.fullName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Biographie:
                            <textarea
                                name="biography"
                                value={editedAuthor.biography}
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

export default AdminAuthorPage;
