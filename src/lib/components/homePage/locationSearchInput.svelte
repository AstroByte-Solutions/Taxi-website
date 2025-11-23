<script lang="ts">
	import { Geocode, type GeocodeResult } from '$lib/geocode/geocode';

	let {
		label,
		placeholder = 'Search your location',
		value = $bindable(''),
		onSelect
	}: {
		label: string;
		placeholder?: string;
		value: string;
		onSelect: (result: GeocodeResult) => void;
	} = $props();

	let results: GeocodeResult[] = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);
	let dropdownOpen = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		dropdownOpen = true;
		clearTimeout(timer);
		timer = setTimeout(() => search(), 300);
	}

	async function search() {
		if (!value || value.trim().length < 2) {
			results = [];
			return;
		}
		loading = true;
		error = null;
		try {
			results = await Geocode(value, { limit: 5 });
		} catch (err) {
			error = err instanceof Error ? err.message : 'Search failed';
			results = [];
		} finally {
			loading = false;
		}
	}

	function selectResult(item: GeocodeResult) {
		value = item.display_name;
		results = [];
		dropdownOpen = false;
		onSelect(item);
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.location-search-container')) {
			dropdownOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

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
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm">{label}</label>
		<input
			type="text"
			{placeholder}
			{value}
			on:input={handleInput}
			on:focus={() => (dropdownOpen = true)}
			class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
		/>

		{#if dropdownOpen && (loading || error || results.length > 0)}
			<div
				class="absolute top-full right-0 left-0 z-[9999] mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl"
			>
				{#if loading}
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

				{#if error}
					<div class="p-3 text-xs text-red-600 sm:text-sm">{error}</div>
				{/if}

				{#if results.length > 0}
					<ul class="divide-y divide-gray-100">
						{#each results as result}
							<li>
								<button
									type="button"
									class="w-full p-3 text-left text-xs hover:bg-gray-50 sm:text-sm"
									on:click={() => selectResult(result)}
								>
									<div class="font-medium text-gray-900">{result.display_name}</div>
									<div class="mt-1 text-xs text-gray-500">
										{result.address?.city || result.address?.town || result.address?.village || ''}
										{result.address?.state ? `, ${result.address.state}` : ''}
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}

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

<style>
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
</style>
