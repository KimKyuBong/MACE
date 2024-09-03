import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from 'features/Auth/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginValidationSchema } from 'features/Auth/AuthValidation';
import { Modal, Button } from 'react-bootstrap';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await onLogin(values.username, values.password);
      navigate('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label htmlFor="username">Username</label>
              <Field type="email" name="username" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Login
            </button>
          </Form>
        )}
      </Formik>

      <Modal show={showErrorModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginForm;
