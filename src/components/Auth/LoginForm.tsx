import React, { useState } from 'react';
import { Heart, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginForm() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo login
    const user = {
      id: '1',
      name: 'Sarah Johnson',
      email: formData.email,
      weddingDate: '2024-09-15',
      partner: 'Michael',
      styleProfile: {
        style: 'Classic & Elegant',
        colors: ['Blush Pink', 'Gold'],
        season: 'Fall',
        venue: 'Garden',
        budget: 25000,
        guestCount: 120
      }
    };
    
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 'dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-sage-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'landing' })}
              className="absolute top-6 left-6 p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-serif font-semibold text-gray-800">Blissful</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Continue planning your perfect wedding</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: 'signup' })}
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}