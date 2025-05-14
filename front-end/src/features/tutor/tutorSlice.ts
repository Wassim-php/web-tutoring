import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import TutorService from '../../services/TutorService';

// Export the interface
export interface TutorProfile {
  id: number;
  name: string;
  certification: string;
  bio?: string;
  hourlyRate?: number;
  profilePicture?: string;
}

// Export the state interface
export interface TutorState {
  profile: TutorProfile | null;
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: TutorState = {
  profile: null,
  status: 'idle',
  error: null
};

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

export const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      if (action.payload) {
        state.profile = action.payload;
        state.status = 'succeeded';
        state.error = null;
        // Only save valid profile data
        localStorage.setItem('tutorProfile', JSON.stringify(action.payload));
      }
    },
    clearTutorProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('tutorProfile');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutorProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTutorProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded';
          state.profile = action.payload;
          state.error = null;
          localStorage.setItem('tutorProfile', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchTutorProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
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

export const { clearTutorProfile, setProfile } = tutorSlice.actions;

export default tutorSlice.reducer;