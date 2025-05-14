import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectTopicState = (state: RootState) => state.topic;

export const selectAllTopics = createSelector(
  [selectTopicState],
  (state) => state.topics
);

export const selectTopicById = (id: number) => createSelector(
  [selectAllTopics],
  (topics) => topics.find(topic => topic.id === id)
);

export const selectTopicStatus = createSelector(
  [selectTopicState],
  (state) => state.status
);

export const selectTopicError = createSelector(
  [selectTopicState],
  (state) => state.error
);