import React from 'react';

const AuroraBackground = ({ children }) => {
  return (
    <div className="w-full bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 animate-aurora"></div>
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;
