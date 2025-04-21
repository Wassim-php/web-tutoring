import { api } from './api-service';

/**
 * Handles all tutoring session operations
 */
class SessionService {
    /**
     * Gets all sessions for a specific tutor
     */
    async getTutorSessions(tutorId) {
        try {
            const response = await api.get(`/sessions/tutor/${tutorId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor sessions:', error);
            throw error;
        }
    }

    /**
     * Gets all sessions for a specific student
     */
    async getStudentSessions(studentId) {
        try {
            const response = await api.get(`/sessions/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching student sessions:', error);
            throw error;
        }
    }

    /**
     * Updates the status of a session (accept/reject)
     */
    async updateSessionStatus(sessionId, status) {
        try {
            const response = await api.patch(`/sessions/${sessionId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating session status:', error);
            throw error;
        }
    }

    /**
     * Creates a new tutoring session request
     */
    async createSession(sessionData) {
        try {
            const response = await api.post('/sessions', sessionData);
            return response.data;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    /**
     * Gets only accepted sessions for a tutor
     */
    async getAcceptedTutorSessions(tutorId) {
        try {
            const response = await api.get(`/sessions/accepted/${tutorId}`);
            return response;
        } catch (error) {
            console.error('Error fetching accepted tutor sessions:', error);
            throw error;
        }
    }

    /**
     * Gets only accepted sessions for a student
     */
    async getAcceptedStudentSessions(studentId) {
        try {
            const response = await api.get(`/sessions/stAccepted/${studentId}`);
            return response;
        } catch (error) {
            console.error('Error fetching accepted student sessions:', error);
            throw error;
        }
    }
}

export default new SessionService();