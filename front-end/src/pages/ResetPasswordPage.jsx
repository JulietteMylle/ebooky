import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification si les mots de passe correspondent
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Vérification de la complexité du mot de passe
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-zA-Z]).{13,}$/;
        if (!passwordRegex.test(password)) {
            setError('Le mot de passe doit contenir au moins 13 caractères, une minuscule, une majuscule et un caractère spécial');
            return;
        }

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
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>
            {message && <p className="bg-green-500 text-white p-2 rounded-md mb-4">{message}</p>} {/* Afficher le message de succès */}
            {error && <p className="bg-red-500 text-white p-2 rounded-md mb-4">{error}</p>} {/* Afficher le message d'erreur */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md transition-opacity duration-300 ease-in-out hover:bg-blue-600 hover:text-opacity-90 focus:outline-none focus:bg-blue-600 focus:text-opacity-90"
                >
                    Réinitialiser
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
