import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ReportModal from './modals/ReportModal';
import apiService from '../services/apiService';
import './Reports.css';

const Reports = () => {
  const { state, dispatch } = useApp();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load reports from backend on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const reports = await apiService.getReports();
      // Transform backend data to match frontend format
      const transformedReports = reports.map(r => ({
        id: r.id,
        name: r.nombre,
        date: new Date(r.fecha).toLocaleDateString('es-ES'),
        type: r.tipo
      }));
      dispatch({ type: 'SET_REPORTS', payload: transformedReports });
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (format, reportName, reportId) => {
    try {
      // Simulate report download
      const reportData = state.reports.find(r => r.id === reportId);
      
      if (format === 'pdf') {
        // Create a simple PDF-like content simulation
        const content = `
BuildX.Pro - Reporte ${reportName}
Generado: ${new Date().toLocaleDateString('es-ES')}

Tipo: ${reportData?.type || 'General'}
Estado: Generado exitosamente

Este es un reporte simulado. En producción, esto generaría 
un archivo PDF real con los datos del reporte.

---
BuildX.Pro - Sistema de Gestión de Construcción
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (format === 'excel') {
        // Create a simple CSV file
        const csvContent = `
Reporte,${reportName}
Fecha,${new Date().toLocaleDateString('es-ES')}
Tipo,${reportData?.type || 'General'}

Datos del reporte:
ID,Tipo,Fecha
${reportId},${reportData?.type || 'General'},${reportData?.date || 'N/A'}
        `;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportName}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Error al descargar el reporte');
    }
  };

  const handleGenerateReport = async (reportData) => {
    setLoading(true);
    setError(null);
    try {
      const newReport = {
        id: `report-${Date.now()}`,
        nombre: reportData.name,
        tipo: reportData.type,
        fecha: new Date().toISOString().split('T')[0]
      };
      
      await apiService.createReport(newReport);
      await loadReports();
      setShowGenerateModal(false);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports">
      <div className="section-header">
        <h2><i className="fas fa-file-alt"></i> Reportes</h2>
        <button className="fab-btn" onClick={() => setShowGenerateModal(true)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="report-filters">
        <div className="filter-group">
          <label>Tipo de Reporte:</label>
          <select
            className="filter-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Seleccionar tipo</option>
            <option value="proyecto">Por Proyecto</option>
            <option value="fecha">Por Fecha</option>
            <option value="recurso">Por Recurso</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Fecha Desde:</label>
          <input
            type="date"
            className="date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Fecha Hasta:</label>
          <input
            type="date"
            className="date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', background: '#fee', color: '#c33', marginBottom: '1rem', borderRadius: '8px' }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
          <i className="fas fa-spinner fa-spin"></i> Cargando reportes...
        </div>
      )}

      <div className="report-list">
        {state.reports.length === 0 && !loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>No hay reportes para mostrar</p>
          </div>
        ) : (
          state.reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.name}</h3>
                <span className="report-date">{report.date}</span>
              </div>
              <div className="report-actions">
              <button
                className="action-btn"
                onClick={() => handleDownloadReport('pdf', report.name, report.id)}
              >
                <i className="fas fa-file-pdf"></i> PDF
              </button>
              <button
                className="action-btn"
                onClick={() => handleDownloadReport('excel', report.name, report.id)}
              >
                <i className="fas fa-file-excel"></i> Excel
              </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showGenerateModal && (
        <ReportModal
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default Reports;
