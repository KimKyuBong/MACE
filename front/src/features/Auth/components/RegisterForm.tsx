import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { registerValidationSchema } from 'features/Auth/AuthValidation';
import { Modal, Button } from 'react-bootstrap';
import { RegisterFormData } from 'features/Auth/AuthInterfaces';

interface RegisterFormProps {
  onRegister: (formData: RegisterFormData) => Promise<void>;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, error }) => {
  const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      await onRegister(values);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <Formik
        initialValues={{
          school: '',
          studentId: '',
          subject: '',
          name: '',
          username: '',
          password: '',
          role: '',
        }}
        validationSchema={registerValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            {/* 폼 필드들 */}
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Register
            </button>
          </Form>
        )}
      </Formik>

      <Modal show={showErrorModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Error</Modal.Title>
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

export default RegisterForm;
