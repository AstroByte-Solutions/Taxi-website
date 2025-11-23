<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let { children } = $props();

	let heading1: HTMLHeadingElement;
	let description: HTMLDivElement;
	let carImage: HTMLDivElement;
	let formContainer: HTMLDivElement;

	onMount(() => {
		// Create timeline for coordinated animations
		const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

		// Animate heading
		tl.from(heading1, {
			y: 50,
			opacity: 0,
			duration: 1
		})
			// Animate description
			.from(
				description,
				{
					y: 30,
					opacity: 0,
					duration: 0.8
				},
				'-=0.5'
			)
			// Animate car image with scale and rotation
			.from(
				carImage,
				{
					x: 200,
					opacity: 0,
					scale: 0.8,
					rotation: 10,
					duration: 1.2
				},
				'-=0.8'
			)
			// Animate form container
			.from(
				formContainer,
				{
					y: 50,
					opacity: 0,
					duration: 1,
					ease: 'back.out(1.2)'
				},
				'-=0.6'
			);

		// Add floating animation to car image
		gsap.to(carImage, {
			y: -15,
			duration: 2.5,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		// Animate highlighted text on hover
		const highlightedText = document.querySelectorAll('.text-primary');
		highlightedText.forEach((el) => {
			el.addEventListener('mouseenter', () => {
				gsap.to(el, {
					scale: 1.1,
					duration: 0.3,
					ease: 'back.out(2)'
				});
			});
			el.addEventListener('mouseleave', () => {
				gsap.to(el, {
					scale: 1,
					duration: 0.3,
					ease: 'power2.out'
				});
			});
		});
	});
</script>

<section
	class="relative bg-[url('https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/hywt5jppfcc1bm3/header_1_2tOQy09VKG.png')] bg-cover bg-center sm:opacity-0 md:opacity-100"
	style="overflow-x: clip;"
>
	<div
		class="mx-auto flex max-w-[1340px] flex-col justify-between px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-40"
	>
		<div class="flex flex-col gap-6 sm:gap-8 lg:gap-10">
			<div>
				<h1
					bind:this={heading1}
					class="text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl lg:text-6xl"
				>
					<span class="block">Book a Taxi!!</span>
					<span class="block"
						>One <span class="inline-block text-primary">way</span> One
						<span class="inline-block text-primary">pay</span></span
					>
				</h1>
			</div>
			<div bind:this={description} class="max-w-sm">
				<p class="text-base text-[#272727] sm:text-lg">
					Get a car wherever and whenever you need it with us.
				</p>
			</div>
		</div>

		<div
			bind:this={carImage}
			class="pointer-events-none absolute top-1/2 right-0 h-auto w-full translate-x-1/4 -translate-y-1/2 opacity-60 sm:w-3/4 sm:translate-x-1/12 sm:opacity-80 md:w-2/3 md:opacity-100 lg:w-1/2"
		>
			<img
				src="https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/z517ep0h21af2xu/chat_gpt_image_nov_12_2025_11_41_23_am_aSoLaSualo.png"
				alt="car"
				class="h-auto w-full"
			/>
		</div>

		<div bind:this={formContainer} class="z-10 mt-16 w-full sm:mt-24 lg:mt-24">
			{@render children?.()}
		</div>
	</div>
</section>
