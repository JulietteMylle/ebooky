import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;
        const fetchCartItems = async () => {
            try {
                const response = await axios.get("https://localhost:8000/panier", { headers: { Authorization: "Bearer " + tokenValue }, });
                setCartItems(response.data.items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-4">Mon Panier</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-md rounded-md overflow-hidden">
                        <img src={item.picture} alt={item.name} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                            <p className="text-gray-600">Prix: {item.price} €</p>
                            <p className="text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cart;
