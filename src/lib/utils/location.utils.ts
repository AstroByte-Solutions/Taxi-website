import type { GeocodeResult } from '$lib/geocode/geocode';

/**
 * Allowed states for taxi service
 */
const ALLOWED_STATES = ['Tamil Nadu', 'Kerala', 'Puducherry', 'Pondicherry'];

/**
 * Normalize state name for comparison
 */
function normalizeStateName(state: string): string {
	return state.trim().toLowerCase();
}

/**
 * Check if a state is in the allowed list
 */
function isStateAllowed(state: string): boolean {
	const normalized = normalizeStateName(state);
	return ALLOWED_STATES.some((allowedState) => normalizeStateName(allowedState) === normalized);
}

/**
 * Extract state from geocode result
 */
function getStateFromLocation(location: GeocodeResult): string | null {
	return location.address?.state || null;
}

/**
 * Validate if a location is within allowed states
 */
export function isLocationAllowed(location: GeocodeResult): boolean {
	const state = getStateFromLocation(location);
	if (!state) return false;
	return isStateAllowed(state);
}

/**
 * Validate if both pickup and dropoff locations are within allowed states
 */
export function validateLocations(
	pickup: GeocodeResult | null,
	dropoff: GeocodeResult | null
): { ok: boolean; message?: string; invalidLocation?: 'pickup' | 'dropoff' | 'both' } {
	if (!pickup || !dropoff) {
		return { ok: false, message: 'Please select both pickup and dropoff locations.' };
	}

	const pickupState = getStateFromLocation(pickup);
	const dropoffState = getStateFromLocation(dropoff);

	const isPickupAllowed = pickupState ? isStateAllowed(pickupState) : false;
	const isDropoffAllowed = dropoffState ? isStateAllowed(dropoffState) : false;

	if (!isPickupAllowed && !isDropoffAllowed) {
		return {
			ok: false,
			message: `Service is only available in Tamil Nadu, Kerala, and Pondicherry. Both your pickup (${pickupState || 'Unknown'}) and dropoff (${dropoffState || 'Unknown'}) locations are outside our service area.`,
			invalidLocation: 'both'
		};
	}

	if (!isPickupAllowed) {
		return {
			ok: false,
			message: `Service is only available in Tamil Nadu, Kerala, and Pondicherry. Your pickup location (${pickupState || 'Unknown'}) is outside our service area.`,
			invalidLocation: 'pickup'
		};
	}

	if (!isDropoffAllowed) {
		return {
			ok: false,
			message: `Service is only available in Tamil Nadu, Kerala, and Pondicherry. Your dropoff location (${dropoffState || 'Unknown'}) is outside our service area.`,
			invalidLocation: 'dropoff'
		};
	}

	return { ok: true };
}

/**
 * Get list of allowed states
 */
export function getAllowedStates(): string[] {
	return [...ALLOWED_STATES];
}
