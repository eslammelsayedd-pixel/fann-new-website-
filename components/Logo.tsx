import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 120"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="square">
      {/* Main structure */}
      <path d="M95 5 H 5 V 95" /> {/* Outer L-shape */}
      <path d="M5 45 H 55" /> {/* Middle horizontal bar */}
      <path d="M30 5 V 65" /> {/* Inner vertical bar */}
      <path d="M55 45 V 65 H 30" /> {/* Small box */}
      
      {/* Right side structure */}
      <path d="M55 5 H 95 V 65 L 75 85 H 55 V 65" />
      <path d="M75 65 V 85" /> {/* Vertical line in glass facade */}
      
      {/* Small squares */}
      <rect x="36" y="70" width="8" height="5" fill="currentColor" stroke="none" />
      <rect x="36" y="79" width="8" height="5" fill="currentColor" stroke="none" />
      <rect x="36" y="88" width="8" height="5" fill="currentColor" stroke="none" />
    </g>
    <text
      x="50"
      y="115"
      fontFamily="Inter, sans-serif"
      fontSize="24"
      fontWeight="600"
      letterSpacing="4"
      textAnchor="middle"
      fill="currentColor"
    >
      FANN
    </text>
  </svg>
);

export default Logo;
