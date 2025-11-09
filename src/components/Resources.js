import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import ResourceModal from './modals/ResourceModal';
import './Resources.css';

const Resources = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('personal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load resources from backend on mount
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getResources('all');
      
      // Transform backend data for each resource type
      const transformedResources = {
        personal: (response.personal || []).map(p => ({
          id: p.id,
          name: p.nombre,
          role: p.rol,
          project: p.proyecto_id || 'Sin asignar',
          schedule: p.horario || 'N/A',
          email: p.email || '',
          phone: p.telefono || ''
        })),
        equipos: (response.equipos || []).map(e => ({
          id: e.id,
          name: e.nombre,
          status: e.estado === 'disponible' ? 'Disponible' : 'En uso',
          project: e.proyecto_id || 'Sin asignar',
          lastMaintenance: e.ultimo_mantenimiento || 'N/A',
          model: e.modelo || 'N/A',
          serie: e.serie || 'N/A'
        })),
        materiales: (response.materiales || []).map(m => ({
          id: m.id,
          name: m.nombre,
          quantity: m.cantidad || 0,
          unit: m.unidad || 'unidad',
          location: m.ubicacion || 'Almacén Central',
          nextDelivery: m.proxima_entrega || 'N/A',
          status: m.estado === 'bajo' ? 'low' : 'normal'
        }))
      };

      dispatch({ type: 'SET_RESOURCES', payload: transformedResources });
    } catch (err) {
      console.error('Error loading resources:', err);
      setError('Error al cargar recursos');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: 'fas fa-users' },
    { id: 'equipos', label: 'Equipos', icon: 'fas fa-tools' },
    { id: 'materiales', label: 'Materiales', icon: 'fas fa-boxes' }
  ];

  const renderResourceCard = (resource, type) => {
    let statusBadge = '';
    let infoItems = '';

    switch(type) {
      case 'personal':
        statusBadge = <span className="role-badge">{resource.role}</span>;
        infoItems = (
          <>
            <p><i className="fas fa-id-badge"></i> ID: {resource.id}</p>
            <p><i className="fas fa-map-marker-alt"></i> {resource.project}</p>
            <p><i className="fas fa-clock"></i> Horario: {resource.schedule}</p>
          </>
        );
        break;
      case 'equipos':
        const statusClass = resource.status === 'Disponible' ? 'active' : 'paused';
        statusBadge = <span className={`status-badge ${statusClass}`}>{resource.status}</span>;
        infoItems = (
          <>
            <p><i className="fas fa-tag"></i> Serie: {resource.id}</p>
            <p><i className="fas fa-map-marker-alt"></i> {resource.project}</p>
            <p><i className="fas fa-wrench"></i> Último mantenimiento: {resource.lastMaintenance}</p>
          </>
        );
        break;
      case 'materiales':
        const stockClass = resource.status === 'low' ? 'low' : 'normal';
        statusBadge = (
          <span className={`stock-badge ${stockClass}`}>
            Stock {resource.status === 'low' ? 'Bajo' : 'Normal'}
          </span>
        );
        infoItems = (
          <>
            <p><i className="fas fa-box"></i> Cantidad: {resource.quantity} {resource.unit}</p>
            <p><i className="fas fa-map-marker-alt"></i> {resource.location}</p>
            <p><i className="fas fa-calendar"></i> Próxima entrega: {resource.nextDelivery}</p>
          </>
        );
        break;
    }

    return (
      <div key={resource.id} className="resource-card">
        <div className="resource-header">
          <h3>{resource.name}</h3>
          {statusBadge}
        </div>
        <div className="resource-info">
          {infoItems}
        </div>
      </div>
    );
  };

  const handleAddResource = async (resourceData) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.createResource(resourceData);
      await loadResources();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating resource:', err);
      setError('Error al agregar el recurso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resources">
      <div className="section-header">
        <h2><i className="fas fa-users"></i> Recursos</h2>
        <button className="fab-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="resource-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', background: '#fee', color: '#c33', marginBottom: '1rem', borderRadius: '8px' }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
          <i className="fas fa-spinner fa-spin"></i> Cargando recursos...
        </div>
      )}

      <div className="resource-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`resource-tab ${activeTab === tab.id ? 'active' : ''}`}
            id={`${tab.id}-tab`}
          >
            <div className="resource-list">
              {state.resources[tab.id] && state.resources[tab.id].length === 0 && !loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                  <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                  <p>No hay {tab.label.toLowerCase()} para mostrar</p>
                </div>
              ) : (
                state.resources[tab.id]?.map(resource => 
                  renderResourceCard(resource, tab.id)
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <ResourceModal
          resourceType={activeTab}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddResource}
        />
      )}
    </div>
  );
};

export default Resources;
