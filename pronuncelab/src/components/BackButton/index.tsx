'use client';

import React from 'react';

const BackButton: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button 
      onClick={handleGoBack}
      style={{
        marginTop: '2rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Back to Diphthongs
    </button>
  );
};

export default BackButton;
