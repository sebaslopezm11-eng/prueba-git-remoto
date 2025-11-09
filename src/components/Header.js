import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <i className="fas fa-cube"></i>
          BuildBox
        </h1>
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">{user?.nombre_usuario || 'Usuario'}</span>
            <span className="user-role">{user?.rol || 'Usuario'}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
