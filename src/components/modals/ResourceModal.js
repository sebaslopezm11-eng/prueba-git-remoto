import React, { useState } from 'react';
import './Modal.css';

const ResourceModal = ({ onClose, onSave, resourceType }) => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    ...(resourceType === 'personal' ? {
      rol: '',
      email: '',
      telefono: '',
      proyecto_id: '',
      horario: ''
    } : resourceType === 'equipos' ? {
      modelo: '',
      serie: '',
      estado: 'disponible',
      proyecto_id: '',
      ultimo_mantenimiento: ''
    } : {
      cantidad: '',
      unidad: 'unidades',
      ubicacion: '',
      proxima_entrega: '',
      estado: 'normal'
    })
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resourceData = {
      type: resourceType,
      ...formData,
      // Convert number fields
      cantidad: resourceType === 'materiales' ? parseInt(formData.cantidad) : undefined
    };
    await onSave(resourceData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getResourceTypeLabel = () => {
    switch(resourceType) {
      case 'personal': return 'Personal';
      case 'equipos': return 'Equipo';
      case 'materiales': return 'Material';
      default: return 'Recurso';
    }
  };

  const renderPersonalFields = () => (
    <>
      <div className="form-group">
        <label>ID del Empleado *</label>
        <input
          type="text"
          name="id"
          placeholder="Ej: EMP004"
          value={formData.id}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Nombre Completo *</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Juan Pérez"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Rol *</label>
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar rol</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Arquitecto">Arquitecto</option>
          <option value="Ingeniero">Ingeniero</option>
          <option value="Obrero">Obrero</option>
          <option value="Ayudante">Ayudante</option>
        </select>
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="email@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          placeholder="Ej: 3001234567"
          value={formData.telefono}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Proyecto Asignado</label>
        <input
          type="text"
          name="proyecto_id"
          placeholder="Ej: proyecto-1"
          value={formData.proyecto_id}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Horario de Trabajo</label>
        <input
          type="text"
          name="horario"
          placeholder="Ej: 7:00 - 17:00"
          value={formData.horario}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderEquiposFields = () => (
    <>
      <div className="form-group">
        <label>ID/Serie del Equipo *</label>
        <input
          type="text"
          name="id"
          placeholder="Ej: CAT320-003"
          value={formData.id}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Nombre del Equipo *</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Excavadora CAT 320"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Modelo</label>
        <input
          type="text"
          name="modelo"
          placeholder="Ej: 320 GC"
          value={formData.modelo}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Serie</label>
        <input
          type="text"
          name="serie"
          placeholder="Ej: CAT-2024-003"
          value={formData.serie}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Estado *</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
        >
          <option value="disponible">Disponible</option>
          <option value="en_uso">En Uso</option>
          <option value="mantenimiento">En Mantenimiento</option>
        </select>
      </div>
      <div className="form-group">
        <label>Proyecto Asignado</label>
        <input
          type="text"
          name="proyecto_id"
          placeholder="Ej: proyecto-1"
          value={formData.proyecto_id}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Último Mantenimiento</label>
        <input
          type="date"
          name="ultimo_mantenimiento"
          value={formData.ultimo_mantenimiento}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderMaterialesFields = () => (
    <>
      <div className="form-group">
        <label>ID del Material *</label>
        <input
          type="text"
          name="id"
          placeholder="Ej: MAT003"
          value={formData.id}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Nombre del Material *</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ej: Varilla de acero"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Cantidad *</label>
        <input
          type="number"
          name="cantidad"
          placeholder="Ej: 100"
          value={formData.cantidad}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Unidad *</label>
        <select
          name="unidad"
          value={formData.unidad}
          onChange={handleChange}
          required
        >
          <option value="unidades">Unidades</option>
          <option value="bolsas">Bolsas</option>
          <option value="kg">Kilogramos</option>
          <option value="l">Litros</option>
          <option value="m">Metros</option>
          <option value="m2">Metros cuadrados</option>
          <option value="m3">Metros cúbicos</option>
        </select>
      </div>
      <div className="form-group">
        <label>Ubicación</label>
        <input
          type="text"
          name="ubicacion"
          placeholder="Ej: Almacén Central"
          value={formData.ubicacion}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Próxima Entrega</label>
        <input
          type="date"
          name="proxima_entrega"
          value={formData.proxima_entrega}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Estado</label>
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="normal">Normal</option>
          <option value="bajo">Bajo</option>
          <option value="agotado">Agotado</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nuevo {getResourceTypeLabel()}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {resourceType === 'personal' && renderPersonalFields()}
            {resourceType === 'equipos' && renderEquiposFields()}
            {resourceType === 'materiales' && renderMaterialesFields()}
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;

