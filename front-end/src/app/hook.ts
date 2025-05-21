import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Custom hook to use the AppDispatch type in components.
 * This ensures that the dispatch function is correctly typed
 * for the application's Redux store.
 * 
 * @returns {AppDispatch} The typed dispatch function
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;