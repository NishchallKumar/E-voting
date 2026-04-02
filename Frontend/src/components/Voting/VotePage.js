import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const VotePage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [electionRes, candidatesRes] = await Promise.all([
          API.get(`/elections/${electionId}`),
          API.get(`/candidates/election/${electionId}`)
        ]);
        setElection(electionRes.data);
        setCandidates(candidatesRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [electionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.post('/votes', { electionId, candidateId: selectedCandidate });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!election) return <p>Election not found.</p>;
  if (election.status !== 'active') return <p>This election is not active for voting.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{election.title}</h2>
      <p>{election.description}</p>
      <form onSubmit={handleSubmit}>
        {candidates.map(candidate => (
          <div key={candidate._id} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="candidate"
                value={candidate._id}
                checked={selectedCandidate === candidate._id}
                onChange={() => setSelectedCandidate(candidate._id)}
                style={{ width: 'auto', marginRight: '10px' }}
              />
              <strong>{candidate.name}</strong> {candidate.party && `(${candidate.party})`}
            </label>
          </div>
        ))}
        <Alert message={error} />
        <button type="submit" disabled={submitting}>Cast Vote</button>
      </form>
    </div>
  );
};

export default VotePage;