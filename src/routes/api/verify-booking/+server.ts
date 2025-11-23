import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { VEHICLES } from '$lib/data/vehicles.data';
import { PRICING_CONFIG } from '$lib/data/pricing.config';

/**
 * Verify booking details and calculate secure price
 * This ensures the price hasn't been manipulated before final booking
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { vehicleId, distance, tripType, clientCalculatedPrice } = body;

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

		// Find vehicle
		const vehicle = VEHICLES.find((v) => v.id === vehicleId);
		if (!vehicle) {
			return json({ error: 'Vehicle not found' }, { status: 404 });
		}

		// Get pricing config
		const config = PRICING_CONFIG[tripType as 'oneway' | 'roundtrip'];
		const threshold = config.threshold;
		const extraKmRate = config.extraKmRate;
		const driverBata = PRICING_CONFIG.driverBata;

		// Calculate actual distance
		const actualDistance = tripType === 'roundtrip' ? distance * 2 : distance;

		// Calculate chargeable distance
		const chargeableDistance = Math.max(actualDistance, threshold);

		// Get rate per km
		const ratePerKm = tripType === 'oneway' ? vehicle.onewayRatePerKm : vehicle.roundtripRatePerKm;

		// Calculate base fare
		const baseFare = threshold * ratePerKm;

		// Calculate extra km and fee
		const extraKm = Math.max(0, actualDistance - threshold);
		const extraFee = extraKm * extraKmRate;

		// Calculate total fare
		const totalFare = baseFare + extraFee + driverBata;

		// SECURITY CHECK: Compare with client-calculated price
		if (clientCalculatedPrice && Math.abs(clientCalculatedPrice - totalFare) > 1) {
			// Price mismatch detected!
			return json(
				{
					error: 'Price mismatch detected',
					message: 'The price has been recalculated. Please review the updated amount.',
					serverCalculatedPrice: totalFare,
					clientCalculatedPrice,
					difference: Math.abs(clientCalculatedPrice - totalFare)
				},
				{ status: 409 } // 409 Conflict
			);
		}

		// Return verified booking details
		return json({
			success: true,
			verified: true,
			booking: {
				vehicleId,
				vehicleName: vehicle.name,
				tripType,
				actualDistance,
				chargeableDistance,
				threshold,
				ratePerKm,
				baseFare,
				extraKm,
				extraKmRate,
				extraFee,
				driverBata,
				totalFare,
				breakdown: {
					baseCharge: `${threshold}km × ₹${ratePerKm}/km = ₹${baseFare}`,
					extraCharge:
						extraKm > 0 ? `${extraKm}km × ₹${extraKmRate}/km = ₹${extraFee}` : 'No extra charge',
					driverBata: `Driver allowance = ₹${driverBata}`,
					total: `₹${totalFare}`
				}
			}
		});
	} catch (error) {
		console.error('Booking verification error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
