<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let heroRef: HTMLElement;
	let missionRef: HTMLElement;
	let valuesRef: HTMLElement;
	let statsRefs: HTMLDivElement[] = [];
	let teamRef: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Hero section animation
		gsap.from(heroRef.querySelectorAll('h1, p'), {
			y: 50,
			opacity: 0,
			duration: 1,
			stagger: 0.2,
			ease: 'power3.out'
		});

		// Mission section animation
		gsap.from(missionRef, {
			scrollTrigger: {
				trigger: missionRef,
				start: 'top 80%'
			},
			y: 60,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		});

		// Values animation - smooth card entrance (matching tariff chart style)
		gsap.from(valuesRef.querySelectorAll('.value-card'), {
			scrollTrigger: {
				trigger: valuesRef,
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

		// Stats counter animation
		statsRefs.forEach((stat) => {
			const numberElement = stat.querySelector('.stat-number');
			if (numberElement) {
				const targetValue = parseInt(numberElement.textContent || '0');
				gsap.from(numberElement, {
					scrollTrigger: {
						trigger: stat,
						start: 'top 85%'
					},
					textContent: 0,
					duration: 2,
					snap: { textContent: 1 },
					ease: 'power1.out',
					onUpdate: function () {
						numberElement.textContent = Math.ceil(
							parseFloat(numberElement.textContent || '0')
						).toString();
					}
				});
			}
		});
	});
</script>

<svelte:head>
	<title>About Us - Hello Drop Taxi</title>
	<meta
		name="description"
		content="Learn about Hello Drop Taxi - Your trusted taxi service in Tamil Nadu, Kerala, and Pondicherry. Professional drivers, affordable fares, 24/7 service."
	/>
</svelte:head>

<div class="mb-0">
	<!-- Hero Section -->
	<section
		bind:this={heroRef}
		class="relative overflow-hidden bg-gradient-to-br from-[#E9F1FF] to-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
	>
		<div class="mx-auto max-w-7xl">
			<div class="text-center">
				<h1 class="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
					About <span class="text-primary">Hello Drop Taxi</span>
				</h1>
				<p class="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl">
					Your trusted travel partner across Tamil Nadu, Kerala, karnataka and Pondicherry. We're
					committed to providing safe, comfortable, and affordable taxi services for every journey.
				</p>
			</div>
		</div>
	</section>

	<!-- Mission Section -->
	<section bind:this={missionRef} class="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
				<div>
					<span
						class="inline-block rounded-xl bg-[#E9F1FF] px-4 py-2 text-lg font-medium tracking-wide text-primary uppercase"
					>
						Our Mission
					</span>
					<h2 class="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
						Making Every Journey Comfortable and Reliable
					</h2>
					<p class="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
						At Hello Drop Taxi, we believe that travel should be stress-free and enjoyable. Our
						mission is to provide exceptional taxi services that connect people to their
						destinations safely and on time.
					</p>
					<p class="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
						Founded with a vision to revolutionize local transportation, we've grown to become one
						of the most trusted taxi services in South India. Our commitment to quality, safety, and
						customer satisfaction drives everything we do.
					</p>

					<!-- Experience Badge -->
					<div
						class="mt-8 inline-flex items-center gap-4 rounded-2xl bg-primary px-6 py-4 text-white shadow-lg"
					>
						<div>
							<p class="text-4xl font-bold">5+</p>
							<p class="text-sm">Years</p>
						</div>
						<div class="h-12 w-px bg-white/30"></div>
						<div>
							<p class="text-sm font-medium">of Excellence</p>
							<p class="text-xs text-blue-100">Serving South India</p>
						</div>
					</div>
				</div>

				<div class="relative">
					<div class="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
						<img
							src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop"
							alt="Professional taxi service"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Additional Info -->
			<div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<div class="rounded-xl bg-gray-50 p-6">
					<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Our Story</h3>
					<p class="mt-3 text-sm text-gray-600 sm:text-base">
						Started in 2019, Hello Drop Taxi began with a simple goal: to make transportation
						accessible, reliable, and comfortable for everyone in South India. Today, we serve
						thousands of customers across four states.
					</p>
				</div>

				<div class="rounded-xl bg-gray-50 p-6">
					<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Our Fleet</h3>
					<p class="mt-3 text-gray-600">
						We maintain a diverse fleet of well-maintained vehicles ranging from sedans to SUVs,
						ensuring we have the perfect ride for every occasion - whether it's a business trip,
						family vacation, or airport transfer.
					</p>
				</div>

				<div class="rounded-xl bg-gray-50 p-6">
					<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Our Commitment</h3>
					<p class="mt-3 text-gray-600">
						We're committed to environmental sustainability, driver welfare, and community
						development. Every ride with us supports local drivers and contributes to a cleaner,
						better-connected South India.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<div bind:this={statsRefs[0]} class="text-center">
					<p class="stat-number text-4xl font-bold text-primary sm:text-5xl">10000</p>
					<p class="mt-2 text-base font-medium text-gray-600 sm:text-lg">Happy Customers</p>
				</div>
				<div bind:this={statsRefs[1]} class="text-center">
					<p class="stat-number text-4xl font-bold text-primary sm:text-5xl">10</p>
					<p class="mt-2 text-base font-medium text-gray-600 sm:text-lg">Professional Drivers</p>
				</div>
				<div bind:this={statsRefs[2]} class="text-center">
					<p class="stat-number text-4xl font-bold text-primary sm:text-5xl">4</p>
					<p class="mt-2 text-base font-medium text-gray-600 sm:text-lg">States Covered</p>
				</div>
				<div bind:this={statsRefs[3]} class="text-center">
					<p class="stat-number text-4xl font-bold text-primary sm:text-5xl">24</p>
					<p class="mt-2 text-base font-medium text-gray-600 sm:text-lg">Hours Service</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Values Section -->
	<section
		bind:this={valuesRef}
		class="bg-gray-100 px-4 py-10 pb-8 sm:px-6 sm:py-16 sm:pb-20 lg:px-8 lg:py-20 lg:pb-24"
	>
		<div class="mx-auto max-w-7xl">
			<div class="text-center">
				<span
					class="inline-block rounded-xl bg-[#E9F1FF] px-4 py-2 text-lg font-medium tracking-wide text-primary uppercase"
				>
					Our Values
				</span>
				<h2 class="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">What We Stand For</h2>
				<p class="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
					Our core values guide every decision we make and every service we provide.
				</p>
			</div>

			<div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Safety First -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Safety First</h3>
							<p class="mt-2 text-sm text-gray-600">
								Your safety is our top priority. All our drivers are verified, trained, and vehicles
								are regularly maintained.
							</p>
						</div>
					</div>
				</div>

				<!-- Punctuality -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Punctuality</h3>
							<p class="mt-2 text-sm text-gray-600">
								We value your time. Our drivers arrive on time and get you to your destination as
								scheduled.
							</p>
						</div>
					</div>
				</div>

				<!-- Customer Satisfaction -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">
								Customer Satisfaction
							</h3>
							<p class="mt-2 text-sm text-gray-600">
								Your comfort matters to us. We go the extra mile to ensure every ride exceeds
								expectations.
							</p>
						</div>
					</div>
				</div>

				<!-- Transparent Pricing -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Transparent Pricing</h3>
							<p class="mt-2 text-sm text-gray-600">
								No hidden charges, no surprises. We believe in fair and transparent pricing for all
								services.
							</p>
						</div>
					</div>
				</div>

				<!-- Professional Team -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Professional Team</h3>
							<p class="mt-2 text-sm text-gray-600">
								Our experienced drivers are trained to provide the best service and make your
								journey pleasant.
							</p>
						</div>
					</div>
				</div>

				<!-- Wide Coverage -->
				<div class="value-card rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
					<div class="flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ECF5FF]"
						>
							<svg
								class="h-6 w-6 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<div>
							<h3 class="text-base font-semibold text-gray-900 sm:text-lg">Wide Coverage</h3>
							<p class="mt-2 text-sm text-gray-600">
								Serving Tamil Nadu, Kerala, Karnataka and Pondicherry. We're here to take you
								wherever you need to go.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="mt-4 mb-0 bg-primary px-4 py-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-3xl font-bold text-white sm:text-4xl">Ready to Book Your Ride?</h2>
			<p class="mt-4 text-base text-blue-100 sm:text-lg">
				Experience the best taxi service in South India. Book your ride now and travel with
				confidence.
			</p>
			<div class="mt-8">
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
