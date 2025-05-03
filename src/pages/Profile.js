import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(res.data);
      setFormData({
        name: res.data.name,
        username: res.data.username,
        email: res.data.email || '',
        phone: res.data.phone || '',
        password: '',
      });
    } catch (error) {
      setError('Failed to load profile. Please try again.');
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(res.data);
      setUser({ ...user, ...res.data });
      setSuccess('Profile updated successfully!');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
      setSuccess(null);
    }
  };

  if (!user) return <div className="container mx-auto p-6">Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Profile</h1>
      {error && <p className="alert alert-error mb-6">{error}</p>}
      {success && <p className="alert bg-green-100 text-green-800 border-l-4 border-green-500 mb-6">{success}</p>}
      {profile ? (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary w-full p-3 text-lg">
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-600">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;