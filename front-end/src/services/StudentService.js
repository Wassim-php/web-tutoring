import { api } from './api-service';

/**
 * Manages all student-related API operations
 * Provides CRUD operations and profile management for students
 */
class StudentService {
    /**
     * Creates a new student profile
     */
    async createStudent(studentData) {
        try {
            const response = await api.post('/students', studentData);
            return response;
        } catch (error) {
            console.error('StudentService create error:', error.response?.data);
            throw error;
        }
    }

    /**
     * Retrieves student data by ID
     */
    async getStudentById(id) {
        const response = await api.get(`/students/${id}`);
        return response.data;
    }

    /**
     * Updates student information
     */
    async updateStudent(id, studentData) {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    }

    /**
     * Removes a student from the system
     */
    async deleteStudent(id) {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    }

    /**
     * Gets list of all students
     */
    async getAllStudents() {
        const response = await api.get('/students');
        return response.data;
    }

    /**
     * Fetches current student's profile
     */
    async getStudentProfile() {
        const response = await api.get('/students/profile');
        return response.data;
    }

    /**
     * Updates current student's profile data
     */
    async updateProfile(studentData) {
        const response = await api.put('/students/profile', studentData);
        return response.data;
    }
}

export default new StudentService();