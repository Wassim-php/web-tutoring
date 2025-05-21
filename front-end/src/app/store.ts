// Importing Redux Toolkit's store utilities and types
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

// Importing individual feature reducers
import tutorReducer from '../features/tutor/tutorSlice';
import topicReducer from '../features/topic/topicSlice';

/**
 * Configures the Redux store with application slices.
 * Each slice manages a specific part of the global state.
 */
export const store = configureStore({
  reducer: {
    // The "tutor" state is managed by tutorReducer
    tutor: tutorReducer,

    // The "topic" state is managed by topicReducer
    topic: topicReducer,
  },
});

/**
 * Type representing the Redux dispatch function.
 * Useful for typing when dispatching thunks or actions manually.
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Type representing the overall state structure of the Redux store.
 * Automatically inferred from the reducers provided.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Generic type for creating typed thunk actions.
 * Ensures that async actions conform to expected Redux logic.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,        // Return type of the thunk
  RootState,         // State structure
  unknown,           // Extra argument (unused here)
  Action<string>     // Action type
>;
