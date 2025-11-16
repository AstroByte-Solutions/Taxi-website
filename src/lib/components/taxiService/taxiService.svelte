<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Audi from '$lib/images/Audi.png';
	import Wallet from '$lib/icons/wallet.svelte';
	import UserTick from '$lib/icons/userTick.svelte';
	import Messages from '$lib/icons/messages.svelte';
	import HrsSupport from '$lib/icons/24hrs-support.svelte';
	import Vector from '$lib/icons/vector.svelte';

	let sectionRef: HTMLElement;
	let carImageRef: HTMLDivElement;
	let vectorRef: HTMLSpanElement;
	let badgeRef: HTMLSpanElement;
	let headingRef: HTMLHeadingElement;
	let featureRefs: HTMLDivElement[] = [];

	onMount(() => {
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		// Main timeline with ScrollTrigger
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 80%',
				end: 'top 30%',
				toggleActions: 'play none none reverse'
			},
			defaults: { ease: 'power3.out' }
		});

		// Car image animation - slide in from left with scale
		tl.from(carImageRef, {
			x: -200,
			opacity: 0,
			scale: 0.8,
			duration: 1.2,
			ease: 'back.out(1.5)'
		})
			// Vector decoration - rotate and fade in
			// Heading - slide up and fade
			.from(
				headingRef,
				{
					y: 40,
					opacity: 0,
					duration: 0.8
				},
				'-=0.4'
			)
			// Features - stagger from right
			.from(
				featureRefs,
				{
					x: 100,
					opacity: 0,
					duration: 0.6,
					stagger: 0.15,
					ease: 'power2.out'
				},
				'-=0.4'
			);

		// Continuous car hover animation
		gsap.to(carImageRef, {
			y: -10,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		// Vector rotation animation
		gsap.to(vectorRef, {
			rotation: 5,
			duration: 4,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		// Icon hover animations
		featureRefs.forEach((feature, index) => {
			const icon = feature.querySelector('.icon-container');

			if (icon) {
				// Pulse animation on scroll into view
				ScrollTrigger.create({
					trigger: feature,
					start: 'top 85%',
					onEnter: () => {
						gsap.fromTo(
							icon,
							{ scale: 1 },
							{
								scale: 1.1,
								duration: 0.3,
								yoyo: true,
								repeat: 1,
								ease: 'power2.inOut'
							}
						);
					}
				});

				// Hover effect
				feature.addEventListener('mouseenter', () => {
					gsap.to(icon, {
						scale: 1.15,
						rotation: 5,
						duration: 0.3,
						ease: 'back.out(2)'
					});
					gsap.to(feature, {
						x: 10,
						duration: 0.3,
						ease: 'power2.out'
					});
				});

				feature.addEventListener('mouseleave', () => {
					gsap.to(icon, {
						scale: 1,
						rotation: 0,
						duration: 0.3,
						ease: 'power2.out'
					});
					gsap.to(feature, {
						x: 0,
						duration: 0.3,
						ease: 'power2.out'
					});
				});
			}
		});

		// Badge hover animation
		badgeRef.addEventListener('mouseenter', () => {
			gsap.to(badgeRef, {
				scale: 1.05,
				duration: 0.3,
				ease: 'back.out(2)'
			});
		});

		badgeRef.addEventListener('mouseleave', () => {
			gsap.to(badgeRef, {
				scale: 1,
				duration: 0.3,
				ease: 'power2.out'
			});
		});
	});
</script>

<section
	bind:this={sectionRef}
	class="mt-8 flex flex-col items-center justify-between gap-8 pr-4 pl-0 sm:mt-11 sm:gap-12 sm:px-6 lg:mb-20 lg:flex-row lg:gap-28 lg:pr-8 lg:pl-0"
>
	<!-- Image Section -->
	<div class="relative flex w-full justify-start lg:w-1/2">
		<div bind:this={carImageRef} class="relative max-w-full">
			<img src={Audi} alt="Audi car" class="h-auto w-full md:-ml-6" />
			<span
				bind:this={vectorRef}
				class="pointer-events-none absolute w-3/4 max-w-[600px] opacity-0 sm:-left-14 sm:w-2/3 lg:left-0 lg:w-full xl:-top-40 xl:-left-2 xl:opacity-100"
			>
				<Vector />
			</span>
		</div>
	</div>

	<!-- Content Section -->
	<div class="ml-8 w-full md:ml-0 lg:-mt-9 lg:ml-0 lg:w-1/2">
		<span
			bind:this={badgeRef}
			class="inline-block cursor-pointer rounded-xl bg-[#E9F1FF] px-4 py-2 text-xs font-medium tracking-wide text-primary uppercase sm:px-6 sm:text-sm"
		>
			Why Choose us
		</span>

		<h2
			bind:this={headingRef}
			class="mt-6 text-2xl leading-tight font-medium text-gray-800 sm:mt-8 sm:text-3xl md:text-4xl"
		>
			We offer the best ride experience with our taxi service
		</h2>

		<!-- Features List -->
		<div class="mt-8 space-y-6 sm:mt-12 sm:space-y-8">
			<!-- Feature 1 -->
			<div bind:this={featureRefs[0]} class="flex cursor-pointer gap-4 sm:gap-6">
				<div class="icon-container h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
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
			<div bind:this={featureRefs[1]} class="flex cursor-pointer gap-4 sm:gap-6">
				<div class="icon-container h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
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
			<div bind:this={featureRefs[2]} class="flex cursor-pointer gap-4 sm:gap-6">
				<div class="icon-container h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
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
			<div bind:this={featureRefs[3]} class="flex cursor-pointer gap-4 sm:gap-6">
				<div class="icon-container h-fit flex-shrink-0 rounded-2xl bg-[#ECF5FF] p-4 sm:p-5">
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
