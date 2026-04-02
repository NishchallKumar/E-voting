import React from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const ElectionCard = ({ election, adminMode = false, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${election.title}"?`)) {
      try {
        await API.delete(`/elections/${election._id}`);
        onDelete(election._id);
      } catch (err) {
        console.error(err);
        alert('Failed to delete election');
      }
    }
  };

  const getStatusBadge = () => {
    switch (election.status) {
      case 'upcoming':
        return <span style={{ background: '#ffc107', color: '#333', padding: '2px 8px', borderRadius: '4px' }}>Upcoming</span>;
      case 'active':
        return <span style={{ background: '#28a745', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>Active</span>;
      case 'ended':
        return <span style={{ background: '#6c757d', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>Ended</span>;
      default:
        return null;
    }
  };

  return (
    <div className="card">
      <h3>{election.title}</h3>
      <p>{election.description}</p>
      <p>
        <strong>Start:</strong> {new Date(election.startDate).toLocaleString()}<br />
        <strong>End:</strong> {new Date(election.endDate).toLocaleString()}
      </p>
      <p>Status: {getStatusBadge()}</p>
      {!adminMode && (
        <>
          {election.status === 'active' && (
            <Link to={`/vote/${election._id}`}>
              <button>Vote Now</button>
            </Link>
          )}
          {election.status === 'ended' && (
            <Link to={`/results/${election._id}`}>
              <button>View Results</button>
            </Link>
          )}
        </>
      )}
      {adminMode && (
        <>
          <Link to={`/results/${election._id}`}>
            <button>View Results</button>
          </Link>
          <button onClick={handleDelete} style={{ background: '#dc3545' }}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ElectionCard;