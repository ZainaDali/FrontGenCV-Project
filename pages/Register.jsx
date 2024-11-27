import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import '../src/style/Login.css';

function Register() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object({
        firstname: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
        lastname: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Required')
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'An error occurred');
          }

          alert('Registration successful!');
          navigate('/login');
        } catch (error) {
          console.error('Failed to register:', error);
          alert('Registration failed. Please try again.');
        } finally {
          setSubmitting(false); // Réactive le bouton après soumission
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="firstname">Prénom :</label>
            <Field className="form-control" type="text" name="firstname" />
            <ErrorMessage style={{ color: 'red' }} name="firstname" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Nom :</label>
            <Field className="form-control" type="text" name="lastname" />
            <ErrorMessage style={{ color: 'red' }} name="lastname" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <Field className="form-control" type="email" name="email" />
            <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <Field className="form-control" type="password" name="password" />
            <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmation du mot de passe :</label>
            <Field className="form-control" type="password" name="confirmPassword" />
            <ErrorMessage style={{ color: 'red' }} name="confirmPassword" component="div" />
          </div>
          <button className="btn btn-primary mt-3" type="submit" disabled={isSubmitting}>
            Inscription
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Register;

