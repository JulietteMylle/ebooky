import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;
        axios.get('https://localhost:8000/profile', {
            headers: { 'Authorization': 'Bearer ' + tokenValue }
        })
            .then(function (response) {
                setMessage(response.data);
                console.log(response);

            })
            .catch(function (error) {
                if (error.response) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage("An unexpected error occurred");
                }
            });
    }, []); // Empty array means this effect will only run once on component mount

    return (
        <div>
            <p>Profile</p>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Profile;
