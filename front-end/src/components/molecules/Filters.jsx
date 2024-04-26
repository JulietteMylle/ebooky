import { useState } from "react";
import { Link } from "react-router-dom";

function Filter({ authors, handleFilter, categories }) {
  const [titleFilter, setTitleFilter] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setTitleFilter(value);
    handleFilter({ title: value });
  };

  return (
    <div>
      <label htmlFor="author">Filtrer par auteur :</label>

      {/* Pour les auteurs  */}
      <select
        id="author"
        onChange={(e) => handleFilter({ author: e.target.value })}
      >
        <option value="">Tous les auteurs</option>
        {authors
          .reduce((uniqueAuthors, author) => {
            // Vérifie si l'auteur est déjà présent dans la liste
            if (
              !uniqueAuthors.find((item) => item.fullName === author.fullName)
            ) {
              uniqueAuthors.push(author);
            }
            return uniqueAuthors;
          }, [])
          .map((author, index) => (
            <option key={index} value={author.fullName}>
              {author.fullName}
            </option>
          ))}
      </select>
      {/* Pour les categories  */}
      <select
        id="category"
        onChange={(e) => handleFilter({ category: e.target.value })}
      >
        <option value="">Toutes les catégories</option>
        {categories
          .reduce((uniqueCategories, category) => {
            // Vérifie si la catégorie est déjà présente dans la liste
            if (!uniqueCategories.find((item) => item.name === category.name)) {
              uniqueCategories.push(category);
            }
            return uniqueCategories;
          }, [])
          .map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
      </select>

      <label htmlFor="title">Filtrer par titre :</label>
      <input
        type="text"
        id="title"
        value={titleFilter}
        onChange={handleChange}
        placeholder="Entrez le titre..."
      />
      <Link
        to="/mylibrary"
        className="inline-block border text-black py-2 px-4 rounded-full no-underline"
      >
        Voir mes favoris
      </Link>
    </div>
  );
}

export default Filter;
