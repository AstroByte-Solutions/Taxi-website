<script lang="ts">
	import { goto } from '$app/navigation';
	import Door from '$lib/icons/door.svelte';
	import Frost from '$lib/icons/frost.svelte';
	import Profile from '$lib/icons/profile.svelte';
	import Star from '$lib/icons/star.svelte';
	import Transimission from '$lib/icons/transimission.svelte';
	import { onMount } from 'svelte';

	type TripType = 'oneway' | 'roundtrip';

	// Car type now holds separate rates for oneway & roundtrip
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
		onewayRatePerKm: number; // rate used for oneway
		roundtripRatePerKm: number; // rate used for roundtrip
		// computed later
		distance?: number; // base distance (one-way straight line)
		pricePerKm?: number; // effective per-km rate used
		estimatedFare?: number; // computed total fare
		pickupDateAndTime?: string;
		returnDateAndTime?: string;

		extraKm?: number;
		extraFee?: number;
	}

	// make cars mutable (let) so we can map/update
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
			onewayRatePerKm: 14, // example from tariff: Rs.14/km one way
			roundtripRatePerKm: 13 // Rs.13/km round trip
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

	// ---------- Distance Calculation ----------
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

	// ---------- Main Fare Logic ----------
	let tripType: TripType = 'oneway';
	let distanceKm = 0; // one-way straight line distance

	onMount(() => {
		try {
			const raw = localStorage.getItem('tripData');
			if (!raw) return;
			const parsed = JSON.parse(raw);
			const pickup = parsed?.pickup;
			const dropoff = parsed?.dropoff;
			const savedType: TripType = parsed?.tripType || 'oneway';
			if (!pickup || !dropoff) return;

			tripType = savedType;
			// compute one-way straight-line distance
			distanceKm = calculateDistanceInKm(
				{ lat: pickup.lat, lon: pickup.lon },
				{ lat: dropoff.lat, lon: dropoff.lon }
			);

			updateFare();
		} catch (err) {
			console.error('Failed to calculate trip distance:', err);
		}
	});

	// Recompute when user toggles tripType
	$: (tripType, updateFare());

	// this will hold id of car user previously selected (if any)
	let selectedCarId: number | null = null;

	/**
	 * Recalculate each car's effective per-km and estimated fare.
	 * Rules:
	 * - if tripType === 'oneway' => use onewayRatePerKm and distance = distanceKm
	 * - if tripType === 'roundtrip' => use roundtripRatePerKm and distance = distanceKm * 2
	 */

	function updateFare() {
		const isRound = tripType === 'roundtrip';
		const baseDistance = distanceKm; // one-way straight-line
		const adjustedDistance = isRound ? baseDistance * 2 : baseDistance;
		const threshold = isRound ? 250 : 150;

		cars = cars.map((car) => {
			const baseRate = Number(isRound ? car.roundtripRatePerKm : car.onewayRatePerKm);
			const dist = Number(adjustedDistance);

			// fractional extraKm allowed — you can use Math.ceil if you want whole kms
			const extraKm = Math.max(0, dist - threshold);
			const extraFee = Number((extraKm * 13).toFixed(2));

			// IMPORTANT: estimatedFare for the vehicle-list = BASE FARE ONLY (no extraFee)
			const baseFare = baseRate * dist;
			const estimatedFare = Number(baseFare.toFixed(2)); // keep paise, show this on vehicle cards

			return {
				...car,
				pricePerKm: baseRate,
				estimatedFare, // base fare only (vehicle screen)
				distance: Number(dist.toFixed(2)), // numeric
				extraKm: Number(extraKm.toFixed(2)),
				extraFee
			};
		});
	}

	/**
	 * Called when user clicks Book Now on a car card.
	 * - Ensures tripType in localStorage.tripData matches current UI tripType (and updates it only if changed).
	 * - Stores the selected car + trip info under "vehicle-details".
	 * - Navigates to next step (change path as needed).
	 */
	function handleBookNow(car: Car) {
		try {
			// 1) read tripData from localStorage
			const raw = localStorage.getItem('tripData');
			if (!raw) {
				console.error('No tripData in localStorage');
				return;
			}
			const tripData = JSON.parse(raw);

			// 2) tripType consistency check — send user back to home if mismatch
			if (tripData?.tripType && tripData.tripType !== tripType) {
				const ok = confirm(
					`The trip type you selected on the home screen is "${tripData.tripType}", ` +
						`but you are trying to book a vehicle as "${tripType}".\n\n` +
						`To avoid mismatched fares, please go back and correct your trip type.\n\n` +
						`Press OK to return to home, or Cancel to stay here.`
				);
				if (ok) {
					goto('/'); // adjust if your app's home route differs
				}
				return;
			}

			// 3) core fare calculation (canonical numeric values, 2-decimal)
			const isRound = tripType === 'roundtrip';

			// distance to use: prefer car.distance (computed earlier) else fallback to global distanceKm
			const dist = Number(car.distance ?? distanceKm);
			// totalDistance used for pricing (roundtrip doubles one-way)
			const totalDistance = isRound ? dist * 2 : dist;

			// threshold rules
			const threshold = isRound ? 250 : 150;

			// extra km (fractional allowed). Use Math.max so we never store negatives.
			const extraKm = Math.max(0, totalDistance - threshold);
			const extraFee = Number((extraKm * 13).toFixed(2)); // ₹13/km, keep paise

			// price per km: prefer car.pricePerKm if set (from updateFare), otherwise fallback to rate constants
			const pricePerKm = Number(
				car.pricePerKm ?? (isRound ? car.roundtripRatePerKm : car.onewayRatePerKm)
			);

			// base fare and total fare with two decimals
			const baseFareRaw = pricePerKm * totalDistance;
			// IMPORTANT: vehicle-details.estimatedFare = BASE FARE (vehicle screen shows this)
			const estimatedFareBaseOnly = Number(baseFareRaw.toFixed(2));
			// totalFare (booking screen can compute/show): base + extraFee
			const totalFareWithExtra = Number((baseFareRaw + extraFee).toFixed(2));

			// 4) pickup/return times pulled from tripData (if available)
			const pickupDateAndTime = tripData?.pickupDateAndTime ?? null;
			const returnDateAndTime = isRound ? (tripData?.returnDateAndTime ?? null) : null;

			// 5) assemble vehicle-details object (canonical numbers)
			const vehicleDetails = {
				selectedAt: Date.now(),
				tripType,
				totalDistance: Number(totalDistance.toFixed(2)),
				extraKm: Number(extraKm.toFixed(2)),
				extraFee,
				// keep both base-only estimatedFare and full total if helpful
				estimatedTotalIfCharged: totalFareWithExtra,
				car: {
					...car,
					pricePerKm,
					distance: Number(dist.toFixed(2)),
					// this is what the vehicle list shows (base only)
					estimatedFare: estimatedFareBaseOnly,
					// breakdown to be shown on booking screen
					rawFareComponents: {
						baseFare: Number(baseFareRaw.toFixed(2)),
						extraFee
					},
					pickupDateAndTime,
					returnDateAndTime
				}
			};

			// 6) persist to localStorage so booking screen uses same canonical numbers
			localStorage.setItem('vehicle-details', JSON.stringify(vehicleDetails));
			console.log('Saved vehicle-details to localStorage:', vehicleDetails);

			// 7) update local UI state and navigate to booking
			selectedCarId = car.id;
			goto('/booking');

			// NOTE:
			// Do NOT clear localStorage here. Clear tripData & vehicle-details only from the Booking page
			// after the user finishes the booking (e.g. on sendWhatsAppMessage / confirm).
		} catch (err) {
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
						onclick={() => {
							handleBookNow(car);
						}}
					>
						Book Now
					</button>
				</div>
			</div>
		{/each}
	</div>
</section>
