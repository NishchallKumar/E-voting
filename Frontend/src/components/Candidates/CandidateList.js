import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const CandidateList = ({ electionId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get(`/candidates/election/${electionId}`);
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [electionId]);

  if (loading) return <p>Loading candidates...</p>;

  if (!candidates.length) return <p>No candidates added yet.</p>;

  return (
    <div>
      <h4>Candidates</h4>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate._id}>
            {candidate.name} {candidate.party && `(${candidate.party})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;