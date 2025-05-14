import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { topicAPI } from './topicAPI';

export interface Topic {
  id: number;
  name: string;
  description: string;
  category?: string;
}

export interface TopicState {
  topics: Topic[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TopicState = {
  topics: [],
  status: 'idle',
  error: null
};

export const fetchTopics = createAsyncThunk(
  'topic/fetchAll',
  async () => {
    return await topicAPI.fetchAll();
  }
);

export const createTopic = createAsyncThunk(
  'topic/create',
  async (topicData: Omit<Topic, 'id'>) => {
    return await topicAPI.create(topicData);
  }
);

export const updateTopic = createAsyncThunk(
  'topic/update',
  async ({ id, data }: { id: number; data: Partial<Topic> }) => {
    return await topicAPI.update(id, data);
  }
);

export const deleteTopic = createAsyncThunk(
  'topic/delete',
  async (id: number) => {
    return await topicAPI.delete(id);
  }
);

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = 'idle';
        state.topics = action.payload;
        state.error = null;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch topics';
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.push(action.payload);
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        const index = state.topics.findIndex(topic => topic.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topics = state.topics.filter(topic => topic.id !== action.payload);
      });
  }
});

export default topicSlice.reducer;