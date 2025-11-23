<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { VEHICLES } from '$lib/data/vehicles.data';
	import { PRICING_CONFIG } from '$lib/data/pricing.config';

	let heroRef: HTMLElement;
	let tablesRef: HTMLElement;
	let additionalChargesRef: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Hero animation - smooth fade in with slide up
		gsap.from(heroRef.querySelectorAll('h1, p, div'), {
			y: 40,
			opacity: 0,
			duration: 1.2,
			stagger: 0.2,
			ease: 'power4.out',
			clearProps: 'all'
		});

		// Tables animation - smooth entrance
		gsap.from(tablesRef.querySelectorAll('.pricing-table'), {
			scrollTrigger: {
				trigger: tablesRef,
				start: 'top 85%',
				toggleActions: 'play none none none'
			},
			y: 60,
			opacity: 0,
			duration: 1,
			stagger: 0.3,
			ease: 'power3.out',
			clearProps: 'all'
		});

		// Additional charges animation - smooth card entrance
		gsap.from(additionalChargesRef.querySelectorAll('.charge-card'), {
			scrollTrigger: {
				trigger: additionalChargesRef,
				start: 'top 85%',
				toggleActions: 'play none none none'
			},
			y: 50,
			opacity: 0,
			duration: 0.9,
			stagger: 0.15,
			ease: 'power3.out',
			clearProps: 'all'
		});
	});
</script>

<svelte:head>
	<title>Tariff Chart - Hello Drop Taxi</title>
	<meta
		name="description"
		content="Transparent pricing for taxi services across Tamil Nadu, Kerala, Karnataka, and Pondicherry. View our complete tariff chart with no hidden charges."
	/>
</svelte:head>

<div class="mb-0">
	<!-- Hero Section -->
	<section
		bind:this={heroRef}
		class="relative overflow-hidden bg-gradient-to-br from-[#E9F1FF] to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-7xl">
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
					Tariff <span class="text-primary">Chart</span>
				</h1>
				<p class="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:mt-6 sm:text-lg">
					Transparent and competitive pricing for all your travel needs. No hidden charges, no
					surprises - just honest fares for quality service.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-2">
					<span
						class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm"
					>
						Tamil Nadu
					</span>
					<span
						class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm"
					>
						Kerala
					</span>
					<span
						class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm"
					>
						Karnataka
					</span>
					<span
						class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm"
					>
						Pondicherry
					</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing Tables Section -->
	<section bind:this={tablesRef} class="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<!-- One-Way Pricing -->
			<div class="pricing-table mb-12 sm:mb-16">
				<div class="mb-6 text-center sm:mb-8">
					<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">One-Way Trip Pricing</h2>
					<p class="mt-2 text-sm text-gray-600 sm:text-base">
						Minimum distance: {PRICING_CONFIG.oneway.threshold} km | Extra km: ₹{PRICING_CONFIG
							.oneway.extraKmRate}/km
					</p>
				</div>

				<!-- Desktop Table -->
				<div class="hidden overflow-hidden rounded-xl bg-white shadow-lg md:block">
					<table class="w-full">
						<thead class="bg-primary text-white">
							<tr>
								<th class="px-4 py-4 text-left text-sm font-semibold sm:px-6">Vehicle Type</th>
								<th class="px-4 py-4 text-center text-sm font-semibold">Passengers</th>
								<th class="px-4 py-4 text-center text-sm font-semibold">AC</th>
								<th class="px-4 py-4 text-right text-sm font-semibold sm:px-6">Rate per km</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each VEHICLES as vehicle}
								<tr class="transition-colors hover:bg-gray-50">
									<td class="px-4 py-4 sm:px-6">
										<div class="font-medium text-gray-900">{vehicle.name}</div>
										<div class="text-sm text-gray-500">{vehicle.description}</div>
									</td>
									<td class="px-4 py-4 text-center text-gray-900">{vehicle.passengers}</td>
									<td class="px-4 py-4 text-center">
										{#if vehicle.airConditioning}
											<span class="text-green-600">✓</span>
										{:else}
											<span class="text-gray-400">-</span>
										{/if}
									</td>
									<td class="px-4 py-4 text-right font-semibold text-primary sm:px-6">
										₹{vehicle.onewayRatePerKm}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Mobile Cards -->
				<div class="grid gap-4 md:hidden">
					{#each VEHICLES as vehicle}
						<div class="rounded-xl bg-white p-4 shadow-md">
							<div class="mb-3 flex items-start justify-between">
								<div>
									<h3 class="font-semibold text-gray-900">{vehicle.name}</h3>
									<p class="text-sm text-gray-500">{vehicle.description}</p>
								</div>
								<span class="rounded-lg bg-primary px-3 py-1 text-sm font-bold text-white">
									₹{vehicle.onewayRatePerKm}/km
								</span>
							</div>
							<div class="flex gap-4 text-sm text-gray-600">
								<span>👥 {vehicle.passengers} seats</span>
								{#if vehicle.airConditioning}
									<span>❄️ AC</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Round-Trip Pricing -->
			<div class="pricing-table">
				<div class="mb-6 text-center sm:mb-8">
					<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Round-Trip Pricing</h2>
					<p class="mt-2 text-sm text-gray-600 sm:text-base">
						Minimum distance: {PRICING_CONFIG.roundtrip.threshold} km | Extra km: ₹{PRICING_CONFIG
							.roundtrip.extraKmRate}/km
					</p>
				</div>

				<!-- Desktop Table -->
				<div class="hidden overflow-hidden rounded-xl bg-white shadow-lg md:block">
					<table class="w-full">
						<thead class="bg-primary text-white">
							<tr>
								<th class="px-4 py-4 text-left text-sm font-semibold sm:px-6">Vehicle Type</th>
								<th class="px-4 py-4 text-center text-sm font-semibold">Passengers</th>
								<th class="px-4 py-4 text-center text-sm font-semibold">AC</th>
								<th class="px-4 py-4 text-right text-sm font-semibold sm:px-6">Rate per km</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each VEHICLES as vehicle}
								<tr class="transition-colors hover:bg-gray-50">
									<td class="px-4 py-4 sm:px-6">
										<div class="font-medium text-gray-900">{vehicle.name}</div>
										<div class="text-sm text-gray-500">{vehicle.description}</div>
									</td>
									<td class="px-4 py-4 text-center text-gray-900">{vehicle.passengers}</td>
									<td class="px-4 py-4 text-center">
										{#if vehicle.airConditioning}
											<span class="text-green-600">✓</span>
										{:else}
											<span class="text-gray-400">-</span>
										{/if}
									</td>
									<td class="px-4 py-4 text-right font-semibold text-primary sm:px-6">
										₹{vehicle.roundtripRatePerKm}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Mobile Cards -->
				<div class="grid gap-4 md:hidden">
					{#each VEHICLES as vehicle}
						<div class="rounded-xl bg-white p-4 shadow-md">
							<div class="mb-3 flex items-start justify-between">
								<div>
									<h3 class="font-semibold text-gray-900">{vehicle.name}</h3>
									<p class="text-sm text-gray-500">{vehicle.description}</p>
								</div>
								<span class="rounded-lg bg-primary px-3 py-1 text-sm font-bold text-white">
									₹{vehicle.roundtripRatePerKm}/km
								</span>
							</div>
							<div class="flex gap-4 text-sm text-gray-600">
								<span>👥 {vehicle.passengers} seats</span>
								{#if vehicle.airConditioning}
									<span>❄️ AC</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Additional Charges Section -->
	<section
		bind:this={additionalChargesRef}
		class="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
	>
		<div class="mx-auto max-w-7xl">
			<div class="mb-8 text-center sm:mb-12">
				<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Additional Charges</h2>
				<p class="mt-2 text-sm text-gray-600 sm:text-base">
					All charges are transparent and clearly communicated
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<div
					class="charge-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-3 text-3xl sm:text-4xl">🍽️</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Driver Allowance</h3>
					<p class="text-2xl font-bold text-primary sm:text-3xl">₹{PRICING_CONFIG.driverBata}</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">per day</p>
				</div>

				<div
					class="charge-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-3 text-3xl sm:text-4xl">🛣️</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Toll Charges</h3>
					<p class="text-xl font-bold text-primary sm:text-2xl">Actual</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">as per route</p>
				</div>

				<div
					class="charge-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-3 text-3xl sm:text-4xl">🅿️</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Parking Fees</h3>
					<p class="text-xl font-bold text-primary sm:text-2xl">Actual</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">if applicable</p>
				</div>

				<div
					class="charge-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-3 text-3xl sm:text-4xl">📋</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">State Permit</h3>
					<p class="text-xl font-bold text-primary sm:text-2xl">Actual</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">if required</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Important Notes Section -->
	<section class="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
		<div class="mx-auto max-w-4xl">
			<h2 class="mb-6 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
				Important Information
			</h2>

			<div class="space-y-4">
				<div class="rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
						<span class="text-green-600">✓</span> Inclusions
					</h3>
					<ul class="ml-6 space-y-1 text-sm text-gray-600 sm:text-base">
						<li>• All prices include GST</li>
						<li>• Fuel charges included</li>
						<li>• Professional driver</li>
						<li>• Vehicle maintenance</li>
					</ul>
				</div>

				<div class="rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
						<span class="text-blue-600">ℹ️</span> Payment Methods
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						We accept Cash, UPI, Credit/Debit Cards, and Online Bank Transfer
					</p>
				</div>

				<div class="rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
						<span class="text-yellow-600">⚠️</span> Cancellation Policy
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						Free cancellation up to 24 hours before trip. Cancellations within 24 hours may incur
						charges.
					</p>
				</div>

				<div class="rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 sm:text-lg">
						<span class="text-red-600">🚫</span> No Hidden Charges
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						All charges are communicated upfront. What you see is what you pay.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="mt-0 mb-0 bg-primary px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-2xl font-bold text-white sm:text-3xl">Ready to Book Your Ride?</h2>
			<p class="mt-3 text-sm text-blue-100 sm:mt-4 sm:text-base">
				Get the best rates for your journey. Book now and travel with confidence.
			</p>
			<div class="mt-6 sm:mt-8">
				<a
					href="/"
					class="inline-block rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary transition-all hover:bg-gray-100 active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
				>
					Book Now
				</a>
			</div>
		</div>
	</section>
</div>
