import { useState, useEffect } from "react";
import axios from "axios";
import Rating from "react-rating-stars-component";

const CommentsComponent = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("session");
    const parsedTokenObject = JSON.parse(token);
    const tokenValue = parsedTokenObject.token;
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "https://localhost:8000/profileComments",
          {
            headers: { Authorization: "Bearer " + tokenValue },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (commentId) => {
    try {
      // Récupérer le token d'authentification stocké
      const token = localStorage.getItem("session");
      const parsedTokenObject = JSON.parse(token);
      const tokenValue = parsedTokenObject.token;

      const response = await axios.delete(
        "https://localhost:8000/delete_comment",
        {
          data: { comment_id: commentId },
          headers: {
            Authorization: `Bearer ${tokenValue}`,
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
          },
        }
      );
      if (response.data.message === "Commentaire supprimé avec succès") {
        console.log("Le commentaire a bien été supprimé");

        const updatedComments = comments.filter(
          () => comments.id !== commentId
        );
        setComments(updatedComments);
        console.log(updatedComments);
      }
    } catch (error) {
      console.log("Problème lors de la suppression du commentaire");
    }
  };

  return (
    <div className="flex">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white shadow-md rounded-lg p-4 mb-4 w-90 m-4"
        >
          <div className="grid items-center justify-between mb-2">
            <Rating
              count={5}
              size={24}
              value={comment.rate}
              edit={false}
              activeColor="#ffd700"
            />
            <h3 className="text-lg font-bold">{comment.ebook_title}</h3>
          </div>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-sm text-gray-500">{comment.date}</p>
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="text-red-500 hover:text-red-700"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};
export default CommentsComponent;
