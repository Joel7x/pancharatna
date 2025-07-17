import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LogIn, UserPlus, X, LogOut } from 'lucide-react';

interface UserLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}

export default function UserLogin({ isOpen, onClose, onLoginSuccess }: UserLoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(auth.currentUser);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u && onLoginSuccess) onLoginSuccess(u);
    });
    return () => unsub();
  }, [onLoginSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg p-4 sm:p-8 max-w-xs sm:max-w-md w-full mx-2 sm:mx-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          aria-label="Close login modal"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {user ? 'Welcome!' : mode === 'login' ? 'User Login' : 'Register'}
          </h2>
          {!user && (
            <div className="text-base text-pink-600 font-semibold mb-2 flex items-center justify-center gap-1 animate-fade-in">
              <span role="img" aria-label="sparkles">✨</span>
              Sign in for a magical experience!
              <span role="img" aria-label="sparkles">✨</span>
            </div>
          )}
          <p className="text-gray-600 text-sm">
            {user ? (user.email || user.displayName) : mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        {user ? (
          <div className="text-center space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors mt-2"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors shadow"
                disabled={loading}
              >
                {mode === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors mt-2 shadow"
              disabled={loading}
            >
              <LogIn className="h-5 w-5" /> Continue with Google
            </button>
            <div className="text-center mt-3">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:underline text-sm"
              >
                {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 