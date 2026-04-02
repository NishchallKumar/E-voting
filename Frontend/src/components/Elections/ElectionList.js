import React from 'react';
import ElectionCard from './ElectionCard';

const ElectionList = ({ elections, adminMode = false, onDelete }) => {
  if (!elections.length) {
    return <p>No elections found.</p>;
  }

  return (
    <div className="election-grid">
      {elections.map(election => (
        <ElectionCard
          key={election._id}
          election={election}
          adminMode={adminMode}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ElectionList;