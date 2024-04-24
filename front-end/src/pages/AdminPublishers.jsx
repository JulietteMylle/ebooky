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

            const response = await.get('https://localhost:8000/admin/publishers', {
                headers: { Authorization: "Bearer " + tokenValue},
            });

        } catch (error) {
            console.error("Oups :", error);
            setErrorMessage("Une erreur est survenue lors de la récupération des maisons d'éditions")
        }
    };
    useEffect(() => {
        fetchPublishers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("session");
            if(!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.put(`https://localhost:800/admin/editPublishers/${editedPublisher.id}`, editedPublisher, {
                headers: { Authorization: "Bearer " + tokenValue },
            });

            setSelectedPublisher(null);

            fetchPublishers();
        } catch(error) {
            console.error("Oups : ", error);
            setErrorMessage("Une erreur est survenue lors de la modification de la maison d'édition");
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const token = localStorage.getItem("session");
            if(!token) {
                setErrorMessage("Oups, vous n'avez pas accès à cette page");
                return;
            }

            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.delete()
        }
    }
}