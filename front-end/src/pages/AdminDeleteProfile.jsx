import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDeleteProfile() {
    const [userData, setUserData] = useState(null);
    const [newUserData, setNewUserData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        axios.get('https://localhost:8000/admin/profile', {
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
            await axios.delete('https://localhost:8000/admin/deleteProfile', {
                headers: { 'Authorization': 'Bearer ' + tokenValue }
            });
            localStorage.removeItem("session");
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert('An error occurred while deleting profile. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen p-12 rounded-3xl m-96 mt-12 mb-12 flex-col">
            <img className=" w-auto h-96 rounded-md" src="src/assets/images/imge-delete-account.jpg" alt="" />
            <h1 className='text-center my-12 text-6xl'>Supression du compte</h1>
            <p className='text-center my-12 text-2xl'>Etes-vous sûrs ? Cette action est définitive ... </p>
            <form onSubmit={handleSubmit}>
                <button className='my-8 text-2xl border w-80 h-20 rounded-lg bg-primary text-white hover:bg-transparent hover:text-black' type="submit">Supprimer</button>
            </form>
        </div>
    );
}

export default AdminDeleteProfile;
