// ResetPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:8000/emailChecked', {
                password,
                token
            });
            console.log(response.data.message); // Afficher un message de succès
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Réinitialiser le mot de passe</h1>
            <form onSubmit={handleSubmit}>
                <input type="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <input type="hidden" value={token} onChange={(e) => setToken(e.target.value)} />
                <button type="submit">Réinitialiser</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
