// src/App.js
import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import "./styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (t) => {
    localStorage.setItem('token', t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <Dashboard token={token} />
    </div>
  );
}

export default App;
