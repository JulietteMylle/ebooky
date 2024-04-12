import { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

const Register = () => {
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        onSubmit: (values) => {
            axios.post('https://127.0.0.1:8000/register', values)
                .then(function (response) {
                    setMessage(response.data.message);
                    window.location.href = "/login";
                })
                .catch(function (error) {
                    setMessage(error.response.data.message);
                });
        }
    });

    return (
        <div className="mt-5">
            <h2 className='text-center my-12 text-6xl'>Inscription</h2>
            <p className='text-center my-4'>Vos lectures ... partout ... tout le temps ! </p>

            <form className='flex flex-col' onSubmit={formik.handleSubmit}>
                <label className='text-center my-8 text-2xl' htmlFor="username">Votre pseudo</label>
                <input className='mx-96 h-16 rounded-sm'
                    id='username'
                    name='username'
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
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
            <a href="/login"><button>J'ai déjà un compte !</button> </a>
        </div>


    );
};

export default Register;
