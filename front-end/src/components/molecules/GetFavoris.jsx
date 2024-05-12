// import { useState, useEffect } from "react";
// import axios from "axios";

// function GetFavorites() {
//   const [favorites, setFavorites] = useState([]);

//   useEffect(() => {
//     const fetchFavoritesBooks = async () => {
//       try {
//         const token = localStorage.getItem("session");
//         const parsedTokenObject = JSON.parse(token);
//         const tokenValue = parsedTokenObject.token;

//         const response = await axios.get(
//           "https://localhost:8000/userlibrary_favorites",
//           {
//             headers: { Authorization: `Bearer ${tokenValue}` },
//           }
//         );

//         // Filtrer les favoris avec is_favorite égal à true
//         const favoritesWithTrueFlag = response.data.favorites.filter(
//           (item) => item.is_favorite === true
//         );

//         // Récupérer les ids des livres favoris
//         const bookIds = favoritesWithTrueFlag.map((item) => item.id);

//         // Récupérer les informations détaillées de chaque livre
//         const promises = bookIds.map((id) =>
//           axios.get(`https://localhost:8000/books/${id}`)
//         );

//         const bookDetails = await Promise.all(promises);

//         // Mettre à jour les détails des livres dans l'état
//         const updatedFavorites = bookDetails.map((response) => response.data);

//         setFavorites(updatedFavorites);
//       } catch (error) {
//         console.error(
//           "Erreur lors de la récupération des livres de la bibliothèque :",
//           error
//         );
//       }
//     };

//     fetchFavoritesBooks();
//   }, []);

//   const removeFromFavorites = async (id) => {
//     try {
//       const token = localStorage.getItem("session");
//       const parsedTokenObject = JSON.parse(token);
//       const tokenValue = parsedTokenObject.token;

//       await axios.patch(`https://localhost:8000/userlibrary_remove_favorite`, {
//         data: { ebook_id: id },

//         headers: {
//           Authorization: `Bearer ${tokenValue}`,
//         },
//       });

//       // Mettre à jour la liste des favoris après suppression
//       const updatedFavorites = favorites.filter(
//         (favorite) => favorite.id !== id
//       );
//       setFavorites(updatedFavorites);
//     } catch (error) {
//       console.error(
//         "Erreur lors de la suppression du livre des favoris :",
//         error
//       );
//     }
//   };

//   return (
//     <div className="container mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Liste des favoris</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {favorites.map((favorite) => (
//           <div
//             key={favorite.id}
//             className="p-4 border border-gray-200 rounded shadow-md "
//           >
//             <h3 className="text-xl font-semibold mb-2">{favorite.title}</h3>
//             <p className="text-gray-700 mb-4">{favorite.author}</p>
//             {favorite.picture && (
//               <img
//                 src={favorite.picture}
//                 alt="Couverture du livre"
//                 className="w-full h-auto rounded mx-auto "
//               />
//             )}
//             <button
//               onClick={() => removeFromFavorites(favorite.id)}
//               className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
//             >
//               Retirer des favoris
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default GetFavorites;
import { useState, useEffect } from "react";
import axios from "axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavoritesBooks = async () => {
      try {
        const token = localStorage.getItem("session");
        const parsedTokenObject = JSON.parse(token);
        const tokenValue = parsedTokenObject.token;
        console.log(tokenValue);
        // const response = await axios.get("https://localhost:8000/favorites", {
        //   headers: {
        //     Authorization: `Bearer ${tokenValue}`,
        //   },
        // });
        const response = await axios.get("https://localhost:8000/favorites", {
          headers: { Authorization: "Bearer " + tokenValue },
        });
        const bookIds = response.data.items.map((item) => item.id);
        const promises = bookIds.map((id) =>
          axios.get(`https://localhost:8000/books/${id}`)
        );

        const bookDetails = await Promise.all(promises);

        const updatedFavorites = bookDetails.map((response) => response.data);
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Impossible de récupérer les favoris : ", error);
      }
    };
    fetchFavoritesBooks();
  }, []);

  //   const removeFromFavorites = (ebookId) => {
  //     axios
  //       .post(`https://localhost:8000/remove_favorites/${ebookId}`)
  //       .then((response) => {
  //         alert("Favorite removed successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Failed to remove favorite:", error);
  //       });
  //   };

  return (
    <div>
      <h1>My Favorites</h1>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <li key={favorite.ebookId}>
              {favorite.title} -{" "}
              {favorite.isFavorite ? "Favorite" : "Not Favorite"}
              {/* <button onClick={() => removeFromFavorites(favorite.ebookId)}>
                Remove
              </button> */}
            </li>
          ))
        ) : (
          <p>No favorites added yet.</p>
        )}
      </ul>
    </div>
  );
}

export default Favorites;
