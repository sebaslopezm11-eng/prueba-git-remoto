import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Intentando login con:', { username });
      const response = await fetch('http://localhost/Servicios_Web/api/auth.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre_usuario: username,
          password: password
        })
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 0 || response.status >= 500) {
          throw new Error('No se puede conectar al servidor. Verifica que Apache está corriendo.');
        }
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Credenciales inválidas' };
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (data.success) {
        const userData = {
          id: data.user.id,
          nombre_usuario: data.user.nombre_usuario,
          email: data.user.email,
          rol: data.user.rol
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Error de conexión con el servidor. Verifica que Apache y MySQL están corriendo.' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Intentando registro con:', userData);
      const response = await fetch('http://localhost/Servicios_Web/api/auth.php?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok && response.status === 0) {
        throw new Error('No se puede conectar al servidor. Verifica que Apache está corriendo.');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (data.success) {
        const newUser = {
          id: data.user.id,
          nombre_usuario: data.user.nombre_usuario,
          email: data.user.email,
          rol: data.user.rol
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al registrar usuario' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Error de conexión con el servidor. Verifica que Apache y MySQL están corriendo.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

