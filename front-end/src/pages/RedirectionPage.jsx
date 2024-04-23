import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
    const [roles, setRoles] = useState([]);
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        axios.get('https://localhost:8000/login')
            .then(response => {
                setRoles(response.data.role);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);

    useEffect(() => {
        if (roles.includes('ROLE_ADMIN')) {
            setRedirectTo('/');
        } else {
            setRedirectTo('/profile');
        }
    }, [roles]);

    if (redirectTo) {
        return <Redirect to={redirectTo} />;
    }

    // Gestion du chargement ou de la redirection par défaut
    return <div>Loading...</div>;
}

export default ProfilePage;
