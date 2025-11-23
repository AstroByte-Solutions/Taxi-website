import type { Car, FareBreakdown, Location, TripType } from '$lib/types/trip.types';
import { getThreshold, getExtraKmRate, getDriverBata } from '$lib/data/pricing.config';

/**
 * Calculate distance between two locations using Haversine formula
 */
export function calculateDistance(from: Location, to: Location): number {
	const R = 6371; // Earth's radius in km
	const lat1 = parseFloat(from.lat.toString());
	const lon1 = parseFloat(from.lon.toString());
	const lat2 = parseFloat(to.lat.toString());
	const lon2 = parseFloat(to.lon.toString());

	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Number((R * c).toFixed(2));
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

/**
 * Calculate fare breakdown for a car and trip
 */
export function calculateFare(car: Car, distance: number, tripType: TripType): FareBreakdown {
	const isRound = tripType === 'roundtrip';
	const baseDistance = distance;
	const adjustedDistance = isRound ? baseDistance * 2 : baseDistance;
	const threshold = getThreshold(tripType);
	const extraRate = getExtraKmRate(tripType);
	const driverBata = getDriverBata();

	// Get the base rate per km for this trip type
	const baseRate = isRound ? car.roundtripRatePerKm : car.onewayRatePerKm;

	// Apply minimum base km: charge for threshold even if distance is less
	const chargeableDistance = Math.max(adjustedDistance, threshold);

	// Calculate base fare (up to threshold)
	const baseChargeDistance = Math.min(chargeableDistance, threshold);
	const baseFare = Number((baseRate * baseChargeDistance).toFixed(2));

	// Calculate extra km beyond threshold
	const extraKm = Math.max(0, chargeableDistance - threshold);
	const extraFee = Number((extraKm * extraRate).toFixed(2));

	// Total fare
	const total = Number((baseFare + extraFee + driverBata).toFixed(2));

	return {
		baseFare,
		baseKm: Number(baseChargeDistance.toFixed(2)),
		extraKm: Number(extraKm.toFixed(2)),
		extraFee,
		driverBata,
		total,
		actualDistance: Number(adjustedDistance.toFixed(2)),
		chargeableDistance: Number(chargeableDistance.toFixed(2)),
		threshold
	};
}

/**
 * Calculate fare for display purposes (returns car with fare info)
 */
export function calculateCarFare(car: Car, distance: number, tripType: TripType): Car {
	const fareBreakdown = calculateFare(car, distance, tripType);
	const isRound = tripType === 'roundtrip';
	const baseRate = isRound ? car.roundtripRatePerKm : car.onewayRatePerKm;

	return {
		...car,
		pricePerKm: baseRate,
		estimatedFare: fareBreakdown.baseFare,
		distance: fareBreakdown.actualDistance,
		extraKm: fareBreakdown.extraKm,
		extraFee: fareBreakdown.extraFee
	};
}
