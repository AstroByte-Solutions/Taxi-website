import { writable } from 'svelte/store';
import type { TripData } from '$lib/types/trip.types';
import { storage } from '$lib/services/storage.service';

const STORAGE_KEY = 'tripData';

/**
 * Create a persistent store for trip data
 */
function createTripStore() {
	// Initialize from localStorage
	const initialValue = storage.getItem<TripData>(STORAGE_KEY);
	const { subscribe, set, update } = writable<TripData | null>(initialValue);

	return {
		subscribe,
		set: (value: TripData | null) => {
			if (value) {
				storage.setItem(STORAGE_KEY, value);
			} else {
				storage.removeItem(STORAGE_KEY);
			}
			set(value);
		},
		update: (fn: (value: TripData | null) => TripData | null) => {
			update((current) => {
				const newValue = fn(current);
				if (newValue) {
					storage.setItem(STORAGE_KEY, newValue);
				} else {
					storage.removeItem(STORAGE_KEY);
				}
				return newValue;
			});
		},
		reset: () => {
			storage.removeItem(STORAGE_KEY);
			set(null);
		}
	};
}

export const tripStore = createTripStore();
