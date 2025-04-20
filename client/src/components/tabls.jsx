import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export const Tabs = ({ defaultValue, children, className }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ value, children }) => {
  const { value: activeValue, setValue } = useContext(TabsContext);
  const isActive = value === activeValue;

  return (
    <button
      className={`px-4 py-2 font-medium border rounded-md ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }) => {
  const { value: activeValue } = useContext(TabsContext);
  return value === activeValue ? <div>{children}</div> : null;
};
