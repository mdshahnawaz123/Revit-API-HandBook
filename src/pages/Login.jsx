import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://raw.githubusercontent.com/mdshahnawaz123/plugin-access-control/main/users.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch user database.');
      
      const users = await response.json();
      const user = users.find(u => u.Username === username && u.Password === password);
      
      if (!user) {
        setError('Invalid username or password.');
        setIsLoading(false);
        return;
      }
      
      if (user.Active !== true) {
        setError('Your account has been deactivated.');
        setIsLoading(false);
        return;
      }
      
      if (user.Expires) {
        const expiryDate = new Date(user.Expires);
        if (expiryDate < new Date()) {
          setError('Your subscription plan expired on ' + user.Expires + '.');
          setIsLoading(false);
          return;
        }
      }

      // If we reach here, validation passed
      onLogin(user);
    } catch (err) {
      console.error(err);
      setError('An error occurred while connecting to the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">// REVIT API</div>
          <h2>Developer Handbook</h2>
          <p>Please sign in to access the reference chapters and plugin challenges.</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required 
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          Access is strictly regulated by the license administrator.
        </div>
      </div>
    </div>
  );
};

export default Login;
