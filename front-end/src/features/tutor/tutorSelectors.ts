import { RootState } from '../../app/store';
import { TutorState } from './tutorSlice';
import { createSelector } from '@reduxjs/toolkit';
const selectTutorState = (state: RootState) => state.tutor;

export const selectTutorProfile = (state: RootState) => {
    // First try to get from Redux state
    if (state.tutor?.profile) {
        return state.tutor.profile;
    }

    // If not in Redux state, try localStorage
    const savedProfile = localStorage.getItem('tutorProfile');
    if (savedProfile) {
        try {
            const parsedProfile = JSON.parse(savedProfile);
            return parsedProfile;
        } catch (error) {
            console.error('Error parsing saved profile:', error);
            // Remove invalid data from localStorage
            localStorage.removeItem('tutorProfile');
        }
    }

    return null;
};

export const selectTutorStatus = createSelector(
    [selectTutorState],
    (tutorState) => tutorState.status
);

export const selectTutorError = createSelector(
    [selectTutorState],
    (tutorState) => tutorState.error
);