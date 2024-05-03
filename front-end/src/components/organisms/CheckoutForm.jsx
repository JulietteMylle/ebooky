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
    console.log(totalPrice);

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
                // Redirect user to payment confirmation page
                // window.location.href = '/confirmation';
            }

        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <form className="pay-form" onSubmit={handlePaymentSubmit}>
            <div className="card-element-container">
                <span className="card-info">Card number</span>
                <CardNumberElement
                    className="CardNumberElement"
                    options={{ style: { base: { color: "#FFFFFF" } } }}
                />
                <div id="card-errors-number" className="error"></div>
            </div>
            <div className="mid-fields">
                <div className="card-element-container">
                    <span className="card-info">Expiration date</span>
                    <CardExpiryElement
                        className="CardExpiryElement"
                        options={{ style: { base: { color: "#FFFFFF" } } }}
                    />
                    <div id="card-errors-expiry" className="error"></div>
                </div>
                <div className="card-element-container">
                    <span className="card-info">CVV</span>
                    <CardCvcElement
                        className="CardCvcElement"
                        options={{ style: { base: { color: "#FFFFFF" } } }}
                    />
                    <div id="card-errors-cvc" className="error"></div>
                </div>
            </div>
            <div className="card-element-container">
                <span className="card-info">Name on the card</span>
                <div className="input-customer-name-container">
                    <input
                        type="text"
                        name="name"
                        className="customer-name"
                        placeholder="A.Martin"
                    />
                </div>
                <div id="card-errors-name" className="error"></div>
            </div>
            <button type="submit" className="submit-button">
                Process to payment
            </button>
        </form>
    );
};

export default CheckoutForm;
