<script>
	import Logo from '$lib/icons/logo.svelte';
	let mobileMenuOpen = $state(false);
</script>

<nav class="mt-6 flex items-center justify-between px-4 md:mt-10 md:px-20">
	<div class="z-50 flex items-center gap-2">
		<Logo />
		<span class="font-semibold text-primary capitalize">SKR</span>
	</div>

	<!-- Desktop Navigation -->
	<div class="hidden lg:block">
		<ul class="flex gap-6 text-[#484848] xl:gap-10">
			<li class="cursor-pointer transition-colors hover:text-primary">Home</li>
			<li class="cursor-pointer transition-colors hover:text-primary">Tariff chart</li>
			<li class="cursor-pointer transition-colors hover:text-primary">About us</li>
			<li class="cursor-pointer transition-colors hover:text-primary">Contact us</li>
			<li class="cursor-pointer transition-colors hover:text-primary">Attach vehicle</li>
		</ul>
	</div>

	<!-- Mobile Menu Button -->
	<button
		class="z-20 flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
		onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		aria-label="Toggle menu"
	>
		<span
			class="h-0.5 w-6 bg-[#484848] transition-all {mobileMenuOpen
				? 'translate-y-2 rotate-45'
				: ''}"
		></span>
		<span class="h-0.5 w-6 bg-[#484848] transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></span>
		<span
			class="h-0.5 w-6 bg-[#484848] transition-all {mobileMenuOpen
				? '-translate-y-2 -rotate-45'
				: ''}"
		></span>
	</button>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="fixed inset-0 z-10 bg-white lg:hidden">
			<ul class="flex flex-col gap-8 px-8 pt-28 text-lg text-[#484848]">
				<li
					class="cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary"
				>
					Home
				</li>
				<li
					class="cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary"
				>
					Tariff chart
				</li>
				<li
					class="cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary"
				>
					About us
				</li>
				<li
					class="cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary"
				>
					Contact us
				</li>
				<li
					class="cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary"
				>
					Attach vehicle
				</li>
			</ul>
		</div>
	{/if}
</nav>
