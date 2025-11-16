<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/icons/logo.svelte';

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Tariff chart', href: '/tariff-chart' },
		{ label: 'About us', href: '/about-us' },
		{ label: 'Contact us', href: '/contact-us' }
	];

	function isActive(href: string) {
		return $page.url.pathname === href;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-4 shadow-md md:px-20 md:py-6"
>
	<a href="/" class="z-50 flex items-center gap-2">
		<Logo />
		<span class="font-semibold text-primary capitalize">Hello Drop Taxi</span>
	</a>

	<!-- Desktop Navigation -->
	<div class="hidden lg:block">
		<ul class="flex gap-6 text-[#484848] xl:gap-10">
			{#each navItems as item}
				<li class="relative">
					<a
						href={item.href}
						class="cursor-pointer transition-colors hover:text-primary {isActive(item.href)
							? 'font-semibold text-primary'
							: ''}"
					>
						{item.label}
					</a>
					{#if isActive(item.href)}
						<span class="absolute right-0 -bottom-2 left-0 h-0.5 rounded-full bg-primary"></span>
					{/if}
				</li>
			{/each}
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
				{#each navItems as item}
					<li class="relative">
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class="block cursor-pointer border-b border-gray-200 pb-4 transition-colors hover:text-primary {isActive(
								item.href
							)
								? 'border-primary font-semibold text-primary'
								: ''}"
						>
							{item.label}
							{#if isActive(item.href)}
								<span class="absolute bottom-0 left-0 h-1 w-12 rounded-full bg-primary"></span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>
