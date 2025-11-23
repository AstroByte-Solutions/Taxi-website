<script lang="ts">
	import LocationSearchInput from './locationSearchInput.svelte';
	import DateTimePicker from '$lib/components/datePicker/DateTimePicker.svelte';
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

	// Load data from store on mount/tab switch
	$effect(() => {
		const data = $formDataStore;
		pickupQuery = data.pickupQuery;
		dropoffQuery = data.dropoffQuery;
		selectedPickup = data.selectedPickup;
		selectedDropoff = data.selectedDropoff;
		pickupTime = data.pickupTime;
	});

	// Update store when values change
	$effect(() => {
		formDataStore.update((data) => ({
			...data,
			pickupQuery,
			dropoffQuery,
			selectedPickup,
			selectedDropoff,
			pickupTime
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
			tripType: 'oneway' as const,
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
			createdAt: Date.now()
		};

		const validation = validateTripData(tripData);
		if (!validation.ok) {
			toast.error('Please fill all required fields', {
				description: validation.message || 'Complete all fields to continue',
				duration: 4000
			});
			return;
		}

		try {
			tripStore.set(tripData);
			goto('/choose-vehicle');
		} catch (e) {
			toast.error('Failed to save trip data', {
				description: 'Please try again',
				duration: 4000
			});
		}
	}

	let isValid = $derived(!!(selectedPickup && selectedDropoff && pickupTime));
</script>

<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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

	<div class="sm:col-span-2 lg:col-span-1">
		<DateTimePicker bind:value={pickupTime} label="Pick up time" />
	</div>

	<div class="flex flex-col items-end sm:col-span-2 lg:col-span-1">
		<button
			onclick={handleSubmit}
			disabled={!isValid}
			class="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:py-3 sm:text-base"
		>
			Submit
		</button>
	</div>
</div>
