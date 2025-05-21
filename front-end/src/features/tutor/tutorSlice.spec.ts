/**
 * Unit tests for the tutor reducer and associated actions
 */
import { describe, it, expect } from 'vitest';
import tutorReducer, { TutorState } from './tutorSlice';

describe('tutor reducer', () => {
  /**
   * Define the initial state shape for tests to use as a baseline
   */
  const initialState: TutorState = {
    profile: null,
    status: 'idle',
    error: null
  };

  /**
   * Test that the reducer returns the correct initial state
   * when called with undefined state and an unknown action
   */
  it('should handle initial state', () => {
    expect(tutorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  /**
   * Test that the reducer correctly updates the state to 'loading'
   * when a fetchProfile async thunk starts
   */
  it('should handle loading state', () => {
    const actual = tutorReducer(initialState, { 
      type: 'tutor/fetchProfile/pending' 
    });
    expect(actual.status).toEqual('loading');
  });

  /**
   * Test that the reducer correctly:
   * 1. Updates the profile with the payload data
   * 2. Sets the status back to 'idle'
   * 3. Clears any previous errors
   * when a fetchProfile async thunk successfully completes
   */
  it('should handle successful profile fetch', () => {
    // Mock profile data that would come from the API
    const mockProfile = {
      id: 1,
      name: 'Test Tutor',
      expertise: ['Math', 'Science']
    };

    const actual = tutorReducer(initialState, {
      type: 'tutor/fetchProfile/fulfilled',
      payload: mockProfile
    });

    expect(actual.status).toEqual('idle');
    expect(actual.profile).toEqual(mockProfile);
    expect(actual.error).toBeNull();
  });
});