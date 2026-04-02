import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#333', color: '#fff', padding: '10px 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>
          E-Voting System
        </Link>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '15px' }}>Welcome, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} style={{ background: '#dc3545' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;