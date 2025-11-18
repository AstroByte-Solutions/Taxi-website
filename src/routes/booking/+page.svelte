<script lang="ts">
	import { goto } from '$app/navigation';
	import { Env_data } from '$lib/constant/url.constant';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	let formData = {
		name: '',
		contact: '',
		contact2: '',
		email: '',
		pickupAddress: ''
	};

	let tripType = '';

	let bookingDetails = {
		bookType: '',
		carType: '',
		carDescription: '',
		pickup: '',
		drop: '',
		bookedAt: '',
		pickupDateAndTime: '',
		returnDateAndTime: ''
	};

	let paymentDetails = {
		baseFare: { km: 0, amount: 0 },
		additionalFare: { km: 0, amount: 0 },
		driverBata: { km: 0, amount: 0 },
		total: 0,
		totalDistance: 0
	};

	function getExtraKmRate(type: string) {
		return type === 'roundtrip' ? 13 : 14;
	}

	onMount(() => {
		try {
			// Load tripData and vehicle-details safely
			const trip = JSON.parse(localStorage.getItem('tripData') || 'null');
			const vehicle = JSON.parse(localStorage.getItem('vehicle-details') || 'null');

			if (!trip || !vehicle) {
				console.warn('Missing tripData or vehicle-details in localStorage.');
				return;
			}

			// Fill booking details safely
			tripType = trip?.tripType || '';
			bookingDetails.bookType = trip?.tripType === 'roundtrip' ? 'Round Trip' : 'One Way';
			bookingDetails.carType = vehicle?.car?.name ?? bookingDetails.carType;
			bookingDetails.carDescription = vehicle?.car?.description ?? bookingDetails.carDescription;
			bookingDetails.pickup =
				trip?.pickup?.display_name ?? trip?.pickup?.text ?? bookingDetails.pickup;
			bookingDetails.drop =
				trip?.dropoff?.display_name ?? trip?.dropoff?.text ?? bookingDetails.drop;
			bookingDetails.bookedAt = new Date().toLocaleString();

			// Add pickup/return times
			bookingDetails = {
				...bookingDetails,
				pickupDateAndTime: trip?.pickupDateAndTime ?? '',
				returnDateAndTime: trip?.returnDateAndTime ?? ''
			};

			formData.pickupAddress =
				trip?.pickup?.display_name ?? trip?.pickup?.text ?? formData.pickupAddress;

			// Read from the correct property names
			const actualDistance = Number(vehicle?.actualDistance ?? 0);
			const chargeableDistance = Number(vehicle?.chargeableDistance ?? actualDistance);
			const threshold = Number(vehicle?.threshold ?? (trip?.tripType === 'roundtrip' ? 250 : 130));
			const baseFareAmount = Number(vehicle?.baseFare ?? 0);
			const extraKm = Number(vehicle?.extraKm ?? 0);
			const extraFee = Number(vehicle?.extraFee ?? 0);
			const driverBataAmount = 400;

			// Total = base fare + extra km charges + driver bata
			const totalAmount = Math.round((baseFareAmount + extraFee + driverBataAmount) * 100) / 100;

			// Show the chargeable distance in UI (minimum base km or actual if higher)
			paymentDetails = {
				baseFare: {
					km: chargeableDistance <= threshold ? chargeableDistance : threshold,
					amount: baseFareAmount
				},
				additionalFare: {
					km: extraKm,
					amount: extraFee
				},
				driverBata: {
					km: 0,
					amount: driverBataAmount
				},
				total: totalAmount,
				totalDistance: vehicle?.car?.distance
			};
		} catch (err) {
			console.error('Error loading booking details from localStorage:', err);
		}
	});

	function sendWhatsAppMessage() {
		try {
			const tripRaw = localStorage.getItem('tripData');
			const vehicleRaw = localStorage.getItem('vehicle-details');

			if (!tripRaw || !vehicleRaw) {
				toast.warning(
					'Missing trip or vehicle details. Please complete your booking before sharing.'
				);
				return;
			}

			const trip = JSON.parse(tripRaw);
			const vehicle = JSON.parse(vehicleRaw);

			if (!trip?.pickup || !trip?.dropoff || !vehicle?.car) {
				toast.warning('Incomplete booking details. Please check your trip and vehicle selection.');
				return;
			}

			const booking = {
				bookType: trip?.tripType === 'roundtrip' ? 'Round Trip' : 'One Way',
				pickup: trip?.pickup?.display_name || trip?.pickup?.text || 'Unknown',
				drop: trip?.dropoff?.display_name || trip?.dropoff?.text || 'Unknown',
				carType: vehicle?.car?.name || 'Unknown',
				carCategory: vehicle?.car?.category || '—',
				baseFare: vehicle?.baseFare || vehicle?.car?.estimatedFare || 0,
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
			const extraKm = Number(vehicle?.extraKm || 0);
			const extraFee = Number(vehicle?.extraFee || 0);
			const extraKmRate = Number(
				vehicle?.extraKmRate || (trip?.tripType === 'roundtrip' ? 13 : 14)
			);
			const totalDistance = Number(vehicle?.car?.distance || 0);
			const threshold = Number(vehicle?.threshold || (trip?.tripType === 'roundtrip' ? 250 : 130));

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
*TOTAL AMOUNT:* Rs.${paymentDetails.total.toFixed(2)}
------------------------------------

------------------------------------
*BOOKER DETAILS*
------------------------------------
*Name:* ${formData.name}
*Primary Contact:* ${formData.contact}
${formData.contact2 ? `*Secondary Contact:* ${formData.contact2}` : ''}
*Email:* ${formData.email}

------------------------------------
Thank you for booking with us!`;

			const encodedMessage = encodeURIComponent(message);
			const whatsAppUrl = `${Env_data.WHATSAPP_LINK}=${encodedMessage}`;

			// Open WhatsApp
			window.open(whatsAppUrl, '_blank');

			// Clear localStorage after sending
			setTimeout(() => {
				localStorage.removeItem('tripData');
				localStorage.removeItem('vehicle-details');
				console.log('Cleared tripData and vehicle-details after booking.');
				toast.success('Booking details sent successfully!');
			}, 2000);

			// Redirect to home
			setTimeout(() => {
				goto('/');
			}, 2500);
		} catch (err) {
			console.error('Error preparing WhatsApp message:', err);
			toast.error('Failed to prepare WhatsApp message.');
		}
	}
	function handleBack() {
		window.history.back();
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
	<!-- Back Button -->
	<div class="mx-auto mb-6 max-w-7xl">
		<div class="flex gap-4">
			<button
				onclick={handleBack}
				class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 active:scale-95"
				aria-label="Go back"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<h1 class="text-xl font-bold text-gray-900 lg:text-2xl">Booking</h1>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Left Column - Booking Summary -->
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Booking Summary</h2>

			<!-- Booking Details -->
			<div class="mb-8 space-y-4">
				<div class="flex items-start justify-between">
					<span class="text-sm font-medium text-gray-700">Book Type</span>
					<span class="text-sm font-medium text-gray-900">{bookingDetails.bookType}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Car Type</span>
					<div class="text-right">
						<div class="text-sm font-medium text-gray-900">{bookingDetails.carType}</div>
						<div class="mt-1 text-xs text-gray-500">{bookingDetails.carDescription}</div>
					</div>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Pickup</span>
					<span class="text-right text-sm text-gray-900">{bookingDetails.pickup}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Drop</span>
					<span class="text-right text-sm text-gray-900">{bookingDetails.drop}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Booked At</span>
					<span class="text-sm text-gray-900">{bookingDetails.bookedAt}</span>
				</div>
			</div>

			<!-- Payment Details -->
			<h3 class="mb-4 text-xl font-bold text-gray-900">Payment Details</h3>

			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div>
						<span class="text-sm font-medium text-gray-700">Base Fare</span>
						<span class="ml-1 text-xs text-gray-500">[{paymentDetails.baseFare.km} Km]</span>
					</div>
					<span class="text-sm font-semibold text-gray-900"
						>₹ {paymentDetails.baseFare.amount.toFixed(2)}</span
					>
				</div>

				<div class="flex flex-col border-t border-gray-100 pt-3">
					<!-- Always show label and amount -->
					<div class="flex items-center justify-between">
						<div>
							<span class="text-sm font-medium text-gray-700">Additional Fare</span>
							<span class="ml-1 text-xs text-gray-500">
								[{paymentDetails.additionalFare.km} km]
							</span>
						</div>

						<span class="text-sm font-semibold text-gray-900">
							₹ {paymentDetails.additionalFare.amount.toFixed(2)}
						</span>
					</div>

					<!-- Only show message if extra fare applies -->
					{#if paymentDetails.additionalFare.km > 0}
						<p class="mt-1 text-xs text-gray-500 italic">
							Extra {tripType === 'roundtrip' ? 'round trip' : 'one way'} distance — ₹{getExtraKmRate(
								tripType
							)}/km applied for
							{paymentDetails.additionalFare.km} km.
						</p>
					{/if}
				</div>

				<div class="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span class="text-sm font-medium text-gray-700">Driver Bata</span>
						<!-- <span class="ml-1 text-xs text-gray-500">[upto {paymentDetails.driverBata.km} Km]</span> -->
					</div>
					<span class="text-sm font-semibold text-gray-900"
						>₹ {paymentDetails.driverBata.amount.toFixed(2)}</span
					>
				</div>

				<div class="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span class="text-sm font-medium text-gray-700">Additional Charges</span>
						<span class="ml-1 text-xs text-gray-500">[Toll, Parking, Permit - As applicable]</span>
					</div>
					<span class="text-sm font-semibold text-gray-900">Extra fee</span>
				</div>

				<!-- Total Distance -->
				<div class="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span class="text-sm font-medium text-gray-700">Total Distance</span>
					</div>
					<span class="text-sm font-semibold text-gray-900">{paymentDetails.totalDistance} km</span>
				</div>

				<!-- Total Amount -->
				<div class="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
					<div class="flex items-center justify-between">
						<span class="text-base font-bold text-gray-900">Total Amount</span>
						<span class="text-xl font-bold text-gray-900">₹ {paymentDetails.total.toFixed(2)}</span>
					</div>
				</div>
			</div>

			<!-- Note -->
			<div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<p class="text-sm text-gray-700">
					<span class="font-semibold">Note:</span> The actual bill amount might differ based on actual
					KMs travel, Waiting time (for Oneway only), Hill-station charges, Inter-state Permits,Toll
					Charges, parking etc.
				</p>
			</div>
		</div>

		<!-- Right Column - Booking Form -->
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Make Your Booking</h2>

			<form onsubmit={sendWhatsAppMessage} class="space-y-5">
				<!-- Name -->
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
						Name <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						placeholder="Enter your name"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Contact -->
				<div>
					<label for="contact" class="mb-2 block text-sm font-medium text-gray-700">
						Contact <span class="text-red-500">*</span>
					</label>
					<input
						type="tel"
						id="contact"
						bind:value={formData.contact}
						placeholder="Mobile Number"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Contact 2 -->
				<div>
					<label for="contact2" class="mb-2 block text-sm font-medium text-gray-700">
						Contact 2
					</label>
					<input
						type="tel"
						id="contact2"
						bind:value={formData.contact2}
						placeholder="Mobile Number"
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Email <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						placeholder="Enter your email"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Pickup Address -->
				<div>
					<label for="pickupAddress" class="mb-2 block text-sm font-medium text-gray-700">
						Pickup Address <span class="text-red-500">*</span>
					</label>
					<textarea
						id="pickupAddress"
						bind:value={formData.pickupAddress}
						placeholder="Enter your pickup address"
						required
						rows="4"
						class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="hover:bg-primary-600 w-full rounded-lg bg-[#051C34] py-4 font-semibold text-white shadow-sm transition-colors"
				>
					Book Now
				</button>
			</form>
		</div>
	</div>
</div>
