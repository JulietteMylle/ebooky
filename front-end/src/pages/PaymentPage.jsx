import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/organisms/CheckoutForm';
import axios from 'axios';

const stripeApiKey = import.meta.env.VITE_STRIPE_API_KEY;
const stripePromise = loadStripe(stripeApiKey);

const PaymentPage = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("session");
                const parsedTokenObject = JSON.parse(token);
                const tokenValue = parsedTokenObject.token;

                const response = await axios.get('https://localhost:8000/panier', {
                    headers: {
                        Authorization: "Bearer " + tokenValue
                    }
                });

                let totalPrice = 0;
                response.data.items.forEach((item) => {
                    totalPrice += item.price * item.quantity;
                });
                setTotalPrice(totalPrice);

            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);


    return (
        <div>
            <h1>Page de Paiement</h1>
            <div>
                <div>
                    <p>Total du Panier: {totalPrice.toFixed(2)} €</p>
                </div>
                <Elements stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} totalPrice={totalPrice} />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentPage;
