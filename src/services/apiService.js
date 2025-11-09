/**
 * API Service for BuildX.Pro
 * Frontend service to interact with PHP backend
 */

const API_BASE_URL = 'http://localhost/Servicios_Web/api';

class ApiService {
    // Helper method for API requests
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}/${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Add authorization token if available
        const token = localStorage.getItem('token');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la solicitud');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async login(username, password) {
        return this.request('auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ nombre_usuario: username, password }),
        });
    }

    async register(userData) {
        return this.request('auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async verifyToken(token) {
        return this.request('auth.php?action=verify', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    // Projects
    async getProjects(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`proyectos.php${queryParams ? '?' + queryParams : ''}`);
    }

    async getProject(id) {
        return this.request(`proyectos.php?id=${id}`);
    }

    async createProject(projectData) {
        return this.request('proyectos.php', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }

    async updateProject(projectData) {
        return this.request('proyectos.php', {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    }

    async deleteProject(id) {
        return this.request(`proyectos.php?id=${id}`, {
            method: 'DELETE',
        });
    }

    // Resources
    async getResources(type = 'all') {
        return this.request(`recursos.php?type=${type}`);
    }

    async createResource(resourceData) {
        return this.request('recursos.php', {
            method: 'POST',
            body: JSON.stringify(resourceData),
        });
    }

    async updateResource(resourceData) {
        return this.request('recursos.php', {
            method: 'PUT',
            body: JSON.stringify(resourceData),
        });
    }

    async deleteResource(type, id) {
        return this.request(`recursos.php?type=${type}&id=${id}`, {
            method: 'DELETE',
        });
    }

    // Reports
    async getReports(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`reportes.php${queryParams ? '?' + queryParams : ''}`);
    }

    async getReport(id) {
        return this.request(`reportes.php?id=${id}`);
    }

    async createReport(reportData) {
        return this.request('reportes.php', {
            method: 'POST',
            body: JSON.stringify(reportData),
        });
    }

    async deleteReport(id) {
        return this.request(`reportes.php?id=${id}`, {
            method: 'DELETE',
        });
    }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

