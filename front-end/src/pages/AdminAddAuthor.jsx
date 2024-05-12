import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

function AddAuthorForm() {
  const initialValues = {
    fullName: "",
    biography: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("https://localhost:8000/admin/addAuthor", values);
      console.log("Response:", response.data);
      // Gérer la réponse ici, par exemple, afficher un message de succès ou rediriger l'utilisateur
    } catch (error) {
      console.error("Error:", error.response.data);
      // Gérer l'erreur ici, par exemple, afficher un message d'erreur à l'utilisateur
    } finally {
      setSubmitting(false);
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.fullName) {
      errors.fullName = "Le nom complet est requis";
    }
    if (!values.biography) {
      errors.biography = "La biographie est requise";
    }
    return errors;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter un nouvel auteur</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block mb-2">Nom complet :</label>
              <Field
                type="text"
                name="fullName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage name="fullName" component="div" className="text-red-500" />
            </div>
            <div>
              <label htmlFor="biography" className="block mb-2">Biographie :</label>
              <Field
                as="textarea"
                name="biography"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage name="biography" component="div" className="text-red-500" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md transition-opacity duration-300 ease-in-out hover:bg-blue-600 hover:text-opacity-90 focus:outline-none focus:bg-blue-600 focus:text-opacity-90"
            >
              Soumettre
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddAuthorForm;
