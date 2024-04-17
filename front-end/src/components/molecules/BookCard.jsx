// import { useEffect } from "react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BookCard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:8000/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des livres :", error);
      });
  }, []);

  // return (
  //   <div className="flex m-8">
  //     <div className=" flex flex-col ">

  //       <img
  //         src="public/images/couverture-hp.png"
  //         className="w-60 h-80 flex flex-row pb-3"
  //         alt=""
  //       />
  //       <div className="flex flex-row justify-between font-bold pb-1.5">
  //         <p>Nom du livre :{book.title}</p>
  //         <p>20$</p>
  //       </div>
  //       <div>
  //         <p className="text-sm">Auteur</p>
  //       </div>
  //       <Button className="m-5">Ajouter au panier</Button>
  //     </div>
  //   </div>
  // );

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>
          <div>{book.author}</div>
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
        </div>
      ))}
    </div>
  );
}
