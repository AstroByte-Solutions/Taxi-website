import { writable } from 'svelte/store';
import type { GeocodeResult } from '$lib/geocode/geocode';

interface FormData {
	pickupQuery: string;
	dropoffQuery: string;
	selectedPickup: GeocodeResult | null;
	selectedDropoff: GeocodeResult | null;
	pickupTime: string;
	returnTime: string;
}

const initialFormData: FormData = {
	pickupQuery: '',
	dropoffQuery: '',
	selectedPickup: null,
	selectedDropoff: null,
	pickupTime: '',
	returnTime: ''
};

/**
 * Shared form data store for both oneway and roundtrip forms
 * This allows data to persist when switching between tabs
 */
export const formDataStore = writable<FormData>(initialFormData);

/**
 * Reset form data to initial state
 */
export function resetFormData() {
	formDataStore.set(initialFormData);
}
