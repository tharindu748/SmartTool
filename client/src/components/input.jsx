import React from "react";

export const Input = ({ ...props }) => (
  <input
    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);
