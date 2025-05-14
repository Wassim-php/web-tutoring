import { describe, it, expect } from 'vitest';
import tutorReducer, { TutorState } from './tutorSlice';

describe('tutor reducer', () => {
  const initialState: TutorState = {
    profile: null,
    status: 'idle',
    error: null
  };

  it('should handle initial state', () => {
    expect(tutorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loading state', () => {
    const actual = tutorReducer(initialState, { 
      type: 'tutor/fetchProfile/pending' 
    });
    expect(actual.status).toEqual('loading');
  });

  it('should handle successful profile fetch', () => {
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