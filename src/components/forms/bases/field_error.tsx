import React from 'react';

interface FieldErrorProps {
  message?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-xs text-rose-400 mt-1 flex items-center space-x-1 animate-fadeIn">
      <span>{message}</span>
    </p>
  );
};