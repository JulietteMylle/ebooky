import React from "react";
import axios from "axios";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ clientSecret, totalPrice }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const totalPriceInCents = Math.round(totalPrice * 100);

            const response = await axios.post(
                'https://localhost:8000/panier/pay',
                {
                    paymentMethod: {
                        clientSecret: clientSecret,
                    },
                    totalPrice: totalPriceInCents,
                },
                {
                    headers: {
                        Authorization: "Bearer " + tokenValue,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { clientSecret: returnedClientSecret } = response.data;

            if (!stripe || !elements) {
                console.error('Stripe or elements not available.');
                return;
            }

            const result = await stripe.confirmCardPayment(returnedClientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });

            if (result.error) {
                console.error('Error processing payment:', result.error);
            } else {
                console.log('Payment confirmed:', result.paymentIntent);

                try {
                    // Récupération du token JWT depuis le localStorage
                    const token = localStorage.getItem("session");
                    const parsedTokenObject = JSON.parse(token);
                    const tokenValue = parsedTokenObject.token;

                    // Appel de l'endpoint pour transférer le contenu du panier vers la commande
                    await axios.post('https://localhost:8000/transfererpanier', null, {
                        headers: {
                            Authorization: "Bearer " + tokenValue,
                        }
                    });

                    console.log('Le contenu du panier a été transféré avec succès vers la commande.');

                    // Appel de l'endpoint pour vider le panier
                    await axios.delete('https://localhost:8000/viderpanier', {
                        headers: {
                            Authorization: "Bearer " + tokenValue,
                        }
                    });

                    console.log('Le panier a été vidé avec succès.');

                } catch (error) {
                    console.error('Erreur lors de la tentative de transfert du panier ou de vidage du panier :', error);
                }

                // Redirect user to payment confirmation page
                window.location.href = '/confirmation';
            }

        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <form onSubmit={handlePaymentSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                    Card Number
                </label>
                <CardNumberElement
                    id="cardNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    options={{ style: { base: { color: "#000000" } } }}
                />
            </div>
            <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardExpiry">
                        Expiration Date
                    </label>
                    <CardExpiryElement
                        id="cardExpiry"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        options={{ style: { base: { color: "#000000" } } }}
                    />
                </div>
                <div className="w-1/2 ml-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardCvc">
                        CVV
                    </label>
                    <CardCvcElement
                        id="cardCvc"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        options={{ style: { base: { color: "#000000" } } }}
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardName">
                    Name on the card
                </label>
                <input
                    id="cardName"
                    type="text"
                    name="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="A.Martin"
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Process to Payment
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
