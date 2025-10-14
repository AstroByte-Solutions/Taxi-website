<script>
	import Calendar from '$lib/icons/calendar.svelte';
	import Car from '$lib/icons/car.svelte';
	import LocationTick from '$lib/icons/locationTick.svelte';
</script>

<section class="flex flex-col items-center py-20 px-6 bg-white">
	<!-- Header -->
	<div class="flex flex-col items-center gap-4">
		<span class="bg-[#E9F1FF] text-[#2F80ED] text-sm font-medium px-6 py-2 rounded-xl uppercase tracking-wide">
			How it work
		</span>
		<h2 class="text-3xl md:text-4xl font-medium text-gray-800 text-center">
			Rent with following 3 working steps
		</h2>
	</div>

	<!-- Steps -->
	<div class="mt-16 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
		<!-- Step 1 -->
		<div class="flex flex-col items-center text-center max-w-[220px]">
			<div class="rounded-2xl bg-[#ECF5FF] p-6 mb-6">
				<LocationTick />
			</div>
			<h3 class="font-semibold text-lg text-gray-900 mb-2">Choose location</h3>
			<p class="text-gray-500 text-sm leading-relaxed">
				Choose your and find your best car
			</p>
		</div>

		<!-- Step 2 -->
		<div class="flex flex-col items-center text-center max-w-[220px]">
			<div class="rounded-2xl bg-[#ECF5FF] p-6 mb-6">
				<Calendar/>
			</div>
			<h3 class="font-semibold text-lg text-gray-900 mb-2">Pick-up date</h3>
			<p class="text-gray-500 text-sm leading-relaxed">
				Select your pick up date and time to book your car
			</p>
		</div>

		<!-- Step 3 -->
		<div class="flex flex-col items-center text-center max-w-[220px]">
			<div class="rounded-2xl bg-[#ECF5FF] p-6 mb-6">
				<Car/>
			</div>
			<h3 class="font-semibold text-lg text-gray-900 mb-2">Book your car</h3>
			<p class="text-gray-500 text-sm leading-relaxed">
				Book your car and we will deliver it directly to you
			</p>
		</div>
	</div>
</section>

