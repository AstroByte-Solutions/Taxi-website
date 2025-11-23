<script lang="ts">
	import { goto } from '$app/navigation';
	import Door from '$lib/icons/door.svelte';
	import Frost from '$lib/icons/frost.svelte';
	import Profile from '$lib/icons/profile.svelte';
	import Star from '$lib/icons/star.svelte';
	import Transimission from '$lib/icons/transimission.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { tripStore } from '$lib/stores/tripStore';
	import { vehicleStore } from '$lib/stores/vehicleStore';
	import { VEHICLES } from '$lib/data/vehicles.data';
	import { calculateDistance, calculateCarFare, calculateFare } from '$lib/utils/pricing.utils';
	import { getThreshold, getExtraKmRate } from '$lib/data/pricing.config';
	import type { Car, TripType, VehicleDetails } from '$lib/types/trip.types';

	let cars: Car[] = [];
	let tripType: TripType = 'oneway';
	let distanceKm = 0;
	let selectedCarId: number | null = null;
	let isInitialized = false;
	let previousTripType: TripType | null = null;

	function handleBack() {
		window.history.back();
	}

	// Safe toast helper to prevent race conditions
	function safeToast(type: 'info' | 'error' | 'success' | 'warning', title: string, options?: any) {
		setTimeout(() => {
			try {
				toast[type](title, options);
			} catch (err) {
				console.error('Toast error:', err);
			}
		}, 50);
	}

	onMount(() => {
		let loadingToastId: string | number | undefined;

		try {
			loadingToastId = toast.loading('Loading trip details...');
		} catch (err) {
			console.error('Loading toast error:', err);
		}

		try {
			const trip = $tripStore;

			if (!trip) {
				if (loadingToastId) toast.dismiss(loadingToastId);
				setTimeout(() => {
					toast.error('No trip data found', {
						description: 'Please start by selecting your trip details on the home page.',
						action: {
							label: 'Go Home',
							onClick: () => goto('/')
						}
					});
				}, 100);
				setTimeout(() => goto('/'), 2000);
				return;
			}

			const pickup = trip.pickup;
			const dropoff = trip.dropoff;

			if (!pickup || !dropoff) {
				if (loadingToastId) toast.dismiss(loadingToastId);
				setTimeout(() => {
					toast.error('Invalid trip data', {
						description: 'Pickup or dropoff location is missing.'
					});
				}, 100);
				return;
			}

			tripType = trip.tripType;
			previousTripType = trip.tripType;
			distanceKm = calculateDistance(pickup, dropoff);

			updateFare();

			if (loadingToastId) toast.dismiss(loadingToastId);

			setTimeout(() => {
				toast.info('Trip loaded successfully!', {
					description: `${distanceKm} km ${tripType} journey calculated.`
				});
				isInitialized = true;
			}, 150);
		} catch (err) {
			if (loadingToastId) toast.dismiss(loadingToastId);
			setTimeout(() => {
				toast.error('Failed to load trip details', {
					description: err instanceof Error ? err.message : 'Unknown error occurred'
				});
			}, 100);
			console.error('Error loading trip:', err);
		}
	});

	// Watch for trip type changes AFTER initialization
	$: if (isInitialized && tripType !== previousTripType && previousTripType !== null) {
		previousTripType = tripType;
		updateFare();
		showTripTypeToast();
	}

	function showTripTypeToast() {
		if (distanceKm === 0) return;

		const isRound = tripType === 'roundtrip';
		const adjustedDistance = isRound ? distanceKm * 2 : distanceKm;
		const threshold = getThreshold(tripType);
		const minKmNote =
			adjustedDistance < threshold ? ` (Minimum ${threshold}km charge applies)` : '';

		safeToast('info', `Switched to ${tripType}`, {
			description: `Prices for ${adjustedDistance}km journey${minKmNote}`
		});
	}

	function updateFare() {
		if (distanceKm === 0) return;
		cars = VEHICLES.map((car) => calculateCarFare(car, distanceKm, tripType));
	}

	function handleBookNow(car: Car) {
		let bookingToastId: string | number | undefined;

		try {
			bookingToastId = toast.loading(`Booking ${car.name}...`);
		} catch (err) {
			console.error('Booking toast error:', err);
		}

		try {
			const trip = $tripStore;
			if (!trip) {
				if (bookingToastId) toast.dismiss(bookingToastId);
				safeToast('error', 'Trip data not found', {
					description: 'Please start from the home page.'
				});
				return;
			}

			if (trip.tripType !== tripType) {
				if (bookingToastId) toast.dismiss(bookingToastId);
				safeToast('warning', 'Trip type mismatch detected!', {
					description: `Your original selection was "${trip.tripType}" but you're viewing "${tripType}" rates.`,
					action: {
						label: 'Go Back',
						onClick: () => goto('/')
					},
					duration: 6000
				});
				return;
			}

			const fareBreakdown = calculateFare(car, distanceKm, tripType);
			const extraKmRate = getExtraKmRate(tripType);

			const vehicleDetails: VehicleDetails = {
				selectedAt: Date.now(),
				tripType,
				actualDistance: fareBreakdown.actualDistance,
				chargeableDistance: fareBreakdown.chargeableDistance,
				threshold: fareBreakdown.threshold,
				extraKm: fareBreakdown.extraKm,
				extraFee: fareBreakdown.extraFee,
				baseFare: fareBreakdown.baseFare,
				totalFare: fareBreakdown.total,
				extraKmRate,
				car: {
					...car,
					pricePerKm: car.pricePerKm,
					distance: fareBreakdown.actualDistance,
					estimatedFare: fareBreakdown.total,
					pickupDateAndTime: trip.pickupDateAndTime,
					returnDateAndTime: trip.returnDateAndTime
				}
			};

			vehicleStore.set(vehicleDetails);
			selectedCarId = car.id;

			if (bookingToastId) toast.dismiss(bookingToastId);

			// Show appropriate success message with delay
			setTimeout(() => {
				if (fareBreakdown.actualDistance < fareBreakdown.threshold) {
					toast.success(`${car.name} selected!`, {
						description: `${fareBreakdown.actualDistance}km trip charged as ${fareBreakdown.threshold}km (minimum base). Total: ₹${fareBreakdown.total}`,
						duration: 3000
					});
				} else if (fareBreakdown.extraKm > 0) {
					toast.success(`${car.name} selected!`, {
						description: `Base fare: ₹${fareBreakdown.baseFare} + ₹${fareBreakdown.extraFee} (${fareBreakdown.extraKm}km extra). Total: ₹${fareBreakdown.total}`,
						duration: 3000
					});
				} else {
					toast.success(`${car.name} selected!`, {
						description: `Total fare: ₹${fareBreakdown.total}. Proceeding to booking...`,
						duration: 2000
					});
				}
			}, 100);

			setTimeout(() => {
				goto('/booking');
			}, 600);
		} catch (err) {
			if (bookingToastId) toast.dismiss(bookingToastId);
			setTimeout(() => {
				toast.error('Booking failed', {
					description: err instanceof Error ? err.message : 'An unexpected error occurred',
					action: {
						label: 'Retry',
						onClick: () => handleBookNow(car)
					}
				});
			}, 100);
			console.error('handleBookNow error:', err);
		}
	}
</script>

<section class="mx-auto mt-10 flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
	<!-- Header with Back Button and Title -->
	<div class="mb-8 flex items-center gap-4">
		<button
			onclick={handleBack}
			class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 active:scale-95"
			aria-label="Go back"
		>
			<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<h1 class="text-xl font-bold text-gray-900 lg:text-2xl">Choose Vehicle</h1>
	</div>

	<!-- Trip Type Switch -->
	<div class="mb-4 flex gap-4">
		<label class="flex cursor-pointer items-center gap-2">
			<input type="radio" bind:group={tripType} value="oneway" />
			<span>One Way</span>
		</label>
		<label class="flex cursor-pointer items-center gap-2">
			<input type="radio" bind:group={tripType} value="roundtrip" />
			<span>Round Trip</span>
		</label>
	</div>

	<!-- Vehicle Grid -->
	<div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each cars as car}
			<div
				class="flex flex-col rounded-lg border border-gray-200 p-5 shadow-sm transition-shadow hover:shadow-md"
			>
				<div class="flex h-40 w-full items-center justify-center">
					<img src={car.imageLink} alt={car.name} class="h-full w-full object-contain" />
				</div>
				<h2 class="mt-4 truncate text-lg font-semibold">{car.name}</h2>
				<div class="mt-2 flex items-center gap-2">
					<Star />
					<p class="text-sm text-gray-600">
						{car.rating} <span class="text-gray-400">({car.reviews} reviews)</span>
					</p>
				</div>
				<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					<div class="flex items-start gap-2">
						<div class="mt-0.5 flex-shrink-0">
							<Profile />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.passengers} Passengers</p>
					</div>
					<div class="flex items-start gap-2">
						<div class="mt-0.5 flex-shrink-0">
							<Transimission />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.transmission}</p>
					</div>
					<div class="flex items-start gap-2">
						<div class="mt-0.5 flex-shrink-0">
							<Frost />
						</div>
						<p class="text-xs leading-tight text-gray-600">Air Conditioning</p>
					</div>
					<div class="flex items-start gap-2">
						<div class="mt-0.5 flex-shrink-0">
							<Door />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.doors} Doors</p>
					</div>
				</div>
				<div class="mt-4 border-t border-gray-100 pt-4">
					<!-- Distance Pricing Card -->
					<div class="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<svg
									class="h-4 w-4 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
									/>
								</svg>
								<span class="text-sm font-medium text-blue-900">{car.distance} km</span>
							</div>
							<span class="text-sm font-semibold text-blue-900">₹{car.pricePerKm}/km</span>
						</div>
					</div>

					<!-- Daily Price -->
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-500">Price</p>
						</div>

						<p class="text-xl font-bold text-gray-900">
							₹{car.estimatedFare ?? '--'}
							<span class="text-sm font-normal text-gray-500">/ {car.priceUnit}</span>
						</p>
					</div>

					<button
						class="mt-4 w-full rounded-lg bg-primary py-3.5 text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
						onclick={() => handleBookNow(car)}
					>
						Book Now
					</button>
				</div>
			</div>
		{/each}
	</div>
</section>
