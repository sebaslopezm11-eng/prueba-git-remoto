import React, { useState } from 'react';
import './Modal.css';

const ProjectModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo Proyecto</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Proyecto</label>
              <input
                type="text"
                name="name"
                placeholder="Ingrese el nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                name="location"
                placeholder="Dirección del proyecto"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                placeholder="Descripción del proyecto"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
