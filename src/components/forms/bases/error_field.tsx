// Component for displaying form field errors.
import React from 'react';

interface FieldErrorProps {
  message?: string | undefined;
}

export const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  if (!message) return null;
  return <p className="tf-error">{message}</p>;
};
