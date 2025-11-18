<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Door from '$lib/icons/door.svelte';
	import Frost from '$lib/icons/frost.svelte';
	import Profile from '$lib/icons/profile.svelte';
	import Star from '$lib/icons/star.svelte';
	import Transimission from '$lib/icons/transimission.svelte';

	const cars = [
		{
			id: 1,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/17ws33z6wdrxmsp/suzuki_swift_car_maruti_suzuki_dzire_car_b15b42392c86348282930d72a750d493_HybpFp2Lkl.png',
			name: 'Maruti Suzuki Dzire',
			rating: 4.5,
			reviews: 3456,
			passengers: 4,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			price: 1200,
			priceUnit: 'day',
			category: 'Sedan'
		},
		{
			id: 2,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/cifxi30yi0t7fop/toyota_innova_car_mazda_mpv_toyota_a8f71f8a221e8c5c547390ce9861d454_lHUqsi7JkE.png',
			name: 'Toyota Innova Crysta',
			rating: 4.7,
			reviews: 2890,
			passengers: 7,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			price: 2500,
			priceUnit: 'day',
			category: 'MUV'
		},
		{
			id: 3,
			name: 'Honda City',
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/tnkxnr5l36tv3hm/honda_city_car_toyota_vitz_suzuki_ciaz_honda_b1a1d66eb0a90a83e1fcd9d5831bfa89_5c5J5ZUUl7.png',
			rating: 4.6,
			reviews: 2234,
			passengers: 5,
			transmission: 'Auto',
			airConditioning: true,
			doors: 4,
			price: 1800,
			priceUnit: 'day',
			category: 'Sedan'
		},
		{
			id: 4,
			imageLink:
				'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/5nu90o3u4m6ina5/imgbin_a9fead70fff41db5ea86e7042ef7a66b_qCO5bsWRDL.png',
			name: 'Mahindra Scorpio',
			rating: 4.4,
			reviews: 1987,
			passengers: 7,
			transmission: 'Manual',
			airConditioning: true,
			doors: 4,
			price: 2200,
			priceUnit: 'day',
			category: 'SUV'
		}
	];

	let sectionRef: HTMLElement;
	let badgeRef: HTMLDivElement;
	let headingRef: HTMLHeadingElement;
	let cardRefs: HTMLDivElement[] = [];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Header animation timeline
		const headerTl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 75%',
				end: 'top 40%',
				toggleActions: 'play none none reverse'
			}
		});

		// Animate each card with ScrollTrigger
		cardRefs.forEach((card, index) => {
			if (!card) return;

			const cardTl = gsap.timeline({
				scrollTrigger: {
					trigger: card,
					start: 'top 85%',
					end: 'top 50%',
					toggleActions: 'play none none reverse'
				}
			});

			// Initial card entrance
			cardTl
				.from(card, {
					y: 80,
					opacity: 0,
					duration: 0.8,
					ease: 'power3.out',
					delay: index * 0.1
				})
				.from(
					card.querySelector('.car-image'),
					{
						scale: 0.7,
						rotation: -10,
						opacity: 0,
						duration: 0.6,
						ease: 'back.out(1.5)'
					},
					'-=0.5'
				)
				.from(
					card.querySelectorAll('.car-detail'),
					{
						x: -20,
						opacity: 0,
						duration: 0.4,
						stagger: 0.08,
						ease: 'power2.out'
					},
					'-=0.3'
				)
				.from(
					card.querySelector('.book-button'),
					{
						scale: 0.8,
						opacity: 0,
						duration: 0.4,
						ease: 'back.out(2)'
					},
					'-=0.2'
				);

			// Hover animations
			const carImage = card.querySelector('.car-image');
			const bookButton = card.querySelector('.book-button');
			const priceElement = card.querySelector('.price-text');
			const iconElements = card.querySelectorAll('.feature-icon');

			card.addEventListener('mouseenter', () => {
				gsap.to(card, {
					y: -10,
					boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
					duration: 0.3,
					ease: 'power2.out'
				});
				gsap.to(carImage, {
					scale: 1.05,
					rotation: 2,
					duration: 0.4,
					ease: 'back.out(1.5)'
				});
				gsap.to(bookButton, {
					scale: 1.05,
					backgroundColor: '#1256a8',
					duration: 0.3
				});
				gsap.to(priceElement, {
					scale: 1.1,
					color: '#1572D3',
					duration: 0.3
				});
				gsap.to(iconElements, {
					scale: 1.15,
					rotation: 360,
					duration: 0.5,
					stagger: 0.05,
					ease: 'back.out(1.5)'
				});
			});

			card.addEventListener('mouseleave', () => {
				gsap.to(card, {
					y: 0,
					boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
					duration: 0.3,
					ease: 'power2.out'
				});
				gsap.to(carImage, {
					scale: 1,
					rotation: 0,
					duration: 0.4,
					ease: 'power2.out'
				});
				gsap.to(bookButton, {
					scale: 1,
					backgroundColor: '#1572D3',
					duration: 0.3
				});
				gsap.to(priceElement, {
					scale: 1,
					color: '#111827',
					duration: 0.3
				});
				gsap.to(iconElements, {
					scale: 1,
					rotation: 0,
					duration: 0.4,
					ease: 'power2.out'
				});
			});

			// Button click animation
			if (bookButton) {
				bookButton.addEventListener('click', (e) => {
					e.stopPropagation();
					gsap.fromTo(
						bookButton,
						{ scale: 1 },
						{
							scale: 0.92,
							duration: 0.1,
							yoyo: true,
							repeat: 1,
							ease: 'power2.inOut'
						}
					);
				});
			}

			// Star rating animation
			const starIcon = card.querySelector('.star-icon');
			if (starIcon) {
				gsap.to(starIcon, {
					rotation: 360,
					duration: 2,
					repeat: -1,
					ease: 'none',
					paused: true,
					onComplete: function () {
						this.restart();
					}
				});

				card.addEventListener('mouseenter', () => {
					gsap.to(starIcon, {
						rotation: '+=360',
						scale: 1.2,
						duration: 0.6,
						ease: 'back.out(2)'
					});
				});

				card.addEventListener('mouseleave', () => {
					gsap.to(starIcon, {
						scale: 1,
						duration: 0.3
					});
				});
			}
		});

		// Badge pulse animation
		gsap.to(badgeRef, {
			scale: 1.05,
			duration: 2,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});
	});
</script>

<section
	bind:this={sectionRef}
	class="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 lg:mb-20"
>
	<div class="flex flex-col items-center justify-center gap-4 text-center">
		<div
			bind:this={badgeRef}
			class="rounded-lg bg-[#1572D31A] px-8 py-4 text-sm font-medium text-primary"
		>
			POPULAR RIDE DEALS
		</div>
		<h1 bind:this={headingRef} class="text-4xl font-bold">Most popular cars ride deals</h1>
	</div>
	<div class="my-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
		{#each cars as car, index}
			<div
				bind:this={cardRefs[index]}
				class="flex cursor-pointer flex-col rounded-lg border border-gray-200 p-5 shadow-sm transition-shadow"
			>
				<div class="car-image flex h-40 w-full items-center justify-center">
					<img src={car.imageLink} alt={car.name} class="h-full w-full object-contain" />
				</div>
				<h2 class="car-detail mt-4 truncate text-lg font-semibold">{car.name}</h2>
				<div class="car-detail mt-2 flex items-center gap-2">
					<span class="star-icon">
						<Star />
					</span>
					<p class="text-sm text-gray-600">
						{car.rating} <span class="text-gray-400">({car.reviews} reviews)</span>
					</p>
				</div>
				<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
					<div class="car-detail flex items-start gap-2">
						<div class="feature-icon mt-0.5 flex-shrink-0">
							<Profile />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.passengers} Passengers</p>
					</div>
					<div class="car-detail flex items-start gap-2">
						<div class="feature-icon mt-0.5 flex-shrink-0">
							<Transimission />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.transmission}</p>
					</div>
					<div class="car-detail flex items-start gap-2">
						<div class="feature-icon mt-0.5 flex-shrink-0">
							<Frost />
						</div>
						<p class="text-xs leading-tight text-gray-600">Air Conditioning</p>
					</div>
					<div class="car-detail flex items-start gap-2">
						<div class="feature-icon mt-0.5 flex-shrink-0">
							<Door />
						</div>
						<p class="text-xs leading-tight text-gray-600">{car.doors} Doors</p>
					</div>
				</div>
				<div class="car-detail mt-4 border-t border-gray-100 pt-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-gray-500">Price</p>
						</div>

						<p class="price-text text-xl font-bold text-gray-900">
							₹{car.price} <span class="text-sm font-normal text-gray-500">/ {car.priceUnit}</span>
						</p>
					</div>
					<button class="book-button mt-4 w-full rounded-lg bg-primary py-3.5 text-white">
						Book Now
					</button>
				</div>
			</div>
		{/each}
	</div>
</section>
