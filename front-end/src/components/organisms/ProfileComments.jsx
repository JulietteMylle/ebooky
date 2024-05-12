import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from "react-rating-stars-component";


const CommentsComponent = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;
        const fetchComments = async () => {
            try {
                const response = await axios.get("https://localhost:8000/profileComments", {
                    headers: { Authorization: "Bearer " + tokenValue },
                  });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

return (
    <div>
        {comments.map((comment) => (
            <div key={comment.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{comment.ebook_title}</h3>
                <Rating
                  count={5}
                  size={24}
                  value={comment.rate}
                  edit={false}
                  activeColor="#ffd700"
                />
              </div>
              <p className="text-gray-700">{comment.content}</p>
              <p className="text-sm text-gray-500">{comment.date}</p>
            </div>
          ))}
    </div>
);
}
export default CommentsComponent;