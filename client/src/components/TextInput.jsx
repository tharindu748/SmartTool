import React from 'react';

const TextInput = ({ id, type, placeholder, onChange }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      onChange={onChange} // this triggers the handleChange function
      className="border px-4 py-2 rounded-md w-full"
    />
  );
};

export default TextInput;
