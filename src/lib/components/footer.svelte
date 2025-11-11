<script>
	import Logo from '$lib/icons/logo.svelte';
	import Map from '$lib/icons/map.svelte';
	import Phone from '$lib/icons/phone.svelte';
	import Insta from '$lib/icons/insta.svelte';
	import Facebook from '$lib/icons/facebook.svelte';
</script>

<footer class="mt-20 bg-[#051C34] py-10 text-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Main Footer Content -->
		<div class="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
			<!-- Logo Section -->
			<div class="flex justify-center md:justify-start">
				<div class="flex items-center gap-2">
					<Logo class="stroke-white" fill="#ffffff" />
					<h1 class="text-lg font-semibold">Rental Car</h1>
				</div>
			</div>

			<!-- Navigation Links -->
			<div class="flex justify-center md:justify-end">
				<ul class="flex flex-wrap justify-center gap-4 text-sm md:justify-end lg:gap-6">
					<li class="cursor-pointer hover:text-gray-300">Home</li>
					<li class="cursor-pointer hover:text-gray-300">Contact us</li>
					<li class="cursor-pointer hover:text-gray-300">Tariff chart</li>
					<li class="cursor-pointer hover:text-gray-300">About us</li>
				</ul>
			</div>
		</div>

		<!-- Contact Info & Social -->
		<div class="grid grid-cols-1 gap-6 border-t border-gray-700 pt-6 lg:grid-cols-2">
			<!-- Contact Information -->
			<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
				<div class="flex items-center justify-center gap-2 lg:justify-start">
					<Map />
					<p class="text-sm">123 Main Street, City, Country</p>
				</div>
				<div class="flex items-center justify-center gap-2 lg:justify-start">
					<Phone />
					<p class="text-sm">+1 (234) 567-8901</p>
				</div>
			</div>

			<!-- Social Icons & Copyright -->
			<div
				class="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row lg:justify-end"
			>
				<p class="text-sm text-gray-400">© 2024 Rental Car. All rights reserved.</p>
				<div class="flex gap-3">
					<div class="cursor-pointer transition-opacity hover:opacity-80">
						<Insta />
					</div>
					<div class="cursor-pointer transition-opacity hover:opacity-80">
						<Facebook />
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>
