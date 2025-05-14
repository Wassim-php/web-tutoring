import { api } from '../../services/api-service';
import { Topic } from './topicSlice';

export const topicAPI = {
  fetchAll: async () => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Topic>(`/topics/${id}`);
    return response.data;
  },

  create: async (topicData: Omit<Topic, 'id'>) => {
    const response = await api.post<Topic>('/topics', topicData);
    return response.data;
  },

  update: async (id: number, topicData: Partial<Topic>) => {
    const response = await api.patch<Topic>(`/topics/${id}`, topicData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/topics/${id}`);
    return id;
  }
};