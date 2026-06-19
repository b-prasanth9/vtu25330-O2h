import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AddTaskPage from './pages/AddTaskPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return token ? { username: name } : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <div className={darkMode ? 'app dark-mode' : 'app'}>
      <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
        <div className="container">
          <NavLink className="navbar-brand" to="/">Task Portal</NavLink>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/add">Add Task</NavLink>
              </li>
            </ul>
            <div className="d-flex gap-2 align-items-center">
              {user ? <span className="text-white me-2">{user.username}</span> : null}
              <NavLink className="btn btn-sm btn-outline-light" to={user ? '#' : '/login'} onClick={(e) => { if (user) e.preventDefault(); }}>{user ? 'Profile' : 'Login'}</NavLink>
              {user ? <button className="btn btn-sm btn-light" onClick={handleLogout}>Logout</button> : null}
              <button className="btn btn-outline-light" onClick={() => setDarkMode((prev) => !prev)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add" element={<AddTaskPage />} />
          <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
