import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const strength = calculateStrength();
  const strengthText = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong'
  ][strength];

  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-green-600'
  ][strength];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-full ${i < strength ? strengthColor : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Password strength: <span className={`font-medium ${strength < 2 ? 'text-red-500' : strength < 4 ? 'text-yellow-500' : 'text-green-500'}`}>
          {strengthText}
        </span>
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;