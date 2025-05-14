import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import tutorReducer from '../features/tutor/tutorSlice';
import topicReducer from '../features/topic/topicSlice';

export const store = configureStore({
  reducer: {
    tutor: tutorReducer,
    topic: topicReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;