import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      login(res.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Register</h1>
      {error && <p className="alert alert-error mb-6">{error}</p>}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="form-label">Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Phone Number (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full p-3 text-lg">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;