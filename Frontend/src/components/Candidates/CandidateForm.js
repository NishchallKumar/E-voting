import React, { useState } from 'react';
import API from '../../services/api';
import Alert from '../common/Alert';

const CandidateForm = ({ electionId }) => {
  const [formData, setFormData] = useState({ name: '', party: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, party } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/candidates', { ...formData, electionId });
      setFormData({ name: '', party: '' });
      setSuccess('Candidate added successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Candidate Name</label>
        <input type="text" name="name" value={name} onChange={onChange} required />
      </div>
      <div>
        <label>Party (Optional)</label>
        <input type="text" name="party" value={party} onChange={onChange} />
      </div>
      <Alert message={error} />
      {success && <Alert message={success} type="success" />}
      <button type="submit" disabled={loading}>Add Candidate</button>
    </form>
  );
};

export default CandidateForm;