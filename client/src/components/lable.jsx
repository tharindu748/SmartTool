// Label.jsx
import React from 'react';

const Label = ({ value, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold">
      {value}
    </label>
  );
};

export default Label;