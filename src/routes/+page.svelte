<script lang="ts">
	import ChooseVehicles from '$lib/components/homePage/chooseVehicles.svelte';
	import Files from '$lib/pages/files.svelte';
	import { Tabs } from 'bits-ui';
	import { Geocode, type GeocodeResult } from '$lib/geocode/geocode';
	import TaxiService from '$lib/components/taxiService/taxiService.svelte';

	// One Way Trip State
	let onewayPickupQuery = '';
	let onewayPickupResults: GeocodeResult[] = [];
	let onewayPickupLoading = false;
	let onewayPickupError: string | null = null;
	let onewayPickupDropdown = false;
	let onewaySelectedPickup: GeocodeResult | null = null;

	let onewayDropoffQuery = '';
	let onewayDropoffResults: GeocodeResult[] = [];
	let onewayDropoffLoading = false;
	let onewayDropoffError: string | null = null;
	let onewayDropoffDropdown = false;
	let onewaySelectedDropoff: GeocodeResult | null = null;

	// Round Trip State
	let roundtripPickupQuery = '';
	let roundtripPickupResults: GeocodeResult[] = [];
	let roundtripPickupLoading = false;
	let roundtripPickupError: string | null = null;
	let roundtripPickupDropdown = false;
	let roundtripSelectedPickup: GeocodeResult | null = null;

	let roundtripDropoffQuery = '';
	let roundtripDropoffResults: GeocodeResult[] = [];
	let roundtripDropoffLoading = false;
	let roundtripDropoffError: string | null = null;
	let roundtripDropoffDropdown = false;
	let roundtripSelectedDropoff: GeocodeResult | null = null;

	// Debounce timers
	let onewayPickupTimer: ReturnType<typeof setTimeout>;
	let onewayDropoffTimer: ReturnType<typeof setTimeout>;
	let roundtripPickupTimer: ReturnType<typeof setTimeout>;
	let roundtripDropoffTimer: ReturnType<typeof setTimeout>;

	// ONE WAY - Pickup Functions
	function onOnewayPickupInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onewayPickupQuery = target.value;
		onewayPickupDropdown = true;

		clearTimeout(onewayPickupTimer);
		onewayPickupTimer = setTimeout(() => searchOnewayPickup(), 300);
	}

	async function searchOnewayPickup() {
		if (!onewayPickupQuery || onewayPickupQuery.trim().length < 2) {
			onewayPickupResults = [];
			return;
		}

		onewayPickupLoading = true;
		onewayPickupError = null;

		try {
			onewayPickupResults = await Geocode(onewayPickupQuery, { limit: 5 });
		} catch (err) {
			onewayPickupError = err instanceof Error ? err.message : 'Search failed';
			onewayPickupResults = [];
		} finally {
			onewayPickupLoading = false;
		}
	}

	function selectOnewayPickup(item: GeocodeResult) {
		onewayPickupQuery = item.display_name;
		onewaySelectedPickup = item;
		onewayPickupResults = [];
		onewayPickupDropdown = false;
		console.log('Oneway Pickup:', item);
	}

	// ONE WAY - Dropoff Functions
	function onOnewayDropoffInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onewayDropoffQuery = target.value;
		onewayDropoffDropdown = true;

		clearTimeout(onewayDropoffTimer);
		onewayDropoffTimer = setTimeout(() => searchOnewayDropoff(), 300);
	}

	async function searchOnewayDropoff() {
		if (!onewayDropoffQuery || onewayDropoffQuery.trim().length < 2) {
			onewayDropoffResults = [];
			return;
		}

		onewayDropoffLoading = true;
		onewayDropoffError = null;

		try {
			onewayDropoffResults = await Geocode(onewayDropoffQuery, { limit: 5 });
		} catch (err) {
			onewayDropoffError = err instanceof Error ? err.message : 'Search failed';
			onewayDropoffResults = [];
		} finally {
			onewayDropoffLoading = false;
		}
	}

	function selectOnewayDropoff(item: GeocodeResult) {
		onewayDropoffQuery = item.display_name;
		onewaySelectedDropoff = item;
		onewayDropoffResults = [];
		onewayDropoffDropdown = false;
		console.log('Oneway Dropoff:', item);
	}

	// ROUND TRIP - Pickup Functions
	function onRoundtripPickupInput(e: Event) {
		const target = e.target as HTMLInputElement;
		roundtripPickupQuery = target.value;
		roundtripPickupDropdown = true;

		clearTimeout(roundtripPickupTimer);
		roundtripPickupTimer = setTimeout(() => searchRoundtripPickup(), 300);
	}

	async function searchRoundtripPickup() {
		if (!roundtripPickupQuery || roundtripPickupQuery.trim().length < 2) {
			roundtripPickupResults = [];
			return;
		}

		roundtripPickupLoading = true;
		roundtripPickupError = null;

		try {
			roundtripPickupResults = await Geocode(roundtripPickupQuery, { limit: 5 });
		} catch (err) {
			roundtripPickupError = err instanceof Error ? err.message : 'Search failed';
			roundtripPickupResults = [];
		} finally {
			roundtripPickupLoading = false;
		}
	}

	function selectRoundtripPickup(item: GeocodeResult) {
		roundtripPickupQuery = item.display_name;
		roundtripSelectedPickup = item;
		roundtripPickupResults = [];
		roundtripPickupDropdown = false;
		console.log('Roundtrip Pickup:', item);
	}

	// ROUND TRIP - Dropoff Functions
	function onRoundtripDropoffInput(e: Event) {
		const target = e.target as HTMLInputElement;
		roundtripDropoffQuery = target.value;
		roundtripDropoffDropdown = true;

		clearTimeout(roundtripDropoffTimer);
		roundtripDropoffTimer = setTimeout(() => searchRoundtripDropoff(), 300);
	}

	async function searchRoundtripDropoff() {
		if (!roundtripDropoffQuery || roundtripDropoffQuery.trim().length < 2) {
			roundtripDropoffResults = [];
			return;
		}

		roundtripDropoffLoading = true;
		roundtripDropoffError = null;

		try {
			roundtripDropoffResults = await Geocode(roundtripDropoffQuery, { limit: 5 });
		} catch (err) {
			roundtripDropoffError = err instanceof Error ? err.message : 'Search failed';
			roundtripDropoffResults = [];
		} finally {
			roundtripDropoffLoading = false;
		}
	}

	function selectRoundtripDropoff(item: GeocodeResult) {
		roundtripDropoffQuery = item.display_name;
		roundtripSelectedDropoff = item;
		roundtripDropoffResults = [];
		roundtripDropoffDropdown = false;
		console.log('Roundtrip Dropoff:', item);
	}

	// Click outside handler
	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.location-search-container')) {
			onewayPickupDropdown = false;
			onewayDropoffDropdown = false;
			roundtripPickupDropdown = false;
			roundtripDropoffDropdown = false;
		}
	}

	// Submit handlers
	function handleOnewaySubmit() {
		console.log('Oneway Trip Submitted:', {
			pickup: onewaySelectedPickup,
			dropoff: onewaySelectedDropoff
		});
		// Add your submit logic here
	}

	function handleRoundtripSubmit() {
		console.log('Roundtrip Submitted:', {
			pickup: roundtripSelectedPickup,
			dropoff: roundtripSelectedDropoff
		});
		// Add your submit logic here
	}
</script>

<svelte:window on:click={handleClickOutside} />

<section
	class="relative min-h-screen overflow-hidden bg-[url('https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/header_1_2tOQy09VKG.png')] bg-cover bg-center sm:opacity-0 md:opacity-100"
>
	<div class="mx-auto flex max-w-[1340px] flex-col justify-between px-4 sm:px-6 lg:px-8">
		<div class="mt-16 flex flex-col gap-6 sm:mt-24 sm:gap-8 md:mt-32 lg:mt-40 lg:gap-10">
			<div>
				<h1 class="text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
					Book a Taxi!!
				</h1>
				<h1 class="text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
					One <span class="text-primary">way</span> One <span class="text-primary">pay</span>
				</h1>
			</div>
			<div class="max-w-sm">
				<p class="text-base text-[#272727] sm:text-lg">
					Get a car wherever and whenever you need it with us.
				</p>
			</div>
		</div>
		<div
			class="pointer-events-none absolute top-1/2 right-0 h-auto w-full translate-x-1/4 -translate-y-1/2 opacity-60 sm:w-3/4 sm:translate-x-1/12 sm:opacity-80 md:w-2/3 md:opacity-100 lg:w-1/2"
		>
			<img
				src="https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/porsche_car_bvtfEE6A23.png"
				alt="car"
				class="h-auto w-full"
			/>
		</div>
		<div class="z-0 mt-16 mb-8 w-full sm:mt-24 sm:mb-12 md:mt-32 lg:mt-24 lg:mb-16">
			<Tabs.Root
				value="oneway"
				class="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:rounded-2xl sm:p-6"
			>
				<!-- Tab Buttons -->
				<Tabs.List class="mb-4 inline-flex w-full gap-2 sm:mb-6 sm:w-auto">
					<Tabs.Trigger
						value="oneway"
						class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm"
					>
						One way
					</Tabs.Trigger>
					<Tabs.Trigger
						value="roundtrip"
						class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm"
					>
						Round trip
					</Tabs.Trigger>
				</Tabs.List>

				<!-- One Way Tab Content -->
				<Tabs.Content value="oneway" class="select-none">
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
						<!-- Pick up location -->
						<div class="location-search-container relative flex items-start gap-2 sm:gap-3">
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<label
									for="pickup-location-oneway"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Pick up location</label
								>
								<input
									id="pickup-location-oneway"
									type="text"
									placeholder="Search your location"
									bind:value={onewayPickupQuery}
									on:input={onOnewayPickupInput}
									on:focus={() => (onewayPickupDropdown = true)}
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
								/>

								<!-- Dropdown -->
								{#if onewayPickupDropdown && (onewayPickupLoading || onewayPickupError || onewayPickupResults.length > 0)}
									<div
										class="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									>
										{#if onewayPickupLoading}
											<div class="p-3 text-xs text-gray-500 sm:text-sm">
												<div class="flex items-center gap-2">
													<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Searching…
												</div>
											</div>
										{/if}

										{#if onewayPickupError}
											<div class="p-3 text-xs text-red-600 sm:text-sm">
												{onewayPickupError}
											</div>
										{/if}

										{#if onewayPickupResults.length > 0}
											<ul class="divide-y divide-gray-100">
												{#each onewayPickupResults as result}
													<li>
														<button
															type="button"
															class="w-full p-3 text-left text-xs hover:bg-gray-50 sm:text-sm"
															on:click={() => selectOnewayPickup(result)}
														>
															<div class="font-medium text-gray-900">
																{result.display_name}
															</div>
															<div class="mt-1 text-xs text-gray-500">
																{result.address?.city ||
																	result.address?.town ||
																	result.address?.village ||
																	''}
																{result.address?.state ? `, ${result.address.state}` : ''}
															</div>
														</button>
													</li>
												{/each}
											</ul>
										{/if}

										<!-- Mapbox Attribution - Always visible -->
										<div
											class="flex justify-end gap-1.5 border-t border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500"
										>
											<span>Powered by</span>
											<span
												class="inline-flex gap-1 font-semibold text-[#4264fb] transition-colors hover:text-[#314ccd]"
											>
												<svg class="h-3.5 w-auto" viewBox="0 0 18 18" fill="currentColor">
													<path
														d="M9 0C4.03 0 0 4.03 0 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 15.48c-3.57 0-6.48-2.91-6.48-6.48S5.43 2.52 9 2.52s6.48 2.91 6.48 6.48-2.91 6.48-6.48 6.48zm5.12-7.23l-2.05 2.05c-.31.31-.8.31-1.11 0L9 8.35c-.31-.31-.31-.8 0-1.11l2.05-2.05c.31-.31.8-.31 1.11 0l2.05 2.05c.31.31.31.8 0 1.11z"
													/>
												</svg>
												Mapbox
											</span>
										</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Drop off location -->
						<div class="location-search-container relative flex items-start gap-2 sm:gap-3">
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<label
									for="dropoff-location-oneway"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Drop off location</label
								>
								<input
									id="dropoff-location-oneway"
									type="text"
									placeholder="Search your location"
									bind:value={onewayDropoffQuery}
									on:input={onOnewayDropoffInput}
									on:focus={() => (onewayDropoffDropdown = true)}
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
								/>

								<!-- Dropdown -->
								{#if onewayDropoffDropdown && (onewayDropoffLoading || onewayDropoffError || onewayDropoffResults.length > 0)}
									<div
										class="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									>
										{#if onewayDropoffLoading}
											<div class="p-3 text-xs text-gray-500 sm:text-sm">
												<div class="flex items-center gap-2">
													<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Searching…
												</div>
											</div>
										{/if}

										{#if onewayDropoffError}
											<div class="p-3 text-xs text-red-600 sm:text-sm">
												{onewayDropoffError}
											</div>
										{/if}

										{#if onewayDropoffResults.length > 0}
											<ul class="divide-y divide-gray-100">
												{#each onewayDropoffResults as result}
													<li>
														<button
															type="button"
															class="w-full p-3 text-left text-xs hover:bg-gray-50 sm:text-sm"
															on:click={() => selectOnewayDropoff(result)}
														>
															<div class="font-medium text-gray-900">
																{result.display_name}
															</div>
															<div class="mt-1 text-xs text-gray-500">
																{result.address?.city ||
																	result.address?.town ||
																	result.address?.village ||
																	''}
																{result.address?.state ? `, ${result.address.state}` : ''}
															</div>
														</button>
													</li>
												{/each}
											</ul>
										{/if}

										<!-- Mapbox Attribution - Always visible -->
										<div
											class="flex justify-end gap-1.5 border-t border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500"
										>
											<span>Powered by</span>
											<span
												class="inline-flex gap-1 font-semibold text-[#4264fb] transition-colors hover:text-[#314ccd]"
											>
												<svg class="h-3.5 w-auto" viewBox="0 0 18 18" fill="currentColor">
													<path
														d="M9 0C4.03 0 0 4.03 0 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 15.48c-3.57 0-6.48-2.91-6.48-6.48S5.43 2.52 9 2.52s6.48 2.91 6.48 6.48-2.91 6.48-6.48 6.48zm5.12-7.23l-2.05 2.05c-.31.31-.8.31-1.11 0L9 8.35c-.31-.31-.31-.8 0-1.11l2.05-2.05c.31-.31.8-.31 1.11 0l2.05 2.05c.31.31.31.8 0 1.11z"
													/>
												</svg>
												Mapbox
											</span>
										</div>
									</div>
								{/if}
							</div>
						</div>

						<!-- Pick up time -->
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
								<label
									for="pickup-time-oneway"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Pick up time</label
								>
								<input
									id="pickup-time-oneway"
									type="datetime-local"
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
								/>
							</div>
						</div>

						<!-- Submit Button -->
						<div class="flex items-end sm:col-span-2 lg:col-span-1">
							<button
								on:click={handleOnewaySubmit}
								class="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 sm:px-8 sm:py-3 sm:text-base"
							>
								Submit
							</button>
						</div>
					</div>
				</Tabs.Content>

				<!-- Round Trip Tab Content -->
				<Tabs.Content value="roundtrip" class="select-none">
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
						<!-- Pick up location -->
						<div class="location-search-container relative flex items-start gap-2 sm:gap-3">
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<label
									for="pickup-location-roundtrip"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Pick up location</label
								>
								<input
									id="pickup-location-roundtrip"
									type="text"
									placeholder="Search your location"
									bind:value={roundtripPickupQuery}
									on:input={onRoundtripPickupInput}
									on:focus={() => (roundtripPickupDropdown = true)}
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
								/>

								<!-- Dropdown -->
								{#if roundtripPickupDropdown && (roundtripPickupLoading || roundtripPickupError || roundtripPickupResults.length > 0)}
									<div
										class="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									>
										{#if roundtripPickupLoading}
											<div class="p-3 text-xs text-gray-500 sm:text-sm">
												<div class="flex items-center gap-2">
													<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Searching…
												</div>
											</div>
										{/if}

										{#if roundtripPickupError}
											<div class="p-3 text-xs text-red-600 sm:text-sm">
												{roundtripPickupError}
											</div>
										{/if}

										{#if roundtripPickupResults.length > 0}
											<ul class="divide-y divide-gray-100">
												{#each roundtripPickupResults as result}
													<li>
														<button
															type="button"
															class="w-full p-3 text-left text-xs hover:bg-gray-50 sm:text-sm"
															on:click={() => selectRoundtripPickup(result)}
														>
															<div class="font-medium text-gray-900">
																{result.display_name}
															</div>
															<div class="mt-1 text-xs text-gray-500">
																{result.address?.city ||
																	result.address?.town ||
																	result.address?.village ||
																	''}
																{result.address?.state ? `, ${result.address.state}` : ''}
															</div>
														</button>
													</li>
												{/each}
											</ul>
										{/if}
									</div>
								{/if}
							</div>
						</div>

						<!-- Drop off location -->
						<div class="location-search-container relative flex items-start gap-2 sm:gap-3">
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
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<div class="min-w-0 flex-1">
								<label
									for="dropoff-location-roundtrip"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Drop off location</label
								>
								<input
									id="dropoff-location-roundtrip"
									type="text"
									placeholder="Search your location"
									bind:value={roundtripDropoffQuery}
									on:input={onRoundtripDropoffInput}
									on:focus={() => (roundtripDropoffDropdown = true)}
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
								/>

								<!-- Dropdown -->
								{#if roundtripDropoffDropdown && (roundtripDropoffLoading || roundtripDropoffError || roundtripDropoffResults.length > 0)}
									<div
										class="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
									>
										{#if roundtripDropoffLoading}
											<div class="p-3 text-xs text-gray-500 sm:text-sm">
												<div class="flex items-center gap-2">
													<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
														<circle
															class="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															stroke-width="4"
														></circle>
														<path
															class="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														></path>
													</svg>
													Searching…
												</div>
											</div>
										{/if}

										{#if roundtripDropoffError}
											<div class="p-3 text-xs text-red-600 sm:text-sm">
												{roundtripDropoffError}
											</div>
										{/if}

										{#if roundtripDropoffResults.length > 0}
											<ul class="divide-y divide-gray-100">
												{#each roundtripDropoffResults as result}
													<li>
														<button
															type="button"
															class="w-full p-3 text-left text-xs hover:bg-gray-50 sm:text-sm"
															on:click={() => selectRoundtripDropoff(result)}
														>
															<div class="font-medium text-gray-900">
																{result.display_name}
															</div>
															<div class="mt-1 text-xs text-gray-500">
																{result.address?.city ||
																	result.address?.town ||
																	result.address?.village ||
																	''}
																{result.address?.state ? `, ${result.address.state}` : ''}
															</div>
														</button>
													</li>
												{/each}
											</ul>
										{/if}
									</div>
								{/if}
							</div>
						</div>

						<!-- Pick up time -->
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
								<label
									for="pickup-time-roundtrip"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Pick up time</label
								>
								<input
									id="pickup-time-roundtrip"
									type="datetime-local"
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
								/>
							</div>
						</div>

						<!-- Return time -->
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
								<label
									for="return-time-roundtrip"
									class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm"
									>Return time</label
								>
								<input
									id="return-time-roundtrip"
									type="datetime-local"
									class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
								/>
							</div>
						</div>

						<!-- Submit Button -->
						<div class="flex items-end sm:col-span-2 lg:col-span-1">
							<button
								on:click={handleRoundtripSubmit}
								class="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 sm:px-8 sm:py-3 sm:text-base"
							>
								Submit
							</button>
						</div>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</section>
<Files />
<ChooseVehicles />

<TaxiService />

<style>
	/* Custom scrollbar for dropdown */
	.location-search-container ::-webkit-scrollbar {
		width: 6px;
	}
	.location-search-container ::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}
	.location-search-container ::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3px;
	}
	.location-search-container ::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	:global(body) {
		overflow-x: hidden;
		max-width: 100vw;
	}
</style>
