import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  currentSection: 'inicio',
  currentResourceTab: 'personal',
  projects: [], // Loaded from backend
  resources: {
    personal: [],
    equipos: [],
    materiales: []
  },
  reports: [] // Loaded from backend
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    case 'SET_CURRENT_RESOURCE_TAB':
      return { ...state, currentResourceTab: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };
    case 'SET_RESOURCES':
      return { ...state, resources: action.payload };
    case 'ADD_RESOURCE':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.type]: [...state.resources[action.payload.type], action.payload.data]
        }
      };
    case 'SET_REPORTS':
      return { ...state, reports: action.payload };
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
    // Helper functions
    getActiveProjects: () => state.projects.filter(p => p.status === 'active'),
    getProjectById: (id) => state.projects.find(p => p.id === id),
    getResourceByType: (type) => state.resources[type] || [],
    getDashboardStats: () => ({
      activeProjects: state.projects.filter(p => p.status === 'active').length,
      personnel: state.resources.personal.length,
      equipment: state.resources.equipos.length,
      averageProgress: state.projects.length > 0 
        ? Math.round(state.projects.reduce((sum, project) => sum + project.progress, 0) / state.projects.length)
        : 0
    })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
