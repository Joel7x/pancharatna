import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminAuthProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

function AdminAuth({ isAdmin, setIsAdmin }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
      setError('');
    } catch (error: any) {
      setError('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  if (isAdmin) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#e8f5e8' }}>
        <p>Admin logged in</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '10px', backgroundColor: '#fff3cd' }}>
      <h3>Admin Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AdminAuth; 