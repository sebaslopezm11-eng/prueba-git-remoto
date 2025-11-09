import React, { useState } from 'react';
import './Modal.css';

const ReportModal = ({ onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    type: '',
    format: 'pdf',
    dateFrom: '',
    dateTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      name: `Reporte ${formData.type} - ${new Date().toLocaleDateString('es-ES')}`,
      type: formData.type,
      format: formData.format,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo
    };
    onGenerate(reportData);
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
          <h3>Generar Reporte</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Reporte</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="proyecto">Por Proyecto</option>
                <option value="fecha">Por Fecha</option>
                <option value="recurso">Por Recurso</option>
              </select>
            </div>
            <div className="form-group">
              <label>Formato</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha Desde</label>
              <input
                type="date"
                name="dateFrom"
                value={formData.dateFrom}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                name="dateTo"
                value={formData.dateTo}
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
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
