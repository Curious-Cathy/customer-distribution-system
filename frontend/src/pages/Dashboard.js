import React, { useEffect, useState } from 'react';
import { getAgents, createAgent, uploadCustomers } from '../api';

export default function Dashboard({ token }) {
  const [agents, setAgents] = useState([]);
  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const loadAgents = async () => {
    try {
      const data = await getAgents(token);
      setAgents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await createAgent(token, agentForm);
      setAgentForm({ name: '', email: '', mobile: '', password: '' });
      await loadAgents();
      setMessage('Agent created successfully');
    } catch (err) {
      setMessage('Error creating agent (maybe limit reached?)');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    try {
      const res = await uploadCustomers(token, file);
      setMessage(res.message + ' Total: ' + res.totalAssigned);
    } catch (err) {
      setMessage('Upload failed');
    }
  };

  return (
    <div className="dashboard-container">

      <button className="logout-btn" onClick={() => window.location.reload()}>
        Logout
      </button>

      <h2>Admin Dashboard</h2>
      {message && <p className="error">{message}</p>}

      <div className="section">
        <h3>Agents</h3>
        <ul>
          {agents.map((a) => (
            <li key={a._id}>{a.name} — {a.email} — {a.mobile}</li>
          ))}
        </ul>

        <h4>Add Agent</h4>
        <form onSubmit={handleCreateAgent}>
          <input
            placeholder="Name"
            value={agentForm.name}
            onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={agentForm.email}
            onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
          />
          <input
            placeholder="Mobile"
            value={agentForm.mobile}
            onChange={(e) => setAgentForm({ ...agentForm, mobile: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={agentForm.password}
            onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
          />
          <button type="submit">Create Agent</button>
        </form>
      </div>

      <div className="section">
        <h3>Upload Customer List</h3>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}
