// Importing necessary functions from Redux Toolkit
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// Importing the API functions used for topic-related server interactions
import { topicAPI } from './topicAPI';

/**
 * Interface defining the structure of a Topic object
 */
export interface Topic {
  id: number;
  name: string;
  description: string;
  category?: string; // Optional category
}

/**
 * Interface for the Redux slice state related to topics
 */
export interface TopicState {
  topics: Topic[]; // Array of Topic objects
  status: 'idle' | 'loading' | 'failed'; // Represents the current state of async operations
  error: string | null; // Error message, if any
}

// Initial state for the topic slice
const initialState: TopicState = {
  topics: [],
  status: 'idle',
  error: null
};

/**
 * Async thunk to fetch all topics from the server
 */
export const fetchTopics = createAsyncThunk(
  'topic/fetchAll', // Action type string
  async () => {
    return await topicAPI.fetchAll(); // Call the API to fetch all topics
  }
);

/**
 * Async thunk to create a new topic
 * @param topicData - Data for the new topic, excluding the ID
 */
export const createTopic = createAsyncThunk(
  'topic/create',
  async (topicData: Omit<Topic, 'id'>) => {
    return await topicAPI.create(topicData); // Call the API to create a topic
  }
);

/**
 * Async thunk to update an existing topic
 * @param id - ID of the topic to update
 * @param data - Partial data to update
 */
export const updateTopic = createAsyncThunk(
  'topic/update',
  async ({ id, data }: { id: number; data: Partial<Topic> }) => {
    return await topicAPI.update(id, data); // Call the API to update the topic
  }
);

/**
 * Async thunk to delete a topic by its ID
 */
export const deleteTopic = createAsyncThunk(
  'topic/delete',
  async (id: number) => {
    return await topicAPI.delete(id); // Call the API to delete the topic
  }
);

/**
 * Redux slice for topic-related state management
 */
const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {}, // No synchronous reducers needed currently
  extraReducers: (builder) => {
    // Handling the pending, fulfilled, and rejected states of fetchTopics
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = 'idle';
        state.topics = action.payload; // Replace existing topics with fetched ones
        state.error = null;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch topics';
      })

      // Handling the fulfilled state of createTopic
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topics.push(action.payload); // Add the new topic to the list
      })

      // Handling the fulfilled state of updateTopic
      .addCase(updateTopic.fulfilled, (state, action) => {
        const index = state.topics.findIndex(topic => topic.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload; // Replace the updated topic
        }
      })

      // Handling the fulfilled state of deleteTopic
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topics = state.topics.filter(topic => topic.id !== action.payload); // Remove the deleted topic
      });
  }
});

// Export the reducer to be included in the store
export default topicSlice.reducer;
