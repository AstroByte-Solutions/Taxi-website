<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let constructionRef: HTMLDivElement;
	let coneRefs: HTMLDivElement[] = [];
	let textRef: HTMLHeadingElement;
	let subtextRef: HTMLParagraphElement;
	let buttonRef: HTMLAnchorElement;

	onMount(() => {
		// Main construction sign animation
		gsap.from(constructionRef, {
			scale: 0,
			rotation: -180,
			opacity: 0,
			duration: 1,
			ease: 'back.out(1.5)'
		});

		// Cones animation with stagger
		gsap.from(coneRefs, {
			y: -100,
			opacity: 0,
			rotation: 180,
			duration: 0.8,
			stagger: 0.2,
			ease: 'bounce.out',
			delay: 0.3
		});

		// Text animations
		gsap.from(textRef, {
			y: 50,
			opacity: 0,
			duration: 0.8,
			delay: 0.6,
			ease: 'power3.out'
		});

		gsap.from(subtextRef, {
			y: 30,
			opacity: 0,
			duration: 0.8,
			delay: 0.8,
			ease: 'power3.out'
		});

		gsap.from(buttonRef, {
			scale: 0,
			opacity: 0,
			duration: 0.6,
			delay: 1,
			ease: 'back.out(2)'
		});

		// Continuous animations
		gsap.to(constructionRef, {
			rotation: 5,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		coneRefs.forEach((cone, index) => {
			gsap.to(cone, {
				y: -10,
				duration: 1.5 + index * 0.3,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: index * 0.2
			});
		});

		// Sparkle effect
		const createSparkle = () => {
			const sparkle = document.createElement('div');
			sparkle.className = 'sparkle';
			sparkle.style.cssText = `
				position: absolute;
				width: 4px;
				height: 4px;
				background: #FCD34D;
				border-radius: 50%;
				pointer-events: none;
			`;

			const x = Math.random() * window.innerWidth;
			const y = Math.random() * window.innerHeight;

			sparkle.style.left = x + 'px';
			sparkle.style.top = y + 'px';

			document.body.appendChild(sparkle);

			gsap.to(sparkle, {
				scale: 2,
				opacity: 0,
				duration: 1,
				ease: 'power2.out',
				onComplete: () => sparkle.remove()
			});
		};

		const sparkleInterval = setInterval(createSparkle, 500);

		return () => clearInterval(sparkleInterval);
	});
</script>

<div
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 px-4"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div
			class="absolute inset-0"
			style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, #000 35px, #000 70px); opacity: 0.05;"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-2xl text-center">
		<!-- Construction Sign -->
		<div bind:this={constructionRef} class="mb-8 inline-block">
			<div class="relative">
				<!-- Triangle Sign -->
				<div
					class="clip-triangle relative h-36 w-40 bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl"
				>
					<div
						class="clip-triangle absolute inset-2 bg-gradient-to-br from-yellow-300 to-amber-400"
					></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg
							class="h-20 w-20 text-gray-800"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Traffic Cones -->
		<div class="mb-12 flex justify-center gap-8">
			<div bind:this={coneRefs[0]} class="cone">
				<div class="clip-cone relative h-16 w-12 bg-gradient-to-b from-orange-500 to-orange-600">
					<div class="absolute top-1/3 right-0 left-0 h-3 bg-white opacity-90"></div>
				</div>
				<div class="mt-1 h-2 w-16 rounded-full bg-gray-700"></div>
			</div>

			<div bind:this={coneRefs[1]} class="cone">
				<div class="clip-cone relative h-16 w-12 bg-gradient-to-b from-orange-500 to-orange-600">
					<div class="absolute top-1/3 right-0 left-0 h-3 bg-white opacity-90"></div>
				</div>
				<div class="mt-1 h-2 w-16 rounded-full bg-gray-700"></div>
			</div>

			<div bind:this={coneRefs[2]} class="cone">
				<div class="clip-cone relative h-16 w-12 bg-gradient-to-b from-orange-500 to-orange-600">
					<div class="absolute top-1/3 right-0 left-0 h-3 bg-white opacity-90"></div>
				</div>
				<div class="mt-1 h-2 w-16 rounded-full bg-gray-700"></div>
			</div>
		</div>

		<!-- Error Message -->
		<h1 bind:this={textRef} class="mb-4 text-6xl font-bold text-gray-800 md:text-8xl">
			{$page.status}
		</h1>

		<h2 class="mb-4 text-2xl font-semibold text-gray-700 md:text-3xl">🚧 Under Construction 🚧</h2>

		<p bind:this={subtextRef} class="mx-auto mb-8 max-w-md text-lg text-gray-600">
			{#if $page.status === 404}
				Oops! This page is still being built. Our team is working hard to get it ready for you.
			{:else}
				Something went wrong. We're working on fixing it!
			{/if}
		</p>

		<!-- Back Button -->
		<a
			bind:this={buttonRef}
			href="/"
			class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back to Home
		</a>

		<!-- Status Code Detail -->
		<p class="mt-8 text-sm text-gray-500">
			Error Code: {$page.status} • {$page.error?.message || 'Page not found'}
		</p>
	</div>
</div>

<style>
	.clip-triangle {
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
	}

	.clip-cone {
		clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>
