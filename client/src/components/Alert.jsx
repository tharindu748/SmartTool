import React from 'react';
const Alert = ({ message, type }) => {
    const alertStyles = {
      success: 'bg-green-100 text-green-700',
      error: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700',
    };
  
    return (
      <div className={`p-4 mt-4 rounded-lg ${alertStyles[type] || alertStyles.error}`}>
        {message}
      </div>
    );
  };
export default Alert;