import { api } from './api-service';

/**
 * Service handling authentication-related operations
 */
class AuthService {
    /**
     * Authenticates user with credentials and returns token
     */
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    }

    /**
     * Creates new user account with provided data
     */
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }

    /**
     * Retrieves currently logged-in user's profile
     */
    async getCurrentUser() {
        const response = await api.get('/auth/profile');
        return response.data;
    }

    /**
     * Removes authentication token and logs out user
     */
    logout() {
        localStorage.removeItem('token');
    }
}

export default new AuthService();