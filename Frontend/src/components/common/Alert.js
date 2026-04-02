import React from 'react';

const Alert = ({ message, type = 'error' }) => {
  if (!message) return null;
  const color = type === 'error' ? 'red' : 'green';
  return (
    <div style={{ padding: '10px', marginBottom: '10px', borderRadius: '4px', backgroundColor: color, color: '#fff', textAlign: 'center' }}>
      {message}
    </div>
  );
};

export default Alert;