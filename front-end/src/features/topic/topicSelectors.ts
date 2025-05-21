/**
 * Redux selectors for accessing topic-related state
 * Uses memoized selectors for performance optimization
 */
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

/**
 * Base selector that extracts the topic slice from the Redux store
 * 
 * @param {RootState} state - The complete Redux state tree
 * @returns {TopicState} The topic slice of the Redux state
 */
const selectTopicState = (state: RootState) => state.topic;

/**
 * Memoized selector that returns all topics from the store
 * Recalculates only when the topics array changes
 * 
 * @returns {Topic[]} Array of all topics
 */
export const selectAllTopics = createSelector(
  [selectTopicState],
  (state) => state.topics
);

/**
 * Creates a memoized selector that returns a specific topic by ID
 * This is a factory function that generates a new selector
 * 
 * @param {number} id - The ID of the topic to find
 * @returns {Function} A selector that returns the matching topic or undefined
 */
export const selectTopicById = (id: number) => createSelector(
  [selectAllTopics],
  (topics) => topics.find(topic => topic.id === id)
);

/**
 * Memoized selector that returns the current status of topic operations
 * (e.g. 'idle', 'loading', 'succeeded', 'failed')
 * 
 * @returns {string} The current status
 */
export const selectTopicStatus = createSelector(
  [selectTopicState],
  (state) => state.status
);

/**
 * Memoized selector that returns any error message related to topic operations
 * 
 * @returns {string|null} The error message or null if no error
 */
export const selectTopicError = createSelector(
  [selectTopicState],
  (state) => state.error
);