import React, { useState, useEffect, useContext } from 'react';
import API from '../../services/api';
import ElectionList from '../Elections/ElectionList';
import LoadingSpinner from '../common/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <p>Here are the elections available for voting:</p>
      <ElectionList elections={elections} />
    </div>
  );
};

export default VoterDashboard;