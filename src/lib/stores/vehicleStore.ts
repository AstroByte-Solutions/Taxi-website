import { writable } from 'svelte/store';
import type { VehicleDetails } from '$lib/types/trip.types';
import { storage } from '$lib/services/storage.service';

const STORAGE_KEY = 'vehicle-details';

/**
 * Create a persistent store for vehicle selection
 */
function createVehicleStore() {
	// Initialize from localStorage
	const initialValue = storage.getItem<VehicleDetails>(STORAGE_KEY);
	const { subscribe, set, update } = writable<VehicleDetails | null>(initialValue);

	return {
		subscribe,
		set: (value: VehicleDetails | null) => {
			if (value) {
				storage.setItem(STORAGE_KEY, value);
			} else {
				storage.removeItem(STORAGE_KEY);
			}
			set(value);
		},
		update: (fn: (value: VehicleDetails | null) => VehicleDetails | null) => {
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

export const vehicleStore = createVehicleStore();
