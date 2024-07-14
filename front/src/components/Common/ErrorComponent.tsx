import React, { useState, useEffect } from 'react';
import { ErrorDetail, ErrorProps } from '../../interfaces/CommonInterfaces';

const Error: React.FC<ErrorProps> = ({ error }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof error.detail === 'string') {
      setErrorMessage(error.detail);
    } else if (typeof error.detail === 'object') {
      setErrorMessage(error.detail.msg);
    }
  }, [error]); // Remove error.detail.msg from the dependency array

  return (
    <div>
      {errorMessage ? (
        <p>Error Message: {errorMessage}</p>
      ) : (
        <p>No error message available.</p>
      )}
    </div>
  );
};

export default Error;