import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const ResultsPage = () => {
  const { electionId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/votes/results/${electionId}`);
        setResults(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [electionId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert message={error} />;
  if (!results) return null;

  const { election, candidates, totalVotes, winner } = results;

  return (
    <div>
      <h2>{election.title} - Results</h2>
      <p>{election.description}</p>
      <p><strong>Total Votes Cast:</strong> {totalVotes}</p>
      {winner && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>
          <h3>Winner: {winner.name} {winner.party && `(${winner.party})`}</h3>
          <p>Votes: {winner.voteCount} ({((winner.voteCount / totalVotes) * 100).toFixed(1)}%)</p>
        </div>
      )}
      <h3>All Candidates</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Candidate</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Party</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Votes</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.party || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{candidate.voteCount}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;