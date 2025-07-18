import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

interface SecureAdminAuthProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

// Add your admin UID here
const ADMIN_UID = 'OyY3lYf1ZVRBfnfZhykSGax8FnE2';

function SecureAdminAuth({ isAdmin, setIsAdmin }: SecureAdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_UID) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [setIsAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the logged-in user is the admin
      if (userCredential.user.uid === ADMIN_UID) {
        setIsAdmin(true);
        setError('');
      } else {
        // Not the admin user
        await signOut(auth);
        setError('Access denied. Only authorized admin can login.');
      }
    } catch (error: any) {
      setError('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
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
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 3s infinite'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
                🎉 Welcome, Admin!
              </h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                You're now managing the shop
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👑
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '15px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '30px',
      borderRadius: '20px',
      marginBottom: '30px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          fontSize: '32px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          🔐
        </div>
        <h2 style={{ 
          margin: '0 0 10px 0', 
          color: '#2d3748', 
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Admin Access
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Sign in to manage your shop inventory
        </p>
      </div>

      <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin email"
            required
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '15px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {isLoading ? '🔐 Signing in...' : '🚀 Sign In'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
          borderRadius: '12px',
          border: '1px solid #feb2b2',
          color: '#c53030',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

export default SecureAdminAuth; 