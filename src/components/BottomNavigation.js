import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Inicio' },
    { path: '/proyectos', icon: 'fas fa-folder', label: 'Proyectos' },
    { path: '/recursos', icon: 'fas fa-users', label: 'Recursos' },
    { path: '/reportes', icon: 'fas fa-file-alt', label: 'Reportes' },
    { path: '/administracion', icon: 'fas fa-cog', label: 'Admin' }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
