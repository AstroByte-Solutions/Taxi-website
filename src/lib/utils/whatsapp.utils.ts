import type { TripData, VehicleDetails, BookerInfo } from '$lib/types/trip.types';
import { getExtraKmRate } from '$lib/data/pricing.config';

/**
 * Format booking details into a WhatsApp message
 */
export function formatBookingMessage(
	trip: TripData,
	vehicle: VehicleDetails,
	booker: BookerInfo
): string {
	const booking = {
		bookType: trip.tripType === 'roundtrip' ? 'Round Trip' : 'One Way',
		pickup: trip.pickup.display_name || 'Unknown',
		drop: trip.dropoff.display_name || 'Unknown',
		carType: vehicle.car.name || 'Unknown',
		carCategory: vehicle.car.category || '—',
		baseFare: vehicle.baseFare || 0,
		bookedAt: new Date().toLocaleString()
	};

	let pickupDateTimeLine = '';
	if (trip.tripType === 'oneway') {
		pickupDateTimeLine = `Pickup Date: ${trip.pickupDateAndTime || '—'}`;
	} else if (trip.tripType === 'roundtrip') {
		pickupDateTimeLine = `Pickup Date: ${trip.pickupDateAndTime || '—'}
Return Date: ${trip.returnDateAndTime || '—'}`;
	}

	const driverBata = 400;
	const extraKm = Number(vehicle.extraKm || 0);
	const extraFee = Number(vehicle.extraFee || 0);
	const extraKmRate = Number(vehicle.extraKmRate || getExtraKmRate(trip.tripType));
	const totalDistance = Number(vehicle.car.distance || vehicle.actualDistance || 0);
	const threshold = Number(vehicle.threshold);
	const totalAmount = Number(vehicle.totalFare || vehicle.baseFare + extraFee + driverBata);

	const message = `
*Taxi Booking Details*
------------------------------------
*Trip Type:* ${booking.bookType}
*Car Type:* ${booking.carType} (${booking.carCategory})
*Pickup:* ${booking.pickup}
*Drop:* ${booking.drop}
*Booked At:* ${booking.bookedAt}

${pickupDateTimeLine}

------------------------------------
*FARE BREAKDOWN*
------------------------------------
*Base Fare (${Math.min(totalDistance, threshold)} km):* Rs.${booking.baseFare.toFixed(2)}
${extraKm > 0 ? `*Extra Km (${extraKm} km @ Rs.${extraKmRate}/km):* Rs.${extraFee.toFixed(2)}` : ''}
*Driver Bata:* Rs.${driverBata}

*Total Distance:* ${totalDistance} km
------------------------------------
*TOTAL AMOUNT:* Rs.${totalAmount.toFixed(2)}
------------------------------------

------------------------------------
*BOOKER DETAILS*
------------------------------------
*Name:* ${booker.name}
*Primary Contact:* ${booker.contact}
${booker.contact2 ? `*Secondary Contact:* ${booker.contact2}` : ''}
*Email:* ${booker.email}

------------------------------------
Thank you for booking with us!`;

	return message;
}
