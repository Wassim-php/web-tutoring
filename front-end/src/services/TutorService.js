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
            console.log('Fetching tutor profile for ID:', id);
            const response = await api.get(`/tutors/${id}`);
            console.log('Tutor profile response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor profile:', {
                code: error.code,
                message: error.message,
                response: error.response?.data
            });
            if (error.code === 'ERR_CONNECTION_REFUSED') {
                throw new Error('Unable to connect to server. Please check if the server is running.');
            }
            if (error.response?.status === 404) {
                throw new Error('Tutor profile not found');
            }
            throw error;
        }
    }

    /**
     * Creates a new tutor profile
     */
    async createTutor(tutorData) {
        try {
            // Log the data being sent for debugging
            console.log('Creating tutor with data:', tutorData);

            const response = await api.post('/tutors', tutorData);
            return response.data;
        } catch (error) {
            // Enhanced error logging
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error creating tutor - Server Response:', {
                    data: error.response.data,
                    status: error.response.status,
                    headers: error.response.headers
                });
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error creating tutor - No Response:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error creating tutor - Request Setup:', error.message);
            }

            // Throw a more informative error
            throw {
                message: error.response?.data?.message || 'Failed to create tutor profile',
                status: error.response?.status,
                details: error.response?.data
            };
        }
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