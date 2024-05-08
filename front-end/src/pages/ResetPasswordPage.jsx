import  { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:8000/emailChecked', {
                password,
                token
            });
            setMessage(response.data.message); // Mettre à jour le message de succès
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error.response.data.message);
        }
    };

    return (
        <div>
            <h1>Réinitialiser le mot de passe</h1>
            {message && <p>{message}</p>} {/* Afficher le message de succès */}
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
