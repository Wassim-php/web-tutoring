/**
 * API service module for handling all topic-related HTTP requests
 */
import { api } from '../../services/api-service';
import { Topic } from './topicSlice';

/**
 * Collection of topic-related API methods
 */
export const topicAPI = {
  /**
   * Fetches all available topics from the API
   * 
   * @returns {Promise<Topic[]>} Promise resolving to an array of Topic objects
   */
  fetchAll: async () => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
  },

  /**
   * Retrieves a specific topic by its ID
   * 
   * @param {number} id - The unique identifier of the topic to fetch
   * @returns {Promise<Topic>} Promise resolving to the requested Topic object
   */
  getById: async (id: number) => {
    const response = await api.get<Topic>(`/topics/${id}`);
    return response.data;
  },

  /**
   * Creates a new topic in the system
   * 
   * @param {Omit<Topic, 'id'>} topicData - Topic data without ID (server assigns ID)
   * @returns {Promise<Topic>} Promise resolving to the newly created Topic with assigned ID
   */
  create: async (topicData: Omit<Topic, 'id'>) => {
    const response = await api.post<Topic>('/topics', topicData);
    return response.data;
  },

  /**
   * Updates an existing topic with new data
   * 
   * @param {number} id - The unique identifier of the topic to update
   * @param {Partial<Topic>} topicData - Partial topic data containing only fields to update
   * @returns {Promise<Topic>} Promise resolving to the updated Topic object
   */
  update: async (id: number, topicData: Partial<Topic>) => {
    const response = await api.patch<Topic>(`/topics/${id}`, topicData);
    return response.data;
  },

  /**
   * Deletes a topic from the system
   * 
   * @param {number} id - The unique identifier of the topic to delete
   * @returns {Promise<number>} Promise resolving to the ID of the deleted topic
   */
  delete: async (id: number) => {
    await api.delete(`/topics/${id}`);
    return id;
  }
};