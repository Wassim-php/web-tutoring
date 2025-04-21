import { api } from './api-service';

/**
 * Manages relationships between tutors and topics, including topic assignment
 * and session management
 */
class TutorTopicService {
    /**
     * Gets all tutors teaching a specific topic
     */
    async getTutorsByTopic(topicId) {
        const response = await api.get(`/topics/${topicId}/tutors`);
        return response.data;
    }

    /**
     * Gets all sessions for a student
     */
    async getStudentSessions(studentId) {
        const response = await api.get(`/sessions/student/${studentId}`);
        return response.data;
    }

    /**
     * Creates a new tutoring session
     */
    async createSession(sessionData) {
        const response = await api.post('/sessions', sessionData);
        return response.data;
    }

    /**
     * Assigns a topic to a tutor's teaching subjects
     */
    async addTopicToTutor(tutorId, topicId) {
        try {
            const response = await api.post(`/tutors/${tutorId}/topics`, { topicId: topicId});
            return response.data;
        } catch (error) {
            console.error('Error adding topic to tutor:', error);
            throw error;
        }
    }

    /**
     * Removes a topic from a tutor's teaching subjects
     */
    async removeTopicFromTutor(tutorId, topicId) {
        try {
            const response = await api.delete(`/tutors/${tutorId}/topics/${topicId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing topic from tutor:', error);
            throw error;
        }
    }
}

export default new TutorTopicService();