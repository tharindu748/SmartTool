import React from "react";

export const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};
