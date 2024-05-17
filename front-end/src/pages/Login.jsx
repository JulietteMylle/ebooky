import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      axios
        .post("https://localhost:8000/login", values)
        .then(function (response) {
          const responseDataString = JSON.stringify(response.data);
          window.localStorage.setItem("session", responseDataString);
          const decodedToken = jwtDecode(response.data.token);
          console.log(decodedToken);

          // Redirigez l'utilisateur en fonction de son rôle après la connexion réussie
          if (decodedToken.role.includes("ROLE_ADMIN")) {
            navigate("/admin/profile");
          } else {
            navigate("/profile");
          }
        })
        .catch(function (error) {
          setMessage(error.response.data.message);
        });
    },
  });

  return (
    <div className="border p-6 md:p-12 rounded-3xl mx-4 sm:mx-10 lg:mx-24 xl:mx-48 2xl:mx-96 mt-12 mb-12 bg-[url('src/assets/images/cover_img.png')] drop-shadow">
      <h2 className="text-center text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        Connexion
      </h2>
      <form
        className="flex flex-col border bg-[#F2F7F3] rounded-lg m-4 p-4"
        onSubmit={formik.handleSubmit}
      >
        <label
          className="text-center my-4 md:my-8 text-xl md:text-2xl"
          htmlFor="email"
        >
          Votre adresse e-mail
        </label>
        <input
          className="placeholder:italic sm:text-sm mx-4 md:mx-10 border ring-3 px-2 md:px-4 py-2 h-10"
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <label
          className="text-center my-4 md:my-8 text-xl md:text-2xl"
          htmlFor="password"
        >
          Votre mot de passe
        </label>
        <input
          className="placeholder:italic sm:text-sm mx-4 md:mx-10 border ring-3 px-2 md:px-4 py-2 h-10"
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <button
          className="my-4 md:my-8 mx-12 md:mx-20 text-lg md:text-xl text-[#F2F7F3] bg-[#064e3b] py-2 rounded-lg"
          type="submit"
        >
          Se connecter
        </button>
      </form>
      {message && (
        <p className="text-center text-red-400 text-lg md:text-2xl">
          {message}
        </p>
      )}
      <Link
        to={`/resetPassword`}
        className="mt-4 bg-gray-200 hover:bg-gray-300 text-[#F2F7F3] font-semibold py-2 px-4 rounded-md flex items-center justify-center"
        style={{ backgroundColor: "#064E3B" }}
      >
        Vous avez oublié votre mot de passe ?
      </Link>
    </div>
  );
}
export default Login;
