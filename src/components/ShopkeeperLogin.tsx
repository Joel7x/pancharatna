import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, X } from 'lucide-react';

interface ShopkeeperLoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onClose: () => void;
}

export default function ShopkeeperLogin({ onLogin, onClose }: ShopkeeperLoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded users for demo
  const users = [
    { username: 'toysmanager', password: 'toys123', role: 'toys' },
    { username: 'stationarymanager', password: 'stationary123', role: 'stationary' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    if (user) {
      onLogin({ ...credentials, role: user.role });
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 sm:p-8 max-w-xs sm:max-w-md w-full mx-2 sm:mx-4">
        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Shopkeeper Login</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Login as Toys or Stationary Manager</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Show Password</span>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="flex space-x-3 justify-between">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel"
              className="flex-1 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors text-xl"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="submit"
              aria-label="Login"
              className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-xl"
            >
              <LogIn className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}