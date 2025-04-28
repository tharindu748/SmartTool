// src/components/tooltip.jsx
import React, { useState } from 'react';

export const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [active, setActive] = useState(false);
  let timeout;

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div className={`absolute z-50 w-max max-w-xs px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg ${positionClasses[position]}`}>
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
            'left-[-4px] top-1/2 -translate-y-1/2'
          }`} />
          {content}
        </div>
      )}
    </div>
  );
};

// Make sure to export as named export
export default Tooltip;