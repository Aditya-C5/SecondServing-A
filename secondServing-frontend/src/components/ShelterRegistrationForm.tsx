import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShelterData } from '../types';
import { registerShelter } from '../api/auth';

const ShelterRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShelterData>({
    name: '',
    location: '',
    volunteerEmails: [''],
    password: '',
    contactNumber: '',
    role: 'receiver'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVolunteerEmailChange = (index: number, value: string) => {
    const updatedEmails = [...formData.volunteerEmails];
    updatedEmails[index] = value;
    setFormData({ ...formData, volunteerEmails: updatedEmails });
  };

  const addVolunteerEmail = () => {
    setFormData({
      ...formData,
      volunteerEmails: [...formData.volunteerEmails, '']
    });
  };

  const removeVolunteerEmail = (index: number) => {
    if (formData.volunteerEmails.length > 1) {
      const updatedEmails = [...formData.volunteerEmails];
      updatedEmails.splice(index, 1);
      setFormData({ ...formData, volunteerEmails: updatedEmails });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await registerShelter(formData);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 space-container">
      <div className="max-w-md w-full backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 space-header">Register as a Shelter</h1>
          <p className="text-gray-600 mt-2 space-subheader">Join SecondServing to receive food donations</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Shelter Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input placeholder-gray-500"
              placeholder="Full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volunteer Emails
            </label>
            {formData.volunteerEmails.map((email, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleVolunteerEmailChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input placeholder-gray-500"
                  placeholder="volunteer@example.com"
                />
                <button
                  type="button"
                  onClick={() => removeVolunteerEmail(index)}
                  className="ml-2 px-2 text-red-500 hover:text-red-700"
                  disabled={formData.volunteerEmails.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVolunteerEmail}
              className="text-sm text-teal-800 hover:text-teal-900"
            >
              + Add another email
            </button>
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input"
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shelter-input"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 disabled:bg-gray-400 glow-effect space-button-ghost"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link
              to="/login?type=shelter"
              className="text-teal-800 hover:text-teal-900 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShelterRegistrationForm;