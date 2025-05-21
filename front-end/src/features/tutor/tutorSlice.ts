/**
 * Redux slice for managing tutor profile data
 * Handles fetching, updating, and storing tutor information
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TutorService from '../../services/TutorService';

/**
 * Interface representing a tutor's profile data structure
 */
export interface TutorProfile {
  id: number;
  name: string;
  certification: string;
  bio?: string;
  hourlyRate?: number;
  profilePicture?: string;
}

/**
 * Interface for the tutor state in Redux store
 */
export interface TutorState {
  profile: TutorProfile | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

/**
 * Initial state for the tutor slice
 */
const initialState: TutorState = {
  profile: null,
  status: 'idle',
  error: null
};

/**
 * Async thunk to fetch a tutor's profile from the API
 * 
 * @param id The ID of the tutor to fetch
 */
export const fetchTutorProfile = createAsyncThunk(
  'tutor/fetchProfile',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await TutorService.getTutorById(id);
      console.log('Received tutor data:', response); // Debug log
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk to update a tutor's profile in the API
 * 
 * @param payload Object containing tutor ID and update data
 */
export const updateTutorProfile = createAsyncThunk(
  'tutor/updateProfile',
  async ({ id, updateData }: { id: number; updateData: Partial<TutorProfile> }) => {
    try {
      const response = await TutorService.updateTutorProfile(id, updateData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
);

/**
 * Redux slice for tutor state management
 */
export const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    /**
     * Sets profile data manually, typically used when loading from cache
     * or when setting profile from a non-API source
     */
    setProfile: (state, action) => {
      if (action.payload) {
        state.profile = action.payload;
        state.status = 'succeeded';
        state.error = null;
        // Only save valid profile data
        localStorage.setItem('tutorProfile', JSON.stringify(action.payload));
      }
    },
    /**
     * Clears all tutor profile data from state and localStorage
     */
    clearTutorProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('tutorProfile');
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTutorProfile pending state
      .addCase(fetchTutorProfile.pending, (state) => {
        state.status = 'loading';
      })
      // Handle fetchTutorProfile success state
      .addCase(fetchTutorProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded';
          state.profile = action.payload;
          state.error = null;
          localStorage.setItem('tutorProfile', JSON.stringify(action.payload));
        }
      })
      // Handle fetchTutorProfile failure state
      .addCase(fetchTutorProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle updateTutorProfile success state
      .addCase(updateTutorProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded';
          state.profile = action.payload;
          state.error = null;
          localStorage.setItem('tutorProfile', JSON.stringify(action.payload));
        }
      });
  }
});

// Export action creators
export const { clearTutorProfile, setProfile } = tutorSlice.actions;

// Export the reducer
export default tutorSlice.reducer;