import React, { useState } from 'react';
import axios from 'axios';

const AddEbookForm = () => {

    const [formData, setFormData] = useState({
        title: '',
        publisher: '',
        picture: null,
        publicationDate: '',
        description: '',
        numberPages: '',
        price: '',
        status: '',
        author: '',
        category: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            picture: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;
            const response = await axios.post("https://localhost:8000/admin/addEbook", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + tokenValue
                }
            });
            console.log("Response:", response.data);
            // Gérer la réponse ici, par exemple, afficher un message de succès ou rediriger l'utilisateur
        } catch (error) {
            console.error("Error:", error.response.data);
            // Gérer l'erreur ici, par exemple, afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Ebook</h1>
            <form onSubmit={handleSubmit}>
                {/* Titre */}
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Titre
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Editeur */}
                <div className="mb-4">
                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                        Editeur
                    </label>
                    <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Photo */}
                <div className="mb-4">
                    <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <input
                        type="file"
                        id="picture"
                        name="picture"
                        onChange={handleFileChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Date de publication */}
                <div className="mb-4">
                    <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-700">
                        Date de publication
                    </label>
                    <input
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 p-2 w-full border rounded-md"
                    ></textarea>
                </div>

                {/* Nombre de pages */}
                <div className="mb-4">
                    <label htmlFor="numberPages" className="block text-sm font-medium text-gray-700">
                        Nombre de pages
                    </label>
                    <input
                        type="number"
                        id="numberPages"
                        name="numberPages"
                        value={formData.numberPages}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Prix */}
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Prix
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Statut */}
                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Statut
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                    </select>
                </div>

                {/* Auteur */}
                <div className="mb-4">
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Auteur
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Catégorie */}
                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Catégorie
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Ajouter Ebook
                </button>
            </form>
        </div>
    );
};

export default AddEbookForm;
