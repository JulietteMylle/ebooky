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
    <div>
      <h1>Reset Password</h1>
      {successMessage && <div className="success">{successMessage}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <button onClick={handleResetPasswordRequest}>Request Password Reset</button>
      </div>
      {/* <div>
        <label>Token:</label>
        <input type="text" value={token} onChange={e => setToken(e.target.value)} />
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <button onClick={handlePasswordReset}>Reset Password</button>
      </div> */}
    </div>
  );
};

export default ResetPassword;
