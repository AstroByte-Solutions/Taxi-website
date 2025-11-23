/**
 * Secure API client for booking verification
 */

export interface BookingVerificationRequest {
	vehicleId: number;
	distance: number;
	tripType: 'oneway' | 'roundtrip';
	clientCalculatedPrice?: number;
}

export interface BookingVerificationResponse {
	success: true;
	verified: true;
	booking: {
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
		driverBata: number;
		totalFare: number;
		breakdown: {
			baseCharge: string;
			extraCharge: string;
			driverBata: string;
			total: string;
		};
	};
}

export interface BookingVerificationError {
	error: string;
	message?: string;
	serverCalculatedPrice?: number;
	clientCalculatedPrice?: number;
	difference?: number;
}

/**
 * Verify booking details and price on the server before final booking
 * This prevents price manipulation attacks
 *
 * @param vehicleId - ID of the selected vehicle
 * @param distance - Distance in kilometers
 * @param tripType - Type of trip ('oneway' or 'roundtrip')
 * @param clientCalculatedPrice - Optional price calculated on client for verification
 * @returns Verified booking details with server-calculated price
 * @throws Error if verification fails or price mismatch detected
 */
export async function verifyBooking(
	vehicleId: number,
	distance: number,
	tripType: 'oneway' | 'roundtrip',
	clientCalculatedPrice?: number
): Promise<BookingVerificationResponse['booking']> {
	try {
		const response = await fetch('/api/verify-booking', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				vehicleId,
				distance,
				tripType,
				clientCalculatedPrice
			} satisfies BookingVerificationRequest)
		});

		if (!response.ok) {
			const errorData: BookingVerificationError = await response.json();

			// Handle price mismatch specifically
			if (response.status === 409 && errorData.serverCalculatedPrice) {
				throw new PriceMismatchError(
					errorData.message || 'Price mismatch detected',
					errorData.serverCalculatedPrice,
					errorData.clientCalculatedPrice || 0,
					errorData.difference || 0
				);
			}

			throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
		}

		const data: BookingVerificationResponse = await response.json();

		if (!data.success || !data.verified) {
			throw new Error('Booking verification failed');
		}

		return data.booking;
	} catch (error) {
		if (error instanceof PriceMismatchError || error instanceof Error) {
			throw error;
		}
		throw new Error('Failed to verify booking. Please try again.');
	}
}

/**
 * Custom error for price mismatch scenarios
 */
export class PriceMismatchError extends Error {
	constructor(
		message: string,
		public serverPrice: number,
		public clientPrice: number,
		public difference: number
	) {
		super(message);
		this.name = 'PriceMismatchError';
	}
}
