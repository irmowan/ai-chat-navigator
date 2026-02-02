// Chrome Storage API wrapper

import { NavigatorState } from '../types';
import { CONSTANTS } from './constants';

/**
 * Get navigator state from storage
 */
export async function getNavigatorState(): Promise<NavigatorState | null> {
  try {
    const result = await chrome.storage.local.get(CONSTANTS.STORAGE_KEYS.NAVIGATOR_STATE);
    const state = result[CONSTANTS.STORAGE_KEYS.NAVIGATOR_STATE];
    return state ? state as NavigatorState : null;
  } catch (error) {
    console.error('[AI Navigator] Error reading storage:', error);
    return null;
  }
}

/**
 * Save navigator state to storage
 */
export async function saveNavigatorState(state: NavigatorState): Promise<void> {
  try {
    await chrome.storage.local.set({
      [CONSTANTS.STORAGE_KEYS.NAVIGATOR_STATE]: state,
    });
  } catch (error) {
    console.error('[AI Navigator] Error saving storage:', error);
  }
}

/**
 * Clear all stored data
 */
export async function clearStorage(): Promise<void> {
  try {
    await chrome.storage.local.clear();
  } catch (error) {
    console.error('[AI Navigator] Error clearing storage:', error);
  }
}
