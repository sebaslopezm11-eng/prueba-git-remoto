import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProjectModal from './modals/ProjectModal';
import ProjectDetailModal from './modals/ProjectDetailModal';
import apiService from '../services/apiService';
import './Projects.css';

const Projects = () => {
  const { state, dispatch } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load projects from backend on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const projects = await apiService.getProjects();
      // Transform backend data to match frontend format
      const transformedProjects = projects.map(p => ({
        id: p.id,
        name: p.nombre,
        location: p.ubicacion,
        startDate: p.fecha_inicio,
        progress: p.progreso || 0,
        status: p.estado === 'activo' ? 'active' : (p.estado === 'pausado' ? 'paused' : 'completed'),
        description: p.descripcion || ''
      }));
      // Set all projects at once
      dispatch({ type: 'SET_PROJECTS', payload: transformedProjects });
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProject = async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const newProject = {
        id: `proyecto-${Date.now()}`,
        nombre: projectData.name,
        ubicacion: projectData.location,
        fecha_inicio: projectData.startDate,
        descripcion: projectData.description || '',
        progreso: 0,
        estado: 'activo'
      };
      
      await apiService.createProject(newProject);
      
      // Reload projects from backend to ensure consistency
      await loadProjects();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleUpdateProject = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const projectData = {
        id: selectedProject.id,
        nombre: updatedData.name,
        ubicacion: updatedData.location,
        descripcion: updatedData.description || '',
        progreso: parseInt(updatedData.progress),
        estado: updatedData.status === 'active' ? 'activo' : updatedData.status === 'paused' ? 'pausado' : 'completado'
      };
      
      await apiService.updateProject(projectData);
      await loadProjects();
      setSelectedProject(null);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Error al actualizar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteProject(projectId);
      await loadProjects();
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Error al eliminar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : status === 'paused' ? 'Pausado' : 'Completado';
  };

  return (
    <div className="projects">
      <div className="section-header">
        <h2><i className="fas fa-folder"></i> Proyectos</h2>
        <button className="fab-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pausado">Pausado</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', background: '#fee', color: '#c33', marginBottom: '1rem', borderRadius: '8px' }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
          <i className="fas fa-spinner fa-spin"></i> Cargando proyectos...
        </div>
      )}

      <div className="project-list">
        {filteredProjects.length === 0 && !loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>No hay proyectos para mostrar</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => handleViewProject(project)}
            >
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${project.status}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
              <div className="project-info">
                <p><i className="fas fa-map-marker-alt"></i> {project.location}</p>
                <p><i className="fas fa-calendar"></i> Inicio: {project.startDate}</p>
                <p><i className="fas fa-percentage"></i> Avance: {project.progress}%</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <ProjectModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProject}
        />
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
};

export default Projects;
