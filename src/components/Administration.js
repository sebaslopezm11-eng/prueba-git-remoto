import React, { useState } from 'react';
import './Administration.css';

const Administration = () => {
  const [showModal, setShowModal] = useState('');

  const adminCards = [
    {
      id: 'users',
      icon: 'fas fa-users-cog',
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios y permisos del sistema',
      modal: 'usersModal'
    },
    {
      id: 'roles',
      icon: 'fas fa-user-shield',
      title: 'Roles y Permisos',
      description: 'Configurar roles y niveles de acceso',
      modal: 'rolesModal'
    },
    {
      id: 'config',
      icon: 'fas fa-sliders-h',
      title: 'Configuración General',
      description: 'Ajustes del sistema y preferencias',
      modal: 'configModal'
    },
    {
      id: 'sync',
      icon: 'fas fa-sync-alt',
      title: 'Sincronización',
      description: 'Sincronizar datos y respaldos',
      modal: 'syncModal'
    }
  ];

  const handleCardClick = (modalId) => {
    setShowModal(modalId);
  };

  const closeModal = () => {
    setShowModal('');
  };

  return (
    <div className="administration">
      <div className="section-header">
        <h2><i className="fas fa-cog"></i> Administración</h2>
      </div>

      <div className="admin-menu">
        {adminCards.map(card => (
          <div
            key={card.id}
            className="admin-card"
            onClick={() => handleCardClick(card.modal)}
          >
            <div className="admin-icon">
              <i className={card.icon}></i>
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {/* Modals would be implemented here */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configuración</h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Funcionalidad de administración en desarrollo...</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
