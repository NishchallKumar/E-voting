import React, { useState } from 'react';
import API from '../../services/api';
import Alert from '../common/Alert';

const ElectionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { title, description, startDate, endDate } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/elections', formData);
      onSuccess(res.data);
      setFormData({ title: '', description: '', startDate: '', endDate: '' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Title</label>
        <input type="text" name="title" value={title} onChange={onChange} required />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" value={description} onChange={onChange} rows="3" />
      </div>
      <div>
        <label>Start Date</label>
        <input type="datetime-local" name="startDate" value={startDate} onChange={onChange} required />
      </div>
      <div>
        <label>End Date</label>
        <input type="datetime-local" name="endDate" value={endDate} onChange={onChange} required />
      </div>
      <Alert message={error} />
      <button type="submit" disabled={loading}>Create Election</button>
    </form>
  );
};

export default ElectionForm;