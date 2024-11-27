import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../src/context/AuthContext'; 
import '../src/style/login.css';
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Utilisation du hook personnalisé pour accéder à la fonction login

  return (
    <div className="centered-container">
      <div className="containerlog">
        <h2 className="text-center mb-4">Connexion</h2>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object({
            email: Yup.string().email('Email invalide').required('Email requis'),
            password: Yup.string().required('Mot de passe requis'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              // Utiliser la fonction login du contexte
              await login(values.email, values.password);

              alert('Connexion réussie');
              navigate('/Profile'); 
              window.location.reload();
            } catch (error) {
              console.error('Erreur de connexion :', error);
              alert('Erreur de connexion. Veuillez réessayer.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">
                  Email :
                </label>
                <Field
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">
                  Mot de passe :
                </label>
                <Field
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Entrez votre mot de passe"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion en cours...' : 'Connexion'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
