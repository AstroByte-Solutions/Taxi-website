<script lang="ts">
	import LocationSearchInput from './locationSearchInput.svelte';
	import type { GeocodeResult } from '$lib/geocode/geocode';
	import { goto } from '$app/navigation';
	import { tripStore } from '$lib/stores/tripStore';
	import { validateTripData } from '$lib/utils/validation.utils';
	import { validateLocations } from '$lib/utils/location.utils';
	import { toast } from 'svelte-sonner';
	import { formDataStore } from '$lib/stores/formDataStore';

	// Initialize from shared form data
	let pickupQuery = $state('');
	let dropoffQuery = $state('');
	let selectedPickup: GeocodeResult | null = $state(null);
	let selectedDropoff: GeocodeResult | null = $state(null);
	let pickupTime = $state('');
	let returnTime = $state('');
	let submitError: string | null = $state(null);

	// Load data from store on mount/tab switch
	$effect(() => {
		const data = $formDataStore;
		pickupQuery = data.pickupQuery;
		dropoffQuery = data.dropoffQuery;
		selectedPickup = data.selectedPickup;
		selectedDropoff = data.selectedDropoff;
		pickupTime = data.pickupTime;
		returnTime = data.returnTime;
	});

	// Update store when values change
	$effect(() => {
		formDataStore.update((data) => ({
			...data,
			pickupQuery,
			dropoffQuery,
			selectedPickup,
			selectedDropoff,
			pickupTime,
			returnTime
		}));
	});

	function handleSubmit() {
		// Validate locations are within allowed states
		const locationValidation = validateLocations(selectedPickup, selectedDropoff);
		if (!locationValidation.ok) {
			toast.error('Sorry, we cannot serve this location', {
				description:
					'Our taxi service is currently available only in Tamil Nadu, Kerala, Karnataka and Pondicherry.',
				duration: 6000
			});
			return;
		}

		const tripData = {
			tripType: 'roundtrip' as const,
			pickup: {
				display_name: selectedPickup!.display_name,
				lat: selectedPickup!.lat,
				lon: selectedPickup!.lon
			},
			dropoff: {
				display_name: selectedDropoff!.display_name,
				lat: selectedDropoff!.lat,
				lon: selectedDropoff!.lon
			},
			pickupDateAndTime: pickupTime,
			returnDateAndTime: returnTime,
			createdAt: Date.now()
		};

		const validation = validateTripData(tripData);
		if (!validation.ok) {
			submitError = validation.message || 'Please fill required fields';
			return;
		}

		submitError = null;

		try {
			tripStore.set(tripData);
			goto('/choose-vehicle');
		} catch (e) {
			submitError = 'Failed to save trip data. Please try again.';
		}
	}

	let isValid = $derived(!!(selectedPickup && selectedDropoff && pickupTime && returnTime));
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
	<LocationSearchInput
		label="Pick up location"
		bind:value={pickupQuery}
		onSelect={(result) => (selectedPickup = result)}
	/>

	<LocationSearchInput
		label="Drop off location"
		bind:value={dropoffQuery}
		onSelect={(result) => (selectedDropoff = result)}
	/>

	<div class="flex items-start gap-2 sm:gap-3">
		<div
			class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10"
		>
			<svg
				class="h-4 w-4 text-gray-600 sm:h-5 sm:w-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</div>
		<div class="min-w-0 flex-1">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm">Pick up time</label>
			<input
				type="datetime-local"
				bind:value={pickupTime}
				class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
			/>
		</div>
	</div>

	<div class="flex items-start gap-2 sm:gap-3">
		<div
			class="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:h-10 sm:w-10"
		>
			<svg
				class="h-4 w-4 text-gray-600 sm:h-5 sm:w-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</div>
		<div class="min-w-0 flex-1">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm">Return time</label>
			<input
				type="datetime-local"
				bind:value={returnTime}
				min={pickupTime || undefined}
				class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
			/>
		</div>
	</div>

	<div class="flex items-end sm:col-span-2 lg:col-span-1">
		<div class="w-full">
			{#if submitError}
				<div class="mb-2 text-sm text-red-600">{submitError}</div>
			{/if}
			<button
				onclick={handleSubmit}
				disabled={!isValid}
				class="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:py-3 sm:text-base"
			>
				Submit
			</button>
		</div>
	</div>
</div>
