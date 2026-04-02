import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;