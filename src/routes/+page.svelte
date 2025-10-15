<script>
	import { Tabs } from 'bits-ui';
</script>

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
	<div class="z-0 mt-16 mb-8 w-full sm:mt-24 sm:mb-12 md:mt-32 lg:mt-40 lg:mb-16">
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
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<!-- Drop off location -->
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
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
							/>
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
								type="text"
								value="Thu 16 Feb, 11:00"
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<!-- Submit Button -->
					<div class="flex items-end sm:col-span-2 lg:col-span-1">
						<button
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
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<!-- Drop off location -->
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
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none sm:text-sm"
							/>
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
								type="text"
								value="Thu 16 Feb, 11:00"
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
								class="mb-1 block text-xs font-semibold text-gray-900 sm:text-sm">Return time</label
							>
							<input
								id="return-time-roundtrip"
								type="text"
								value="Fri 17 Feb, 11:00"
								class="w-full border-0 bg-transparent p-0 text-xs text-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<!-- Submit Button -->
					<div class="flex items-end sm:col-span-2 lg:col-span-1">
						<button
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
