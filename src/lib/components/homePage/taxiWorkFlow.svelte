<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Calendar from '$lib/icons/calendar.svelte';
	import Car from '$lib/icons/car.svelte';
	import LocationTick from '$lib/icons/locationTick.svelte';
	import Suzuki from '$lib/icons/suzuki.svelte';
	import Toyota from '$lib/icons/toyota.svelte';
	import Tata from '$lib/icons/tata.svelte';

	let sectionRef: HTMLElement;
	let badgeRef: HTMLSpanElement;
	let headingRef: HTMLHeadingElement;
	let stepRefs: HTMLDivElement[] = [];
	let marqueeRef: HTMLDivElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Header animation
		const headerTl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 75%',
				end: 'top 40%',
				toggleActions: 'play none none reverse'
			}
		});

		// Steps animation with connecting line
		stepRefs.forEach((step, index) => {
			if (!step) return;

			const stepTl = gsap.timeline({
				scrollTrigger: {
					trigger: step,
					start: 'top 80%',
					end: 'top 50%',
					toggleActions: 'play none none reverse'
				}
			});

			const icon = step.querySelector('.step-icon');
			const iconBg = step.querySelector('.icon-bg');
			const title = step.querySelector('.step-title');
			const description = step.querySelector('.step-description');
			const stepNumber = step.querySelector('.step-number');

			// Sequential animation for each step
			stepTl
				.from(step, {
					y: 100,
					opacity: 0,
					duration: 0.8,
					ease: 'power3.out',
					delay: index * 0.2
				})
				.from(
					iconBg,
					{
						scale: 0,
						rotation: -180,
						duration: 0.6,
						ease: 'back.out(2)'
					},
					'-=0.5'
				)
				.from(
					icon,
					{
						scale: 0,
						rotation: 360,
						opacity: 0,
						duration: 0.6,
						ease: 'back.out(1.5)'
					},
					'-=0.4'
				)
				.from(
					stepNumber,
					{
						scale: 0,
						opacity: 0,
						duration: 0.4,
						ease: 'back.out(3)'
					},
					'-=0.3'
				)
				.from(
					title,
					{
						y: 20,
						opacity: 0,
						duration: 0.5,
						ease: 'power2.out'
					},
					'-=0.3'
				)
				.from(
					description,
					{
						y: 15,
						opacity: 0,
						duration: 0.5,
						ease: 'power2.out'
					},
					'-=0.3'
				);

			// Hover animations
			step.addEventListener('mouseenter', () => {
				gsap.to(iconBg, {
					scale: 1.1,
					boxShadow: '0 10px 30px rgba(21, 114, 211, 0.3)',
					duration: 0.4,
					ease: 'back.out(2)'
				});
				gsap.to(step, {
					y: -10,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(stepNumber, {
					scale: 1.2,
					color: '#1572D3',
					duration: 0.3
				});
			});

			step.addEventListener('mouseleave', () => {
				gsap.to(iconBg, {
					scale: 1,
					boxShadow: '0 0 0 rgba(21, 114, 211, 0)',
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(step, {
					y: 0,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(stepNumber, {
					scale: 1,
					color: '#1572D3',
					duration: 0.3
				});
			});
		});

		// Marquee animation using GSAP instead of HTML marquee
		if (marqueeRef) {
			const logos = marqueeRef.querySelectorAll('.brand-logo');
			const marqueeContent = marqueeRef.querySelector('.marquee-content');

			// Clone logos for seamless loop
			if (marqueeContent) {
				const clone = marqueeContent.cloneNode(true);
				marqueeRef.appendChild(clone);
			}

			// Animate marquee
			if (marqueeRef) {
				// ensure DOM painted
				requestAnimationFrame(() => {
					const marqueeContent = marqueeRef.querySelector('.marquee-content') as HTMLElement | null;
					if (!marqueeContent) {
						console.warn('marquee: no .marquee-content found — skipping marquee animation');
						return;
					}

					// clone for loop only if needed
					const clone = marqueeContent.cloneNode(true) as HTMLElement;
					marqueeRef.appendChild(clone);

					// measure once DOM has been updated
					// use offsetWidth/scrollWidth depending on the desired measurement
					const width =
						marqueeRef.scrollWidth || marqueeContent.offsetWidth || marqueeContent.clientWidth;
					if (!width || width === 0) {
						console.warn('marquee: width is 0 — skipping marquee animation');
						return;
					}

					gsap.to(Array.from(marqueeRef.children), {
						x: '-100%',
						duration: 20,
						repeat: -1,
						ease: 'none',
						modifiers: {
							x: gsap.utils.unitize((x: string) => {
								// parseFloat(x) might be NaN if x is not numeric; guard it
								const num = parseFloat(x) || 0;
								return (num % (width / 2)).toString();
							})
						}
					});

					// rest of logo animation...
				});
			}

			// Logo entrance animation
			gsap.from(logos, {
				scrollTrigger: {
					trigger: marqueeRef,
					start: 'top 85%',
					toggleActions: 'play none none reverse'
				},
				scale: 0,
				opacity: 0,
				duration: 0.6,
				stagger: 0.2,
				ease: 'back.out(2)'
			});

			// Individual logo hover effects
			logos.forEach((logo) => {
				logo.addEventListener('mouseenter', () => {
					gsap.to(logo, {
						scale: 1.2,
						y: -10,
						duration: 0.3,
						ease: 'back.out(2)'
					});
				});
				logo.addEventListener('mouseleave', () => {
					gsap.to(logo, {
						scale: 1,
						y: 0,
						duration: 0.3,
						ease: 'power2.out'
					});
				});
			});
		}

		// Badge continuous pulse
		gsap.to(badgeRef, {
			scale: 1.05,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		// Create connecting lines between steps (desktop only)
		if (window.innerWidth >= 768) {
			stepRefs.forEach((step, index) => {
				if (index < stepRefs.length - 1 && step && stepRefs[index + 1]) {
					const line = document.createElement('div');
					line.className = 'connecting-line';
					line.style.cssText = `
						position: absolute;
						top: 50%;
						left: 100%;
						width: 96px;
						height: 2px;
						background: linear-gradient(90deg, #1572D3 0%, transparent 100%);
						transform: translateY(-50%);
						opacity: 0.3;
					`;
					step.style.position = 'relative';
					step.appendChild(line);

					// Animate line on scroll
					gsap.from(line, {
						scrollTrigger: {
							trigger: step,
							start: 'top 75%',
							toggleActions: 'play none none reverse'
						},
						scaleX: 0,
						duration: 0.8,
						delay: 0.5,
						ease: 'power2.out'
					});
				}
			});
		}
	});
</script>

<section bind:this={sectionRef} class="flex flex-col items-center px-6 py-20 lg:mb-20">
	<!-- Header -->
	<div class="flex flex-col items-center gap-4">
		<span
			bind:this={badgeRef}
			class="rounded-xl bg-[#E9F1FF] px-6 py-2 text-sm font-medium tracking-wide text-primary uppercase"
		>
			How it work
		</span>
		<h2 bind:this={headingRef} class="text-center text-3xl font-medium text-gray-800 md:text-4xl">
			Taxi with following 3 working steps
		</h2>
	</div>

	<!-- Steps -->
	<div class="mt-16 flex flex-col items-center justify-center gap-12 md:flex-row md:gap-24">
		<!-- Step 1 -->
		<div
			bind:this={stepRefs[0]}
			class="relative flex max-w-[220px] flex-col items-center text-center"
		>
			<div class="icon-bg mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<div class="step-icon">
					<LocationTick />
				</div>
			</div>
			<h3 class="step-title mb-2 text-lg font-semibold text-gray-900">Choose location</h3>
			<p class="step-description text-sm leading-relaxed text-gray-500">
				Choose your and find your best car
			</p>
		</div>

		<!-- Step 2 -->
		<div
			bind:this={stepRefs[1]}
			class="relative flex max-w-[220px] flex-col items-center text-center"
		>
			<div class="icon-bg mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<div class="step-icon">
					<Calendar />
				</div>
			</div>
			<h3 class="step-title mb-2 text-lg font-semibold text-gray-900">Pick-up date</h3>
			<p class="step-description text-sm leading-relaxed text-gray-500">
				Select your pick up date and time to book your car
			</p>
		</div>

		<!-- Step 3 -->
		<div
			bind:this={stepRefs[2]}
			class="relative flex max-w-[220px] flex-col items-center text-center"
		>
			<div class="icon-bg mb-6 rounded-2xl bg-[#ECF5FF] p-6">
				<div class="step-icon">
					<Car />
				</div>
			</div>
			<h3 class="step-title mb-2 text-lg font-semibold text-gray-900">Book your car</h3>
			<p class="step-description text-sm leading-relaxed text-gray-500">
				Book your car and we will deliver it directly to you
			</p>
		</div>
	</div>

	<!-- Brands Marquee (GSAP-powered) -->
	<div class="mt-36 w-full overflow-hidden">
		<div bind:this={marqueeRef} class="flex gap-24">
			<div class="marquee-content flex shrink-0 gap-24">
				<div class="brand-logo cursor-pointer">
					<Suzuki />
				</div>
				<div class="brand-logo cursor-pointer">
					<Toyota />
				</div>
				<div class="brand-logo cursor-pointer">
					<Tata />
				</div>
				<div class="brand-logo cursor-pointer">
					<Suzuki />
				</div>
				<div class="brand-logo cursor-pointer">
					<Toyota />
				</div>
				<div class="brand-logo cursor-pointer">
					<Tata />
				</div>
			</div>
		</div>
	</div>
</section>
