<script lang="ts">
	import Door from '$lib/icons/door.svelte';
	import Frost from '$lib/icons/frost.svelte';
	import Profile from '$lib/icons/profile.svelte';
	import Star from '$lib/icons/star.svelte';
	import Transimission from '$lib/icons/transimission.svelte';

	const cars = [
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
			price: 1200,
			priceUnit: 'day',
			category: 'Sedan',
			pricePerKm: 10,
			distance: 45
		},
		{
			id: 2,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/e13mtm7rl4mswcr/5bbc278ec0e2d_51e72df7d7ea4c637a2e6606f4866f6f_VffpCWZ2c5.png',
			name: 'sedan',
			rating: 4.7,
			reviews: 2890,
			passengers: 7,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			price: 2500,
			priceUnit: 'day',
			category: 'MUV',
			pricePerKm: 15,
			distance: 60
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
			price: 1800,
			priceUnit: 'day',
			category: 'Sedan',
			pricePerKm: 12,
			distance: 50
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
			price: 2200,
			priceUnit: 'day',
			category: 'SUV',
			pricePerKm: 18,
			distance: 70
		}
	];

	function handleBack() {
		window.history.back();
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
							<span class="text-sm font-semibold text-blue-900"
								>₹{car.pricePerKm * car.distance}</span
							>
						</div>
						<p class="mt-1 text-xs text-blue-700">₹{car.pricePerKm}/km</p>
					</div>

					<!-- Daily Price -->
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-500">Price</p>
						</div>

						<p class="text-xl font-bold text-gray-900">
							₹{car.price} <span class="text-sm font-normal text-gray-500">/ {car.priceUnit}</span>
						</p>
					</div>
					<button
						class="mt-4 w-full rounded-lg bg-primary py-3.5 text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
					>
						Book Now
					</button>
				</div>
			</div>
		{/each}
	</div>
</section>
