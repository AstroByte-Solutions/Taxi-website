import type { TripData, ValidationResult } from '$lib/types/trip.types';

/**
 * Validate trip data for completeness
 */
export function validateTripData(data: Partial<TripData>): ValidationResult {
	if (!data.pickup) {
		return { ok: false, message: 'Please select a pickup location.' };
	}
	if (!data.dropoff) {
		return { ok: false, message: 'Please select a dropoff location.' };
	}
	if (!data.pickupDateAndTime) {
		return { ok: false, message: 'Please select pickup date & time.' };
	}

	const pickupValid = validateDateTime(data.pickupDateAndTime);
	if (!pickupValid) {
		return { ok: false, message: 'Invalid pickup date/time.' };
	}

	// For roundtrip, validate return time
	if (data.tripType === 'roundtrip') {
		if (!data.returnDateAndTime) {
			return { ok: false, message: 'Please select return date & time.' };
		}

		const returnValid = validateDateTime(data.returnDateAndTime);
		if (!returnValid) {
			return { ok: false, message: 'Invalid return date/time.' };
		}

		const rangeValid = validateDateRange(data.pickupDateAndTime, data.returnDateAndTime);
		if (!rangeValid) {
			return { ok: false, message: 'Return time must be after pickup time.' };
		}
	}

	return { ok: true };
}

/**
 * Validate a datetime string
 */
export function validateDateTime(dateTime: string): boolean {
	if (!dateTime) return false;
	const timestamp = new Date(dateTime).getTime();
	return !isNaN(timestamp);
}

/**
 * Validate that return date is after pickup date
 */
export function validateDateRange(pickupDateTime: string, returnDateTime: string): boolean {
	const pickup = new Date(pickupDateTime).getTime();
	const returnTime = new Date(returnDateTime).getTime();

	if (isNaN(pickup) || isNaN(returnTime)) return false;
	return returnTime > pickup;
}
