<script lang="ts">
	import Audi from '$lib/images/Audi.png';
	import Wallet from '$lib/icons/wallet.svelte';
	import UserTick from '$lib/icons/userTick.svelte';
	import Messages from '$lib/icons/messages.svelte';
	import HrsSupport from '$lib/icons/24hrs-support.svelte';
	import Vector from '$lib/icons/vector.svelte';
</script>

<section
	class="mt-8 flex flex-col items-center justify-between gap-8 pr-4 pl-0 sm:mt-11 sm:gap-12 sm:px-6 lg:flex-row lg:gap-28 lg:pr-8 lg:pl-0"
>
	<!-- Image Section -->
	<div class="relative flex w-full justify-start lg:w-1/2">
		<div class="relative max-w-full">
			<img src={Audi} alt="Audi car" class="h-auto w-full md:-ml-6" />
			<span
				class="pointer-events-none absolute w-3/4 max-w-[600px] opacity-0 sm:-left-14 sm:w-2/3 lg:left-0 lg:w-full xl:-top-40 xl:-left-2 xl:opacity-100"
			>
				<Vector />
			</span>
		</div>
	</div>

	<!-- Content Section -->
	<div class="ml-8 w-full md:ml-0 lg:-mt-9 lg:ml-0 lg:w-1/2">
		<span
			class="inline-block rounded-xl bg-[#E9F1FF] px-4 py-2 text-xs font-medium tracking-wide text-primary uppercase sm:px-6 sm:text-sm"
		>
			Why Choose us
		</span>

		<h2
			class="mt-6 text-2xl leading-tight font-medium text-gray-800 sm:mt-8 sm:text-3xl md:text-4xl"
		>
			We offer the best ride experience with our taxi service
		</h2>

		<!-- Features List -->
		<div class="mt-8 space-y-6 sm:mt-12 sm:space-y-8">
			<!-- Feature 1 -->
			<div class="flex gap-4 sm:gap-6">
				<div class="h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
					<Wallet />
				</div>

				<div class="flex-1">
					<h3 class="mb-1 text-lg leading-relaxed font-semibold text-gray-900 sm:text-xl">
						Affordable fares guaranteed
					</h3>
					<p class="text-sm leading-relaxed font-normal text-secondary sm:text-base">
						Get the best price for your ride, no hidden charges or surge pricing.
					</p>
				</div>
			</div>

			<!-- Feature 2 -->
			<div class="flex gap-4 sm:gap-6">
				<div class="h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
					<UserTick />
				</div>
				<div class="flex-1">
					<h3 class="mb-1 text-lg leading-relaxed font-semibold text-gray-900 sm:text-xl">
						Professional drivers
					</h3>
					<p class="text-sm leading-relaxed font-normal text-secondary sm:text-base">
						Our skilled and friendly drivers ensure you reach your destination safely and
						comfortably.
					</p>
				</div>
			</div>

			<!-- Feature 3 -->
			<div class="flex gap-4 sm:gap-6">
				<div class="h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
					<Messages />
				</div>
				<div class="flex-1">
					<h3 class="mb-1 text-lg leading-relaxed font-semibold text-gray-900 sm:text-xl">
						Fast pickup & on-time drop
					</h3>
					<p class="text-sm leading-relaxed font-normal text-secondary sm:text-base">
						Book anytime, and we'll be there quickly to take you where you need to go.
					</p>
				</div>
			</div>

			<!-- Feature 4 -->
			<div class="flex gap-4 sm:gap-6">
				<div class="h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
					<HrsSupport />
				</div>
				<div class="flex-1">
					<h3 class="mb-1 text-lg leading-relaxed font-semibold text-gray-900 sm:text-xl">
						24/7 customer support
					</h3>
					<p class="text-sm leading-relaxed font-normal text-secondary sm:text-base">
						Have a question or need help? Our team is available anytime to assist you.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
