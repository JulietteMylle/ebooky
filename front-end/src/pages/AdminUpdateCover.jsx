import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

const UpdateEbookCover = () => {
    const [newCoverImage, setNewCoverImage] = useState(null);
    const [message, setMessage] = useState('');
    const { id } = useParams(); // Assurez-vous que cela fonctionne avec vos paramètres d'URL

    const handleCoverImageChange = (event) => {
        setNewCoverImage(event.target.files[0]);
    };

    const updateEbookCover = async () => {
        const formData = new FormData();
        formData.append('newCoverImage', newCoverImage);

        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const response = await axios.post(`https://localhost:8000/admin/updateEbookCover/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: "Bearer " + tokenValue,
                }
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleCoverImageChange} />
            <button onClick={updateEbookCover}>Update Cover</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateEbookCover;
