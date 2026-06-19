import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authLogin, authRegister } from '../services/taskService';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerMode, setRegisterMode] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const fn = registerMode ? authRegister : authLogin;
      const res = await fn({ username, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.username || username);
        if (onLogin) onLogin(res.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <div className="card card-custom p-4 mx-auto" style={{maxWidth:520}}>
      <h3 className="mb-3">{registerMode ? 'Register' : 'Login'}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">{registerMode ? 'Register' : 'Login'}</button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setRegisterMode((s) => !s)}>{registerMode ? 'Switch to Login' : 'Create account'}</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
