import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ name: '', gender: '', birthdate: '' });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/users/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/users', formData);
      }
      setFormData({ name: '', gender: '', birthdate: '' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      alert('Error submitting form');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users');
      setUsers(res.data);
    } catch (err) {
      alert('Error fetching users');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      gender: user.gender,
      birthdate: user.birthdate.slice(0, 10)
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="App">
      <h1>Simple User Form</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Gender:
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Male" onChange={handleChange} checked={formData.gender === 'Male'} /> Male</label>
            <label><input type="radio" name="gender" value="Female" onChange={handleChange} checked={formData.gender === 'Female'} /> Female</label>
            <label><input type="radio" name="gender" value="Other" onChange={handleChange} checked={formData.gender === 'Other'} /> Other</label>
          </div>
        </label>

        <label>
          Birthdate:
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
        </label>

        <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
        <button type="button" onClick={fetchUsers} style={{ marginLeft: '10px' }}>Show</button>
      </form>

      {users.length > 0 && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.gender}</td>
                <td>{u.birthdate.slice(0, 10)}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u.id)} className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
