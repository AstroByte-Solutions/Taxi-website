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
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/porsche_car_bvtfEE6A23.png',
			name: 'Maruti Suzuki Dzire',
			rating: 4.5,
			reviews: 3456,
			passengers: 4,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			price: 1200,
			priceUnit: 'day',
			category: 'Sedan'
		},
		{
			id: 2,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/porsche_car_bvtfEE6A23.png',
			name: 'Toyota Innova Crysta',
			rating: 4.7,
			reviews: 2890,
			passengers: 7,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			price: 2500,
			priceUnit: 'day',
			category: 'MUV'
		},
		{
			id: 3,
			name: 'Honda City',
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/porsche_car_bvtfEE6A23.png',
			rating: 4.6,
			reviews: 2234,
			passengers: 5,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			price: 1800,
			priceUnit: 'day',
			category: 'Sedan'
		},
		{
			id: 4,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/porsche_car_bvtfEE6A23.png',
			name: 'Mahindra Scorpio',
			rating: 4.4,
			reviews: 1987,
			passengers: 7,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			price: 2200,
			priceUnit: 'day',
			category: 'SUV'
		}
	];
</script>

<section class="mx-auto flex max-w-7xl flex-col items-center justify-center px-4">
	<div class="flex flex-col items-center justify-center gap-4 text-center">
		<div class="rounded-lg bg-[#1572D31A] px-8 py-4 text-sm font-medium text-primary">
			POPULAR RENTAL DEALS
		</div>
		<h1 class="text-4xl font-bold">Most popular cars rental deals</h1>
	</div>
	<div class="my-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-500">Price</p>
						</div>

						<p class="text-xl font-bold text-gray-900">
							₹{car.price} <span class="text-sm font-normal text-gray-500">/ {car.priceUnit}</span>
						</p>
					</div>
					<button
						class="mt-4 w-full rounded-lg bg-primary py-3.5 text-white active:scale-[0.98] active:transition-all"
					>
						Book Now
					</button>
				</div>
			</div>
		{/each}
	</div>
</section>
