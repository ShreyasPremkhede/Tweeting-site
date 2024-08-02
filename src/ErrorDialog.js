// ErrorDialog.js
import React from 'react';

const ErrorDialog = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-dialog">
      <div className="error-dialog-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorDialog;
