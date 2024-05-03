import { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const response = await axios.get("https://localhost:8000/panier", {
                headers: { Authorization: "Bearer " + tokenValue }
            });

            const items = response.data.items;
            setCartItems(items);
            calculateTotal(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const calculateTotal = (items) => {
        let total = 0;
        let count = 0;

        items.forEach((item) => {
            total += item.price * item.quantity;
            count += item.quantity;
        });

        setTotalPrice(total);
        setTotalItems(count);
    };

    const removeCartItem = async (itemId) => {
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            await axios.delete(`https://localhost:8000/remove_panier/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${tokenValue}`
                }
            });

            const updatedCartItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedCartItems);
            calculateTotal(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };


    const adjustQuantity = async (itemId, action) => {
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const url = action === 'increase' ? `https://localhost:8000/add_quantity/${itemId}` : `https://localhost:8000/remove_quantity/${itemId}`;
            await axios.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${tokenValue}`
                }
            });

            fetchCartItems(); // Rafraîchir les données du panier après l'ajustement de la quantité
        } catch (error) {
            console.error('Error adjusting quantity:', error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-4">Votre Panier</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-md rounded-md overflow-hidden">
                        <img src={item.picture} alt={item.name} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                            <p className="text-gray-600 mb-2">Prix: {item.price.toFixed(2)} €</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={() => adjustQuantity(item.id, 'decrease')}>-</button>
                                    <p className="mx-4">{item.quantity}</p>
                                    <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={() => adjustQuantity(item.id, 'increase')}>+</button>
                                </div>
                                <div>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => removeCartItem(item.id)}>Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-8">
                <div className="bg-green-500 text-white px-6 py-3 rounded-md text-lg">Total articles: {totalItems}</div>
                <div className="bg-green-500 text-white px-6 py-3 rounded-md text-lg ml-4">Total prix: {totalPrice.toFixed(2)} €</div>
            </div>
            <div>
                <a href="/cart/pay"> <button className="bg-green-500 text-white px-6 py-3 rounded-md text-lg ml-4" > Valider mon panier</button></a>
            </div>
        </div>
    );
};

export default Cart;
