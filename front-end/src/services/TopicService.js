import { api } from './api-service';

/**
 * Manages all topic-related API operations
 * Provides CRUD operations for academic topics
 */
class TopicService {
    /**
     * Gets all available topics
     */
    async getAllTopics() {
        try {
            const response = await api.get('/topics');
            return response;
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    }

    /**
     * Retrieves specific topic by ID
     */
    async getTopicById(id) {
        try {
            const response = await api.get(`/topics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching topic:', error);
            throw error;
        }
    }

    /**
     * Creates a new topic
     */
    async createTopic(topicData) {
        try {
            const response = await api.post('/topics', topicData);
            return response.data;
        } catch (error) {
            console.error('Error creating topic:', error);
            throw error;
        }
    }

    /**
     * Updates an existing topic
     */
    async updateTopic(id, topicData) {
        try {
            const response = await api.put(`/topics/${id}`, topicData);
            return response.data;
        } catch (error) {
            console.error('Error updating topic:', error);
            throw error;
        }
    }

    /**
     * Removes a topic from the system
     */
    async deleteTopic(id) {
        try {
            const response = await api.delete(`/topics/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw error;
        }
    }
}

export default new TopicService();