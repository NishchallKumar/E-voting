import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import ElectionForm from '../Elections/ElectionForm';
import CandidateForm from '../Candidates/CandidateForm';
import ElectionList from '../Elections/ElectionList';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await API.get('/elections');
        setElections(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const handleElectionCreated = (newElection) => {
    setElections([...elections, newElection]);
  };

  const handleElectionDeleted = (id) => {
    setElections(elections.filter(e => e._id !== id));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Create New Election</h3>
        <ElectionForm onSuccess={handleElectionCreated} />
      </section>

      <section>
        <h3>Add Candidate to Election</h3>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          style={{ marginBottom: '20px' }}
        >
          <option value="">Select an election</option>
          {elections.map(e => (
            <option key={e._id} value={e._id}>{e.title}</option>
          ))}
        </select>
        {selectedElectionId && <CandidateForm electionId={selectedElectionId} />}
      </section>

      <section>
        <h3>Manage Elections</h3>
        <ElectionList elections={elections} adminMode onDelete={handleElectionDeleted} />
      </section>
    </div>
  );
};

export default AdminDashboard;