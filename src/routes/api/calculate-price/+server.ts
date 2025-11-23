import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { VEHICLES } from '$lib/data/vehicles.data';
import { PRICING_CONFIG } from '$lib/data/pricing.config';
import type { TripType } from '$lib/types/trip.types';

// Server-side price calculation - SECURE, cannot be manipulated by users
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { vehicleId, distance, tripType } = body;

		// Validation
		if (!vehicleId || !distance || !tripType) {
			return json(
				{ error: 'Missing required fields: vehicleId, distance, tripType' },
				{ status: 400 }
			);
		}

		if (typeof distance !== 'number' || distance <= 0) {
			return json({ error: 'Invalid distance' }, { status: 400 });
		}

		if (tripType !== 'oneway' && tripType !== 'roundtrip') {
			return json({ error: 'Invalid trip type' }, { status: 400 });
		}

		// Type assertion after validation - we know tripType is valid here
		const validatedTripType = tripType as TripType;

		// Find vehicle (server-side data, cannot be tampered)
		const vehicle = VEHICLES.find((v) => v.id === vehicleId);
		if (!vehicle) {
			return json({ error: 'Vehicle not found' }, { status: 404 });
		}

		// Get pricing config (server-side, secure)
		const config = PRICING_CONFIG[validatedTripType];
		const threshold = config.threshold;
		const extraKmRate = config.extraKmRate;

		// Calculate actual distance based on trip type
		const actualDistance = validatedTripType === 'roundtrip' ? distance * 2 : distance;

		// Calculate chargeable distance (minimum threshold applies)
		const chargeableDistance = Math.max(actualDistance, threshold);

		// Get rate per km for this vehicle and trip type
		const ratePerKm =
			validatedTripType === 'oneway' ? vehicle.onewayRatePerKm : vehicle.roundtripRatePerKm;

		// Calculate base fare (threshold * rate)
		const baseFare = threshold * ratePerKm;

		// Calculate extra km and extra fee
		const extraKm = Math.max(0, actualDistance - threshold);
		const extraFee = extraKm * extraKmRate;

		// Calculate total fare
		const totalFare = baseFare + extraFee;

		// Return secure calculation
		return json({
			success: true,
			calculation: {
				vehicleId,
				vehicleName: vehicle.name,
				tripType: validatedTripType,
				actualDistance,
				chargeableDistance,
				threshold,
				ratePerKm,
				baseFare,
				extraKm,
				extraKmRate,
				extraFee,
				totalFare,
				driverBata: PRICING_CONFIG.driverBata,
				// Include breakdown for transparency
				breakdown: {
					baseCharge: `${threshold}km x ₹${ratePerKm}/km = ₹${baseFare}`,
					extraCharge:
						extraKm > 0 ? `${extraKm}km x ₹${extraKmRate}/km = ₹${extraFee}` : 'No extra charge',
					total: `₹${totalFare}`
				}
			}
		});
	} catch (error) {
		console.error('Price calculation error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
