import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [newUserData, setNewUserData] = useState({
        username: '',
        email: ''
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;

        try {
            await axios.put('https://localhost:8000/updateProfile', newUserData, {
                headers: { 'Authorization': 'Bearer ' + tokenValue }
            });
            alert('Profile updated successfully!');
            setUserData(newUserData);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('An error occurred while updating profile. Please try again.');
        }
    };

    return (
        <div>
            <p>Mon profil</p>

            {userData && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom d'utilisateur:</label>
                        <input type="text" name="username" value={newUserData.username} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={newUserData.email} onChange={handleChange} />
                    </div>
                    <button type="submit">Mettre à jour le profil</button>
                </form>
            )}
        </div>
    );
}

export default Profile;
