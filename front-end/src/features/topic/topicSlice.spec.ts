import { describe, it, expect } from 'vitest';
import reducer, { TopicState, fetchTopics, createTopic } from './topicSlice';
import { AnyAction } from '@reduxjs/toolkit';

describe('topic reducer', () => {
  const initialState: TopicState = {
    topics: [],
    status: 'idle',
    error: null
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchTopics.pending', () => {
    const actual = reducer(initialState, {
      type: fetchTopics.pending.type,
      payload: undefined
    } as AnyAction);
    expect(actual.status).toEqual('loading');
  });

  it('should handle fetchTopics.fulfilled', () => {
    const topics = [
      { id: 1, name: 'Math', description: 'Mathematics' },
      { id: 2, name: 'Physics', description: 'Physics basics' }
    ];
    const actual = reducer(initialState, fetchTopics.fulfilled(topics, ''));
    expect(actual.topics).toEqual(topics);
    expect(actual.status).toEqual('idle');
  });

  it('should handle createTopic.fulfilled', () => {
    const newTopic = { id: 1, name: 'Math', description: 'Mathematics' };
    const actual = reducer(initialState, createTopic.fulfilled(newTopic, '', { name: 'Math', description: 'Mathematics' }));
    expect(actual.topics).toContainEqual(newTopic);
  });
});