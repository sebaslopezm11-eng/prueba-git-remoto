import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getDashboardStats } = useApp();
  const stats = getDashboardStats();

  const quickActions = [
    {
      icon: 'fas fa-folder',
      label: 'Ver Proyectos',
      action: () => navigate('/proyectos')
    },
    {
      icon: 'fas fa-users',
      label: 'Gestionar Recursos',
      action: () => navigate('/recursos')
    },
    {
      icon: 'fas fa-file-alt',
      label: 'Generar Reporte',
      action: () => navigate('/reportes')
    }
  ];

  const alerts = [
    {
      text: 'Retraso en entrega de materiales - Proyecto Norte',
      time: 'Hace 2 horas',
      level: 'high'
    },
    {
      text: 'Personal faltante en zona B',
      time: 'Hace 4 horas',
      level: 'medium'
    }
  ];

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2><i className="fas fa-home"></i> Inicio</h2>
        <p>Estado general de la obra y actividades recientes</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="card alert-card">
          <div className="card-header">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Alertas Recientes</h3>
          </div>
          <div className="alert-list">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-item ${alert.level}`}>
                <span className="alert-text">{alert.text}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">
            <i className="fas fa-chart-line"></i>
            <h3>Resumen de Actividades</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.activeProjects}</span>
              <span className="stat-label">Proyectos Activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.personnel}</span>
              <span className="stat-label">Personal</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.equipment}</span>
              <span className="stat-label">Equipos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.averageProgress}%</span>
              <span className="stat-label">Avance General</span>
            </div>
          </div>
        </div>

        <div className="card quick-access-card">
          <div className="card-header">
            <i className="fas fa-bolt"></i>
            <h3>Acceso Rápido</h3>
          </div>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button key={index} className="quick-btn" onClick={action.action}>
                <i className={action.icon}></i>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
