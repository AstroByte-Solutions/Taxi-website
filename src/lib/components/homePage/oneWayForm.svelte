<script lang="ts">
	import LocationSearchInput from './locationSearchInput.svelte';
	import type { GeocodeResult } from '$lib/geocode/geocode';
	import { goto } from '$app/navigation';

	let pickupQuery = $state('');
	let dropoffQuery = $state('');
	let selectedPickup: GeocodeResult | null = $state(null);
	let selectedDropoff: GeocodeResult | null = $state(null);
	let pickupTime = $state('');
	let submitError: string | null = $state(null);

	function validate(): { ok: boolean; message?: string } {
		if (!selectedPickup) {
			return { ok: false, message: 'Please select a pickup location.' };
		}
		if (!selectedDropoff) {
			return { ok: false, message: 'Please select a dropoff location.' };
		}
		if (!pickupTime) {
			return { ok: false, message: 'Please select pickup date & time.' };
		}
		const t = new Date(pickupTime).getTime();
		if (isNaN(t)) {
			return { ok: false, message: 'Invalid pickup date/time.' };
		}
		return { ok: true };
	}

	function handleSubmit() {
		const v = validate();
		if (!v.ok) {
			submitError = v.message || 'Please fill required fields';
			return;
		}

		submitError = null;

		const tripData = {
			tripType: 'oneway',
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

		try {
			localStorage.setItem('tripData', JSON.stringify(tripData));
			goto('/choose-vehicle');
		} catch (e) {
			submitError = 'Failed to save trip data. Please try again.';
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

	<div class="flex flex-col items-end sm:col-span-2 lg:col-span-1">
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
