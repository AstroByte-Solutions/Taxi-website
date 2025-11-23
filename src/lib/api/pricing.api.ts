/**
 * Secure API client for price calculations
 * This ensures all price calculations happen on the server, preventing manipulation
 */

export interface PriceCalculationRequest {
	vehicleId: number;
	distance: number;
	tripType: 'oneway' | 'roundtrip';
}

export interface PriceCalculationResponse {
	success: true;
	calculation: {
		vehicleId: number;
		vehicleName: string;
		tripType: string;
		actualDistance: number;
		chargeableDistance: number;
		threshold: number;
		ratePerKm: number;
		baseFare: number;
		extraKm: number;
		extraKmRate: number;
		extraFee: number;
		totalFare: number;
		driverBata: number;
		breakdown: {
			baseCharge: string;
			extraCharge: string;
			total: string;
		};
	};
}

export interface PriceCalculationError {
	error: string;
}

/**
 * Calculate price securely on the server
 * @param vehicleId - ID of the selected vehicle
 * @param distance - Distance in kilometers
 * @param tripType - Type of trip ('oneway' or 'roundtrip')
 * @returns Secure price calculation from server
 * @throws Error if calculation fails
 */
export async function calculateSecurePrice(
	vehicleId: number,
	distance: number,
	tripType: 'oneway' | 'roundtrip'
): Promise<PriceCalculationResponse['calculation']> {
	try {
		const response = await fetch('/api/calculate-price', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				vehicleId,
				distance,
				tripType
			} satisfies PriceCalculationRequest)
		});

		if (!response.ok) {
			const errorData: PriceCalculationError = await response.json();
			throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
		}

		const data: PriceCalculationResponse = await response.json();

		if (!data.success) {
			throw new Error('Price calculation failed');
		}

		return data.calculation;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Failed to calculate price. Please try again.');
	}
}

/**
 * Calculate prices for multiple vehicles at once
 * @param vehicles - Array of vehicle IDs
 * @param distance - Distance in kilometers
 * @param tripType - Type of trip
 * @returns Array of price calculations
 */
export async function calculateMultiplePrices(
	vehicleIds: number[],
	distance: number,
	tripType: 'oneway' | 'roundtrip'
): Promise<PriceCalculationResponse['calculation'][]> {
	const promises = vehicleIds.map((vehicleId) =>
		calculateSecurePrice(vehicleId, distance, tripType)
	);

	return Promise.all(promises);
}
