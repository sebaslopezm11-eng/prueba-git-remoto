import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const ProjectDetailModal = ({ project, onClose, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: project.name,
    location: project.location,
    description: project.description || '',
    progress: project.progress,
    status: project.status
  });

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : status === 'paused' ? 'Pausado' : 'Completado';
  };

  const handleEditProject = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    await onUpdate(editFormData);
    setShowEditModal(false);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) {
      await onDelete(project.id);
      onClose();
    }
  };

  const handleGenerateReport = () => {
    navigate('/reportes');
    onClose();
  };

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  if (showEditModal) {
    return (
      <div className="modal active">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Editar Proyecto</h3>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Nombre del Proyecto</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleChange}
                >
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Progreso (%)</label>
                <input
                  type="number"
                  name="progress"
                  min="0"
                  max="100"
                  value={editFormData.progress}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSaveEdit}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{project.name}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="project-detail-info">
            <p><strong>Ubicación:</strong> {project.location}</p>
            <p><strong>Fecha de Inicio:</strong> {project.startDate}</p>
            <p><strong>Estado:</strong> <span className={`status-badge ${project.status}`}>{getStatusText(project.status)}</span></p>
            <p><strong>Descripción:</strong> {project.description}</p>
            <div className="progress-section">
              <p><strong>Progreso:</strong> {project.progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </div>
          <div className="project-actions">
            <button className="btn-primary" onClick={handleEditProject}>
              <i className="fas fa-edit"></i> Editar
            </button>
            <button className="btn-secondary" onClick={handleGenerateReport}>
              <i className="fas fa-file-alt"></i> Reporte
            </button>
            <button 
              className="btn-danger" 
              onClick={handleDeleteProject}
              style={{ background: '#dc3545', border: 'none', color: 'white' }}
            >
              <i className="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
