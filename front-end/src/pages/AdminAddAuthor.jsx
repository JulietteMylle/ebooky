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
    <div>
      <h2>Ajouter un nouvel auteur</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="fullName">Nom complet :</label>
              <Field type="text" name="fullName" />
              <ErrorMessage name="fullName" component="div" />
            </div>
            <div>
              <label htmlFor="biography">Biographie :</label>
              <Field as="textarea" name="biography" />
              <ErrorMessage name="biography" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Soumettre
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddAuthorForm;
