import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Rating from 'react-rating-stars-component';

const EbookDetails = () => {
    const { id } = useParams();
    const [ebook, setEbook] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const token = localStorage.getItem("session");
    let tokenValue = '';

    if (token) {
        const parsedTokenObject = JSON.parse(token);
        tokenValue = parsedTokenObject.token;
    }

    const addToCart = async (ebookId) => {
        try {
            const response = await axios.post(`https://localhost:8000/add_panier/${ebookId}`, {}, { headers: { Authorization: "Bearer " + tokenValue } });
            console.log(response.data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    useEffect(() => {
        const fetchEbookDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:8000/ebooks/${id}`);
                setEbook(response.data);
            } catch (error) {
                console.error('Error fetching ebook details:', error);
            }
        };

        fetchEbookDetails();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`https://localhost:8000/ebooks/${id}/comments`);
                setComments(response.data);
                
                const totalRating = response.data.reduce((acc, curr) => acc + curr.rate, 0);
                const avgRating = totalRating / response.data.length;
                setAverageRating(avgRating);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [id]);

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;
            await axios.post(
                `https://localhost:8000/ebooks/${id}/newComment`,
                { content: comment, rate: rating },
                { headers: { Authorization: "Bearer " + tokenValue } }
            );
            setComment('');
            setRating(0);

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    if (!ebook) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden my-4">
                <div className="flex flex-col md:flex-row">
                    <div className="p-4 md:w-1/2">
                        <h2 className="text-2xl font-bold mb-2">{ebook.title}</h2>
                        <p className="text-gray-600 mb-2">Prix: {ebook.price} €</p>
                        <p className="text-gray-600 mb-2">Auteurs: {ebook.authors.join(', ')}</p>
                        <p className="text-gray-800">{ebook.description}</p>
                        {ebook.publisher && <p className="text-gray-600">Maison dédition: {ebook.publisher}</p>}
                        <div>
                            Note moyenne : 
                            <Rating
                                value={averageRating}
                                size={20}
                                activeColor="#ffd700"
                                edit={false}
                            />
                        </div>
                        <button 
                            onClick={() => addToCart(ebook.id)} 
                            style={{ backgroundColor: '#054E3B' }}
                            className="bg-054E3B text-white py-2 px-4 mt-4 rounded-md hover:bg-opacity-90 hover:text-opacity-90"
                        >
                            Ajouter au panier
                        </button>
                    </div>
                    <div className="md:w-1/2">
                        <img src={`${ebook.picture}`} alt={ebook.title} className="w-full h-auto rounded-md" />
                    </div>
                    
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmitComment}>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Ajouter un commentaire..."
                            rows="4"
                            value={comment}
                            onChange={handleCommentChange}
                        ></textarea>
                        <Rating
                            count={5}
                            value={rating}
                            onChange={handleRatingChange}
                            size={24}
                            activeColor="#ffd700"
                            emptyIcon={<i className="far fa-star"></i>}
                            fullIcon={<i className="fas fa-star"></i>}
                        />
                        <button
                        style={{ backgroundColor: '#054E3B' }}
                            className=" text-white py-2 px-4 mt-2 rounded-md hover:bg-opacity-90 hover:text-opacity-90"
                            type="submit"
                        >
                            Soumettre
                        </button>
                    </form>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Commentaires:</h3>
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.id} className="mb-4">
                                    <div className="border rounded-md p-4">
                                        <p className="text-gray-500">
                                            {new Date(comment.date.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="font-semibold">{comment.username}</p>
                                        <p className="text-gray-600">{comment.content}</p>
                                        {comment.rate && (
                                            <div>
                                                Note : 
                                                <Rating
                                                    value={comment.rate}
                                                    size={20}
                                                    activeColor="#ffd700"
                                                    edit={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EbookDetails;
