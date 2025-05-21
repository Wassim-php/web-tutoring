/**
 * Unit tests for the topic reducer and associated async thunks
 * Tests the behavior of the reducer with different action types
 */
import { describe, it, expect } from 'vitest';
import reducer, { TopicState, fetchTopics, createTopic } from './topicSlice';
import { AnyAction } from '@reduxjs/toolkit';

describe('topic reducer', () => {
  /**
   * Define the initial state for testing - empty topics array with idle status
   */
  const initialState: TopicState = {
    topics: [],
    status: 'idle',
    error: null
  };

  /**
   * Test that the reducer correctly initializes with default state
   * when provided with undefined state and an unknown action
   */
  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  /**
   * Test that the reducer correctly updates the status to 'loading'
   * when fetchTopics async thunk is pending
   */
  it('should handle fetchTopics.pending', () => {
    const actual = reducer(initialState, {
      type: fetchTopics.pending.type,
      payload: undefined
    } as AnyAction);
    expect(actual.status).toEqual('loading');
  });

  /**
   * Test that the reducer correctly:
   * 1. Updates the topics array with fetched data
   * 2. Sets status back to 'idle' when fetch completes
   * when fetchTopics async thunk is fulfilled
   */
  it('should handle fetchTopics.fulfilled', () => {
    // Mock topic data that would be returned from the API
    const topics = [
      { id: 1, name: 'Math', description: 'Mathematics' },
      { id: 2, name: 'Physics', description: 'Physics basics' }
    ];
    const actual = reducer(initialState, fetchTopics.fulfilled(topics, ''));
    expect(actual.topics).toEqual(topics);
    expect(actual.status).toEqual('idle');
  });

  /**
   * Test that the reducer correctly:
   * 1. Adds a newly created topic to the topics array
   * when createTopic async thunk is fulfilled
   */
  it('should handle createTopic.fulfilled', () => {
    // Mock new topic data
    const newTopic = { id: 1, name: 'Math', description: 'Mathematics' };
    const actual = reducer(initialState, createTopic.fulfilled(newTopic, '', { name: 'Math', description: 'Mathematics' }));
    expect(actual.topics).toContainEqual(newTopic);
  });
});