<script lang="ts">
	import Calendar from '$lib/icons/calendar.svelte';
	import Car from '$lib/icons/car.svelte';
	import LocationTick from '$lib/icons/locationTick.svelte';
	import Suzuki from '$lib/icons/suzuki.svelte';
	import Toyota from '$lib/icons/toyota.svelte';
	import Tata from '$lib/icons/tata.svelte';
</script>

<section class="flex flex-col items-center px-6 py-20">
	<!-- Header -->
	<div class="flex flex-col items-center gap-4">
		<span
			class="rounded-xl bg-[#E9F1FF] px-6 py-2 text-sm font-medium tracking-wide text-primary uppercase"
		>
			How it work
		</span>
		<h2 class="text-center text-3xl font-medium text-gray-800 md:text-4xl">
			Taxi with following 3 working steps
		</h2>
	</div>

	<!-- Steps -->
	<div class="mt-16 flex flex-col items-center justify-center gap-12 md:flex-row md:gap-24">
		<!-- Step 1 -->
		<div class="flex max-w-[220px] flex-col items-center text-center">
			<div class="mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<LocationTick />
			</div>
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Choose location</h3>
			<p class="text-sm leading-relaxed text-gray-500">Choose your and find your best car</p>
		</div>

		<!-- Step 2 -->
		<div class="flex max-w-[220px] flex-col items-center text-center">
			<div class="mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<Calendar />
			</div>
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Pick-up date</h3>
			<p class="text-sm leading-relaxed text-gray-500">
				Select your pick up date and time to book your car
			</p>
		</div>

		<!-- Step 3 -->
		<div class="flex max-w-[220px] flex-col items-center text-center">
			<div class="mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<Car />
			</div>
			<h3 class="mb-2 text-lg font-semibold text-gray-900">Book your car</h3>
			<p class="text-sm leading-relaxed text-gray-500">
				Book your car and we will deliver it directly to you
			</p>
		</div>
	</div>

	<!--  -->
	<!-- svelte-ignore a11y_distracting_elements -->
	<marquee behavior="" direction="" class="mt-36">
		<div class="flex gap-24">
			<Suzuki />
			<Toyota />
			<Tata />
		</div>
	</marquee>
</section>
