import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import de Link pour la navigation

function AdminEbookList() {
    const [ebooks, setEbooks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchEbooks = async () => {
            try {
                const token = localStorage.getItem("session");
                if (!token) {
                    setErrorMessage("Oups, vous n'avez pas accès à cette page.");
                    return;
                }

                const parsedTokenObject = JSON.parse(token);
                const tokenValue = parsedTokenObject.token;

                const response = await axios.get('https://localhost:8000/admin/ebookListPage', {
                    headers: { Authorization: "Bearer " + tokenValue },
                });
                if (Array.isArray(response.data)) {
                    setEbooks(response.data);
                } else {
                    console.error('La réponse ne contient pas un tableau de ebooks.');
                }
            } catch (error) {
                console.error('Oups : ', error);
                setErrorMessage("Une erreur s'est produite lors du chargement des ebooks.");
            }
        };
        fetchEbooks();
    }, []);

    const handleUpdateEbook = async (id, updatedFields) => {
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page.");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const fieldsToUpdate = { ...updatedFields };

            await axios.put(`https://localhost:8000/admin/editEbook/${id}`, fieldsToUpdate, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            const updatedEbooks = ebooks.map(ebook => {
                if (ebook.id === id) {
                    return { ...ebook, ...fieldsToUpdate };
                }
                return ebook;
            });
            setEbooks(updatedEbooks);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du livre : ', error);
        }
    };

    const handleFieldChange = (e, field, index) => {
        const newEbooks = [...ebooks];
        if (field === 'authors') {
            newEbooks[index][field] = e.target.value.split(',').map(author => author.trim());
        } else {
            newEbooks[index][field] = e.target.value;
        }
        setEbooks(newEbooks);
    };

    const handleDeleteEbook = async (id) => {
        try {
            const token = localStorage.getItem("session");
            if (!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page.");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.delete(`https://localhost:8000/admin/deleteEbook/${id}`, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            const updatedEbooks = ebooks.filter(ebook => ebook.id !== id);
            setEbooks(updatedEbooks);
        } catch (error) {
            console.error('Erreur lors de la suppression du livre : ', error);
        }
    };
    const handleNavigationCouv = (id) => {
        // Redirection vers la page de modification de la couverture de l'ebook avec l'ID en paramètre
        window.location.href = `http://localhost:5173/admin/updateEbookCover/${id}`;
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Liste des ebooks</h2>
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {!errorMessage && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Titre</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Auteurs</th>
                                <th className="px-4 py-2">Prix</th>
                                <th className="px-4 py-2">Statut</th>
                                <th className="px-4 py-2">Maison d'éditions</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(ebooks) && ebooks.map((ebook, index) => (
                                <tr key={ebook.id}>
                                    <td className="border px-4 py-2">{ebook.id}</td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.title} onChange={(e) => handleFieldChange(e, 'title', index)} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.description} onChange={(e) => handleFieldChange(e, 'description', index)} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.authors.join(', ')} onChange={(e) => handleFieldChange(e, 'authors', index)} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.price} onChange={(e) => handleFieldChange(e, 'price', index)} /> €
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.status} onChange={(e) => handleFieldChange(e, 'status', index)} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <input type="text" value={ebook.publisher && ebook.publisher} onChange={(e) => handleFieldChange(e, 'publisher', index)} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button onClick={() => handleUpdateEbook(ebook.id, ebooks[index])}>Enregistrer</button>
                                        <button onClick={() => handleDeleteEbook(ebook.id)}>Supprimer</button>
                                        <button onClick={() => handleNavigationCouv(ebook.id)}>Modifier la couverture</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminEbookList;

