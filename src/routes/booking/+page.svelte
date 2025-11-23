<script lang="ts">
	import { goto } from '$app/navigation';
	import { Env_data } from '$lib/constant/url.constant';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { tripStore } from '$lib/stores/tripStore';
	import { vehicleStore } from '$lib/stores/vehicleStore';
	import { formatBookingMessage } from '$lib/utils/whatsapp.utils';
	import { getExtraKmRate } from '$lib/data/pricing.config';
	import { verifyBooking, PriceMismatchError } from '$lib/api/booking.api';
	import type { BookerInfo, TripType } from '$lib/types/trip.types';

	let formData: BookerInfo = {
		name: '',
		contact: '',
		contact2: '',
		email: '',
		pickupAddress: ''
	};

	let tripType: TripType = 'oneway';

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

	// Validation functions
	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function isValidPhone(phone: string): boolean {
		// Indian phone number: 10 digits
		const phoneRegex = /^[6-9]\d{9}$/;
		return phoneRegex.test(phone.replace(/\s+/g, ''));
	}

	function isValidName(name: string): boolean {
		return name.trim().length >= 2;
	}

	function isValidAddress(address: string): boolean {
		return address.trim().length >= 10;
	}

	// Reactive validation state
	$: isNameValid = isValidName(formData.name);
	$: isEmailValid = isValidEmail(formData.email);
	$: isContactValid = isValidPhone(formData.contact);
	$: isContact2Valid = !formData.contact2 || isValidPhone(formData.contact2);
	$: isAddressValid = isValidAddress(formData.pickupAddress);

	// Overall form validity
	$: isFormValid =
		isNameValid && isEmailValid && isContactValid && isContact2Valid && isAddressValid;

	// Error messages
	let errors = {
		name: '',
		email: '',
		contact: '',
		contact2: '',
		pickupAddress: ''
	};

	function validateField(field: keyof BookerInfo) {
		switch (field) {
			case 'name':
				if (!formData.name) {
					errors.name = '';
				} else if (!isNameValid) {
					errors.name = 'Name must be at least 2 characters';
				} else {
					errors.name = '';
				}
				break;
			case 'email':
				if (!formData.email) {
					errors.email = '';
				} else if (!isEmailValid) {
					errors.email = 'Please enter a valid email address';
				} else {
					errors.email = '';
				}
				break;
			case 'contact':
				if (!formData.contact) {
					errors.contact = '';
				} else if (!isContactValid) {
					errors.contact = 'Please enter a valid 10-digit phone number';
				} else {
					errors.contact = '';
				}
				break;
			case 'contact2':
				if (formData.contact2 && !isContact2Valid) {
					errors.contact2 = 'Please enter a valid 10-digit phone number';
				} else {
					errors.contact2 = '';
				}
				break;
			case 'pickupAddress':
				if (!formData.pickupAddress) {
					errors.pickupAddress = '';
				} else if (!isAddressValid) {
					errors.pickupAddress = 'Address must be at least 10 characters';
				} else {
					errors.pickupAddress = '';
				}
				break;
		}
	}

	onMount(() => {
		try {
			const trip = $tripStore;
			const vehicle = $vehicleStore;

			if (!trip || !vehicle) {
				console.warn('Missing tripData or vehicle-details.');
				return;
			}

			// Fill booking details
			tripType = trip.tripType;
			bookingDetails.bookType = trip.tripType === 'roundtrip' ? 'Round Trip' : 'One Way';
			bookingDetails.carType = vehicle.car.name ?? bookingDetails.carType;
			bookingDetails.carDescription = vehicle.car.description ?? bookingDetails.carDescription;
			bookingDetails.pickup = trip.pickup.display_name ?? bookingDetails.pickup;
			bookingDetails.drop = trip.dropoff.display_name ?? bookingDetails.drop;
			bookingDetails.bookedAt = new Date().toLocaleString();
			bookingDetails.pickupDateAndTime = trip.pickupDateAndTime ?? '';
			bookingDetails.returnDateAndTime = trip.returnDateAndTime ?? '';

			formData.pickupAddress = trip.pickup.display_name ?? formData.pickupAddress;

			// Payment details
			const driverBataAmount = 400;
			const totalAmount =
				Math.round((vehicle.baseFare + vehicle.extraFee + driverBataAmount) * 100) / 100;

			paymentDetails = {
				baseFare: {
					km:
						vehicle.chargeableDistance <= vehicle.threshold
							? vehicle.chargeableDistance
							: vehicle.threshold,
					amount: vehicle.baseFare
				},
				additionalFare: {
					km: vehicle.extraKm,
					amount: vehicle.extraFee
				},
				driverBata: {
					km: 0,
					amount: driverBataAmount
				},
				total: totalAmount,
				totalDistance: vehicle.car.distance ?? vehicle.actualDistance
			};
		} catch (err) {
			console.error('Error loading booking details:', err);
		}
	});

	async function sendWhatsAppMessage(event: Event) {
		event.preventDefault();

		// Final validation check
		if (!isFormValid) {
			toast.error('Please fill all required fields correctly');
			return;
		}

		try {
			const trip = $tripStore;
			const vehicle = $vehicleStore;

			if (!trip || !vehicle) {
				toast.warning(
					'Missing trip or vehicle details. Please complete your booking before sharing.'
				);
				return;
			}

			if (!trip.pickup || !trip.dropoff || !vehicle.car) {
				toast.warning('Incomplete booking details. Please check your trip and vehicle selection.');
				return;
			}

			// 🔒 SECURITY: Verify booking on server before proceeding
			toast.loading('Verifying booking details...');

			try {
				const verifiedBooking = await verifyBooking(
					vehicle.car.id,
					vehicle.actualDistance,
					tripType,
					paymentDetails.total // Send client-calculated price for verification
				);

				// Update payment details with server-verified price
				const verifiedTotal = verifiedBooking.totalFare;

				// Check if price differs from what user saw
				if (Math.abs(verifiedTotal - paymentDetails.total) > 1) {
					toast.dismiss();
					toast.warning('Price Updated', {
						description: `Server verified price: ₹${verifiedTotal.toFixed(2)}. Please review before continuing.`,
						duration: 5000
					});

					// Update displayed price
					paymentDetails.total = verifiedTotal;
					paymentDetails.baseFare.amount = verifiedBooking.baseFare;
					paymentDetails.additionalFare.amount = verifiedBooking.extraFee;
					paymentDetails.driverBata.amount = verifiedBooking.driverBata;

					return; // Stop and let user review
				}

				toast.dismiss();
				toast.success('Booking verified! Preparing WhatsApp message...');
			} catch (error) {
				toast.dismiss();

				if (error instanceof PriceMismatchError) {
					toast.error('Price Mismatch Detected!', {
						description: `Server price: ₹${error.serverPrice}, Your price: ₹${error.clientPrice}. Difference: ₹${error.difference}`,
						duration: 6000
					});

					// Update to server price
					paymentDetails.total = error.serverPrice;
					return;
				}

				toast.error('Booking verification failed', {
					description: error instanceof Error ? error.message : 'Please try again'
				});
				return;
			}

			// Proceed with WhatsApp message
			const message = formatBookingMessage(trip, vehicle, formData);
			const encodedMessage = encodeURIComponent(message);
			const whatsAppUrl = `${Env_data.WHATSAPP_LINK}=${encodedMessage}`;

			// Open WhatsApp
			window.open(whatsAppUrl, '_blank');

			// Clear stores after sending
			setTimeout(() => {
				tripStore.reset();
				vehicleStore.reset();
				console.log('Cleared trip and vehicle data after booking.');
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
						onblur={() => validateField('name')}
						placeholder="Enter your name"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
						class:border-red-500={errors.name}
					/>
					{#if errors.name}
						<p class="mt-1 text-sm text-red-600">{errors.name}</p>
					{/if}
				</div>

				<!-- Contact -->
				<div>
					<label for="contact" class="mb-2 block text-sm font-medium text-gray-700">
						Contact <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<span class="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-gray-700"
							>+91</span
						>
						<input
							type="tel"
							id="contact"
							bind:value={formData.contact}
							onblur={() => validateField('contact')}
							placeholder="10-digit mobile number"
							required
							maxlength="10"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 pl-14 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
							class:border-red-500={errors.contact}
						/>
					</div>
					{#if errors.contact}
						<p class="mt-1 text-sm text-red-600">{errors.contact}</p>
					{/if}
				</div>

				<!-- Contact 2 -->
				<div>
					<label for="contact2" class="mb-2 block text-sm font-medium text-gray-700">
						Contact 2 (Optional)
					</label>
					<div class="relative">
						<span class="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-gray-700"
							>+91</span
						>
						<input
							type="tel"
							id="contact2"
							bind:value={formData.contact2}
							onblur={() => validateField('contact2')}
							placeholder="10-digit mobile number"
							maxlength="10"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 pl-14 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
							class:border-red-500={errors.contact2}
						/>
					</div>
					{#if errors.contact2}
						<p class="mt-1 text-sm text-red-600">{errors.contact2}</p>
					{/if}
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
						onblur={() => validateField('email')}
						placeholder="your.email@example.com"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
						class:border-red-500={errors.email}
					/>
					{#if errors.email}
						<p class="mt-1 text-sm text-red-600">{errors.email}</p>
					{/if}
				</div>

				<!-- Pickup Address -->
				<div>
					<label for="pickupAddress" class="mb-2 block text-sm font-medium text-gray-700">
						Pickup Address <span class="text-red-500">*</span>
					</label>
					<textarea
						id="pickupAddress"
						bind:value={formData.pickupAddress}
						onblur={() => validateField('pickupAddress')}
						placeholder="Enter your complete pickup address (minimum 10 characters)"
						required
						rows="4"
						class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
						class:border-red-500={errors.pickupAddress}
					></textarea>
					{#if errors.pickupAddress}
						<p class="mt-1 text-sm text-red-600">{errors.pickupAddress}</p>
					{/if}
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={!isFormValid}
					class="w-full rounded-lg bg-[#051C34] py-4 font-semibold text-white shadow-sm transition-all hover:bg-[#051C34]/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#051C34]"
				>
					Book Now
				</button>

				{#if !isFormValid && (formData.name || formData.email || formData.contact || formData.pickupAddress)}
					<p class="text-center text-sm text-gray-600">
						Please fill all required fields correctly to continue
					</p>
				{/if}
			</form>
		</div>
	</div>
</div>
