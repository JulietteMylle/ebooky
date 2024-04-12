import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteProfile() {
    const [userData, setUserData] = useState(null);
    const [newUserData, setNewUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        axios.get('https://localhost:8000/profile', {
            headers: { 'Authorization': 'Bearer ' + tokenValue }
        })
            .then(response => {
                setUserData(response.data);
                setNewUserData(response.data); // Assigner les données utilisateur existantes à newUserData lorsqu'elles sont disponibles
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        try {
            await axios.delete('https://localhost:8000/deleteProfile', {
                headers: { 'Authorization': 'Bearer ' + tokenValue }
            });
            alert('Profile deleted successfully!');
            // Rediriger l'utilisateur vers une page de confirmation ou de déconnexion
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert('An error occurred while deleting profile. Please try again.');
        }
    };

    return (
        <div>
            <h1>Supression du compte</h1>
            <p>Etes-vous sûrs ? Cette action est définitive</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Supprimer</button>
            </form>
        </div>
    );
}

export default DeleteProfile;
