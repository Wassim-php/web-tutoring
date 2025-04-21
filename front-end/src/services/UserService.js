import { api } from './api-service';

class UserService {
    //Creates a new user 
    async create(userData) {
        try {
            const response = await api.post('/users', userData);
            return response; 
        } catch (error) {
            console.error('UserService create error:', error.response?.data);
            throw error;  
        }
    }
    //Fetches user by id
    async getUserById(id) {
        const response = await api.get(`/users/${id}`);
        return response;
    }
    //Updates user information
    async updateUser(id, userData) {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    }
    //deletes user by id
    async deleteUser(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
    //fetches all Users
    async getAllUsers() {
        const response = await api.get('/users');
        return response.data;
    }
   
}

export default new UserService();