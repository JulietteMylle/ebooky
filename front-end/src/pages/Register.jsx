import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Button } from "../components/ui/button";

const Register = () => {
  const [message, setMessage] = useState("");
  const [acceptCGU, setAcceptCGU] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      if (!acceptCGU) {
        setMessage(
          "Vous devez accepter les Conditions Générales d'Utilisation pour continuer"
        );
        return;
      }
      axios
        .post("https://127.0.0.1:8000/register", values)
        .then(function (response) {
          setMessage(response.data.message);
          window.location.href = "/login";
        })
        .catch(function (error) {
          setMessage(error.response.data.message);
        });
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Veuillez entrer un nom d'utilisateur";
      }
      if (!values.email) {
        errors.email = "Veuillez entrer une adresse e-mail";
      }
      if (!values.password) {
        errors.password = "Veuillez entrer un mot de passe";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{13,}/.test(values.password)
      ) {
        errors.password =
          "Le mot de passe doit contenir au moins 13 caractères, une lettre majuscule, une lettre minuscule et un caractère spécial.";
      }
      return errors;
    },
  });

  return (
    <>
      <div className="border p-6 md:p-12 rounded-3xl mx-4 sm:mx-10 lg:mx-24 xl:mx-48 2xl:mx-96 mt-12 mb-12 bg-[url('src/assets/images/cover_img.png')] drop-shadow">
        <h2 className="text-center text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Inscription
        </h2>
        <p className="text-center text-white my-4 md:my-8">
          Vos lectures ... partout ... tout le temps !
        </p>

        <form
          className="flex flex-col border bg-[#F2F7F3] rounded-lg p-4 md:p-8"
          onSubmit={formik.handleSubmit}
        >
          <label
            className="text-center my-4 md:my-8 text-xl md:text-2xl"
            htmlFor="username"
          >
            Votre pseudo
          </label>
          <input
            className="placeholder:italic sm:text-sm mx-4 md:mx-10 border ring-3 px-2 md:px-4 py-2 h-10"
            placeholder="Entrez votre pseudo"
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.errors.username && (
            <div className="text-red-500">{formik.errors.username}</div>
          )}
          <label
            className="text-center my-4 md:my-8 text-xl md:text-2xl"
            htmlFor="email"
          >
            Votre adresse e-mail
          </label>
          <input
            className="placeholder:italic sm:text-sm mx-4 md:mx-10 border ring-3 px-2 md:px-4 py-2 h-10"
            placeholder="Entrez votre adresse mail"
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && (
            <div className="text-red-500">{formik.errors.email}</div>
          )}
          <label
            className="text-center my-4 md:my-8 text-xl md:text-2xl"
            htmlFor="password"
          >
            Votre mot de passe
          </label>
          <input
            className="placeholder:italic sm:text-sm mx-4 md:mx-10 border ring-3 px-2 md:px-4 py-2 h-10"
            placeholder="Entrez votre mot de passe"
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && (
            <div className="text-red-500">{formik.errors.password}</div>
          )}
          <div className="flex items-center mx-4 md:mx-10 my-4">
            <input
              type="checkbox"
              id="acceptCGU"
              name="acceptCGU"
              onChange={(e) => setAcceptCGU(e.target.checked)}
              className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="acceptCGU" className="text-sm text-gray-700">
              J&apos;accepte les Conditions Générales d&apos;Utilisation
            </label>
          </div>
          <Button
            className="my-4 md:my-8 mx-12 md:mx-20 text-lg md:text-xl text-[#F2F7F3] bg-[#064e3b] py-2 rounded-lg"
            type="submit"
          >
            Gooooo
          </Button>
        </form>
        {message && <p className="text-center text-red-500">{message}</p>}
        <a href="/login" className="block text-center">
          <Button className="my-4 md:my-8 mx-12 md:mx-20 text-lg md:text-xl text-[#F2F7F3] bg-[#064e3b] py-2 rounded-lg">
            J&apos;ai déjà un compte !
          </Button>
        </a>
      </div>
    </>
  );
};

export default Register;
