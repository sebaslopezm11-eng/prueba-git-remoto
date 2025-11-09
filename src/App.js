import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Resources from './components/Resources';
import Reports from './components/Reports';
import Administration from './components/Administration';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/proyectos" element={<Projects />} />
              <Route path="/recursos" element={<Resources />} />
              <Route path="/reportes" element={<Reports />} />
              <Route path="/administracion" element={<Administration />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
