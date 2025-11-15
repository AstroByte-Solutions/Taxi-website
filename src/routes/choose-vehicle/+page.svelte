<script lang="ts">
	import { goto } from '$app/navigation';
	import Door from '$lib/icons/door.svelte';
	import Frost from '$lib/icons/frost.svelte';
	import Profile from '$lib/icons/profile.svelte';
	import Star from '$lib/icons/star.svelte';
	import Transimission from '$lib/icons/transimission.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	type TripType = 'oneway' | 'roundtrip';

	interface Car {
		id: number;
		imageLink: string;
		name: string;
		rating: number;
		reviews: number;
		passengers: number;
		transmission: string;
		airConditioning: boolean;
		doors: number;
		category: string;
		priceUnit: string;
		onewayRatePerKm: number;
		roundtripRatePerKm: number;
		distance?: number;
		pricePerKm?: number;
		estimatedFare?: number;
		pickupDateAndTime?: string;
		returnDateAndTime?: string;
		extraKm?: number;
		extraFee?: number;
	}

	let cars: Car[] = [
		{
			id: 1,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/17ws33z6wdrxmsp/suzuki_swift_car_maruti_suzuki_dzire_car_b15b42392c86348282930d72a750d493_HybpFp2Lkl.png',
			name: 'Hatchback',
			rating: 4.5,
			reviews: 3456,
			passengers: 4,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			priceUnit: 'day',
			category: 'Sedan',
			onewayRatePerKm: 14,
			roundtripRatePerKm: 13
		},
		{
			id: 2,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/e13mtm7rl4mswcr/5bbc278ec0e2d_51e72df7d7ea4c637a2e6606f4866f6f_VffpCWZ2c5.png',
			name: 'Sedan (Etios)',
			rating: 4.7,
			reviews: 2890,
			passengers: 5,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			priceUnit: 'day',
			category: 'MUV',
			onewayRatePerKm: 14,
			roundtripRatePerKm: 13
		},
		{
			id: 3,
			name: 'SUV',
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/jy03lgb9tktiyzs/hyundai_creta_car_hyundai_motor_company_hyundai_i30_hyundai_creta_2da6ea49bda6f3386b1382fb01748980_WO1hIMK9ju.png',
			rating: 4.6,
			reviews: 2234,
			passengers: 5,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			priceUnit: 'day',
			category: 'Sedan',
			onewayRatePerKm: 19,
			roundtripRatePerKm: 17
		},
		{
			id: 4,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/cifxi30yi0t7fop/toyota_innova_car_mazda_mpv_toyota_a8f71f8a221e8c5c547390ce9861d454_lHUqsi7JkE.png',
			name: 'Innova',
			rating: 4.4,
			reviews: 1987,
			passengers: 7,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			priceUnit: 'day',
			category: 'SUV',
			onewayRatePerKm: 20,
			roundtripRatePerKm: 18
		}
	];

	function handleBack() {
		window.history.back();
	}

	interface LocationPoint {
		lat: number | string;
		lon: number | string;
	}

	function calculateDistanceInKm(from: LocationPoint, to: LocationPoint): number {
		const R = 6371;
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

	function toRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	let tripType: TripType = 'oneway';
	let distanceKm = 0;
	let selectedCarId: number | null = null;

	onMount(() => {
		const loadingToast = toast.loading('Loading trip details...');

		try {
			const raw = localStorage.getItem('tripData');
			if (!raw) {
				toast.dismiss(loadingToast);
				toast.error('No trip data found', {
					description: 'Please start by selecting your trip details on the home page.',
					action: {
						label: 'Go Home',
						onClick: () => goto('/')
					}
				});
				setTimeout(() => goto('/'), 2000);
				return;
			}

			const parsed = JSON.parse(raw);
			const pickup = parsed?.pickup;
			const dropoff = parsed?.dropoff;
			const savedType: TripType = parsed?.tripType || 'oneway';

			if (!pickup || !dropoff) {
				toast.dismiss(loadingToast);
				toast.error('Invalid trip data', {
					description: 'Pickup or dropoff location is missing.'
				});
				return;
			}

			tripType = savedType;
			distanceKm = calculateDistanceInKm(
				{ lat: pickup.lat, lon: pickup.lon },
				{ lat: dropoff.lat, lon: dropoff.lon }
			);

			updateFare();

			toast.dismiss(loadingToast);
			toast.success('Trip loaded successfully!', {
				description: `${distanceKm} km ${tripType} journey calculated.`
			});
		} catch (err) {
			toast.dismiss(loadingToast);
			toast.error('Failed to load trip details', {
				description: err instanceof Error ? err.message : 'Unknown error occurred'
			});
			console.error('Error loading trip:', err);
		}
	});

	$: (tripType, updateFare());

	function updateFare() {
		const isRound = tripType === 'roundtrip';
		const baseDistance = distanceKm;
		const adjustedDistance = isRound ? baseDistance * 2 : baseDistance;
		const threshold = isRound ? 250 : 150;

		cars = cars.map((car) => {
			const baseRate = Number(isRound ? car.roundtripRatePerKm : car.onewayRatePerKm);
			const dist = Number(adjustedDistance);
			const extraKm = Math.max(0, dist - threshold);
			const extraFee = Number((extraKm * 13).toFixed(2));
			const baseFare = baseRate * dist;
			const estimatedFare = Number(baseFare.toFixed(2));

			return {
				...car,
				pricePerKm: baseRate,
				estimatedFare,
				distance: Number(dist.toFixed(2)),
				extraKm: Number(extraKm.toFixed(2)),
				extraFee
			};
		});

		// Show toast when trip type changes
		if (distanceKm > 0) {
			toast.info(`Switched to ${tripType}`, {
				description: `Prices updated for ${isRound ? adjustedDistance : distanceKm} km journey.`
			});
		}
	}

	function handleBookNow(car: Car) {
		const bookingToast = toast.loading(`Booking ${car.name}...`);

		try {
			const raw = localStorage.getItem('tripData');
			if (!raw) {
				toast.dismiss(bookingToast);
				toast.error('Trip data not found', {
					description: 'Please start from the home page.'
				});
				return;
			}

			const tripData = JSON.parse(raw);

			if (tripData?.tripType && tripData.tripType !== tripType) {
				toast.dismiss(bookingToast);
				toast.warning('Trip type mismatch detected!', {
					description: `Your original selection was "${tripData.tripType}" but you're viewing "${tripType}" rates.`,
					action: {
						label: 'Go Back',
						onClick: () => goto('/')
					},
					duration: 6000
				});
				return;
			}

			const isRound = tripType === 'roundtrip';
			const dist = Number(car.distance ?? distanceKm);
			const totalDistance = isRound ? dist * 2 : dist;
			const threshold = isRound ? 250 : 150;
			const extraKm = Math.max(0, totalDistance - threshold);
			const extraFee = Number((extraKm * 13).toFixed(2));
			const pricePerKm = Number(
				car.pricePerKm ?? (isRound ? car.roundtripRatePerKm : car.onewayRatePerKm)
			);
			const baseFareRaw = pricePerKm * totalDistance;
			const estimatedFareBaseOnly = Number(baseFareRaw.toFixed(2));
			const totalFareWithExtra = Number((baseFareRaw + extraFee).toFixed(2));
			const pickupDateAndTime = tripData?.pickupDateAndTime ?? null;
			const returnDateAndTime = isRound ? (tripData?.returnDateAndTime ?? null) : null;

			const vehicleDetails = {
				selectedAt: Date.now(),
				tripType,
				totalDistance: Number(totalDistance.toFixed(2)),
				extraKm: Number(extraKm.toFixed(2)),
				extraFee,
				estimatedTotalIfCharged: totalFareWithExtra,
				car: {
					...car,
					pricePerKm,
					distance: Number(dist.toFixed(2)),
					estimatedFare: estimatedFareBaseOnly,
					rawFareComponents: {
						baseFare: Number(baseFareRaw.toFixed(2)),
						extraFee
					},
					pickupDateAndTime,
					returnDateAndTime
				}
			};

			localStorage.setItem('vehicle-details', JSON.stringify(vehicleDetails));
			selectedCarId = car.id;

			toast.dismiss(bookingToast);
			toast.success(`${car.name} selected!`, {
				description: `Total fare: ₹${estimatedFareBaseOnly}. Proceeding to booking...`,
				duration: 2000
			});

			setTimeout(() => {
				goto('/booking');
			}, 500);
		} catch (err) {
			toast.dismiss(bookingToast);
			toast.error('Booking failed', {
				description: err instanceof Error ? err.message : 'An unexpected error occurred',
				action: {
					label: 'Retry',
					onClick: () => handleBookNow(car)
				}
			});
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
						<p class="mt-1 text-xs text-blue-700">₹{car.pricePerKm}/km</p>
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
