import { api } from './api-service';

/**
 * Manages all tutor-related API operations
 * Provides CRUD operations and profile management for tutors
 */
class TutorService {
    /**
     * Gets list of all tutors
     */
    async getAllTutors() {
        const response = await api.get('/tutors');
        return response.data;
    }

    /**
     * Retrieves specific tutor by ID
     */
    async getTutorById(id) {
        try {
            const response = await api.get(`/tutors/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor:', error);
            throw error;
        }
    }

    /**
     * Creates a new tutor profile
     */
    async createTutor(tutorData) {
        const response = await api.post('/tutors', tutorData);
        return response.data;
    }

    /**
     * Updates tutor's complete information
     */
    async updateTutor(id, tutorData) {
        const response = await api.put(`/tutors/${id}`, tutorData);
        return response;
    }

    /**
     * Partially updates tutor profile data
     */
    async updateTutorProfile(id, updateData) {
        try {
            const response = await api.patch(`/tutors/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating tutor profile:', error);
            throw error;
        }
    }

    /**
     * Removes a tutor from the system
     */
    async deleteTutor(id) {
        const response = await api.delete(`/tutors/${id}`);
        return response.data;
    }
}

export default new TutorService();