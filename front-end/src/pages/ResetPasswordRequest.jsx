import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPasswordRequest = () => {
    axios.post('https://localhost:8000/resetPassword', { email: email })
      .then(response => {
        setSuccessMessage(response.data.message);
      })
      .catch(error => {
        setErrorMessage('An error occurred while requesting password reset: ' + error.message);
        console.log(email)
      });
  };

  const handlePasswordReset = () => {
    axios.post(`https://localhost:8000/reset/${token}`, { newPassword })
      .then(response => {
        setSuccessMessage(response.data.message);
      })
      .catch(error => {
        setErrorMessage('An error occurred while resetting password: ' + error.message);
      });
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Réinitialisation du mot de passe</h1>
        {successMessage && <div className="bg-green-500 text-white p-2 rounded-md mb-4">{successMessage}</div>}
        {errorMessage && <div className="bg-red-500 text-white p-2 rounded-md mb-4">{errorMessage}</div>}
        <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
        </div>
        <button
        style={{ backgroundColor: '#054E3B' }}
            onClick={handleResetPasswordRequest}
            className="bg-054E3B text-white px-4 py-2 rounded-md transition-opacity duration-300 ease-in-out hover:bg-opacity-90 hover:text-opacity-90 focus:outline-none focus:bg-opacity-90 focus:text-opacity-90"
        >
            Demander la réinitialisation du mot de passe
        </button>
    </div>
);
};

export default ResetPassword;