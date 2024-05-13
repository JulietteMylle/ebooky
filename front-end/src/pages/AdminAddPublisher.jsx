import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";


function AdminAddPublisher() {
    const initialValues = {
        name: "",
        details: "",
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const token = localStorage.getItem("session");
            const parsedTokenObject = JSON.parse(token);
            const tokenValue = parsedTokenObject.token;

            const response = await axios.post("https://localhost:8000/admin/addPublisher", {
                headers: { Authorization: "Bearer " + tokenValue }
            }, values);
            console.log("Response: ", response.data);
        } catch (error) {
            console.error("Error:", error.response.data);
        } finally {
            setSubmitting(false);
        }
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Le nom de la maison édition est requis';
        }
        if (!values.details) {
            errors.details = "Il faut une description";
        }
        return errors
    };

    return (
        <div>
            <h2>Ajouter une nouvelle maison d'édition</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={validate}
            >

                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="name">Nom</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" />
                        </div>
                        <div>
                            <label htmlFor="details"> Détails : </label>
                            <Field as="textarea" name="details" />
                            <ErrorMessage name="details" component="div" />
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

export default AdminAddPublisher;