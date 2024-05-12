
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="border p-12 rounded-3xl m-96 mt-12 mb-12">
      <h2 className="text-center my-12 text-6xl">Connexion</h2>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={formik.handleSubmit}
      >
        <label className="text-center my-8 text-2xl" htmlFor="email">
          Votre adresse e-mail
        </label>
        <input
          className="h-16 rounded-sm w-1/2 "
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <label className="text-center my-8 text-2xl " htmlFor="password">
          Votre mot de passe
        </label>
        <input
          className=" h-16 rounded-sm w-1/2 "
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <button
          className="my-8 text-2xl border w-80 h-20 rounded-lg bg-primary text-white hover:bg-transparent hover:text-black"
          type="submit"
        >
          Se connecter
        </button>
      </form>
      {message && (
        <p className="text-center text-red-400 text-2xl ">{message}</p>
      )}
    </div>
  );

}
export default Login;
