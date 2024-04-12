import { useFormik } from "formik";
import { useState } from "react";
import axios from 'axios';


function Login() {
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            axios.post('https://localhost:8000/login', values)
                .then(function (response) {
                    const responseDataString = JSON.stringify(response.data);
                    window.localStorage.setItem("session", responseDataString);
                    window.location.href = "/";

                })
                .catch(function (error) {
                    setMessage(error.response.data.message);
                });
        }
    });
    return (
        <div>
            <h2 className='text-center my-12 text-6xl'>Connexion</h2>
            <form onSubmit={formik.handleSubmit}>
                <label className='text-center my-8 text-2xl' htmlFor="email">Votre adresse e-mail</label>
                <input className='mx-96 h-16 rounded-sm'
                    id='email'
                    name='email'
                    type='email'
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <label className='text-center my-8 text-2xl' htmlFor="password">Votre mot de passe</label>
                <input className='mx-96 h-16 rounded-sm'
                    id='password'
                    name='password'
                    type='password'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <button className='my-8 text-2xl' type='submit'>Gooooo</button>


            </form>
            {message && <p>{message}</p>}
        </div>

    );
}

export default Login