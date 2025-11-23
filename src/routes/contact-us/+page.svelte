<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { toast } from 'svelte-sonner';
	import { Env_data } from '$lib/constant/url.constant';

	let heroRef: HTMLElement, contactCardsRef: HTMLElement, formRef: HTMLElement, faqRef: HTMLElement;
	let formData = { name: '', email: '', phone: '', subject: '', message: '' };
	let formErrors = { name: '', email: '', phone: '', message: '' };
	let isSubmitting = false;

	function validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function validatePhone(phone: string): boolean {
		return /^[6-9]\d{9}$/.test(phone);
	}

	function validateForm(): boolean {
		let isValid = true;
		formErrors = { name: '', email: '', phone: '', message: '' };
		if (!formData.name.trim()) {
			formErrors.name = 'Name is required';
			isValid = false;
		}
		if (!formData.email.trim()) {
			formErrors.email = 'Email is required';
			isValid = false;
		} else if (!validateEmail(formData.email)) {
			formErrors.email = 'Please enter a valid email';
			isValid = false;
		}
		if (!formData.phone.trim()) {
			formErrors.phone = 'Phone number is required';
			isValid = false;
		} else if (!validatePhone(formData.phone)) {
			formErrors.phone = 'Please enter a valid 10-digit phone number';
			isValid = false;
		}
		if (!formData.message.trim()) {
			formErrors.message = 'Message is required';
			isValid = false;
		}
		return isValid;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validateForm()) {
			toast.error('Please fill all the fields in the form');
			return;
		}
		isSubmitting = true;

		try {
			// Web3Forms API endpoint
			const response = await fetch(Env_data.WEB3_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					access_key: Env_data.WEB3_ACCESS_KEY,
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					subject: formData.subject || 'Contact Form Submission - Hello Drop Taxi',
					message: formData.message,
					from_name: 'Hello Drop Taxi Contact Form',
					replyto: formData.email
				})
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Message sent successfully! We'll get back to you soon.");
				formData = { name: '', email: '', phone: '', subject: '', message: '' };
				formErrors = { name: '', email: '', phone: '', message: '' };
			} else {
				toast.error('Failed to send message. Please try again or call us directly.');
			}
		} catch (error) {
			console.error('Form submission error:', error);
			toast.error('Failed to send message. Please try again or call us directly.');
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		gsap.from(heroRef.querySelectorAll('h1, p, div'), {
			y: 40,
			opacity: 0,
			duration: 1.2,
			stagger: 0.2,
			ease: 'power4.out',
			clearProps: 'all'
		});
		gsap.from(contactCardsRef.querySelectorAll('.contact-card'), {
			scrollTrigger: {
				trigger: contactCardsRef,
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
		gsap.from(formRef, {
			scrollTrigger: { trigger: formRef, start: 'top 85%', toggleActions: 'play none none none' },
			y: 60,
			opacity: 0,
			duration: 1,
			ease: 'power3.out',
			clearProps: 'all'
		});
		gsap.from(faqRef.querySelectorAll('.faq-item'), {
			scrollTrigger: { trigger: faqRef, start: 'top 85%', toggleActions: 'play none none none' },
			y: 40,
			opacity: 0,
			duration: 0.8,
			stagger: 0.1,
			ease: 'power3.out',
			clearProps: 'all'
		});
	});
</script>

<svelte:head>
	<title>Contact Us - Hello Drop Taxi</title>
	<meta
		name="description"
		content="Get in touch with Hello Drop Taxi. Available 24/7 for bookings and inquiries. Call +91-9361417837 or send us a message."
	/>
</svelte:head>

<div class="mb-0">
	<!-- Hero Section -->
	<section
		bind:this={heroRef}
		class="relative overflow-hidden bg-gradient-to-br from-[#E9F1FF] to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
	>
		<div class="mx-auto max-w-7xl">
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
					Contact <span class="text-primary">Us</span>
				</h1>
				<p class="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:mt-6 sm:text-lg">
					We're here to help 24/7. Reach out to us for bookings, inquiries, or any assistance you
					need.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-4 sm:mt-8">
					<a
						href="tel:+919361417837"
						class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
					>
						<svg
							class="h-5 w-5 sm:h-6 sm:w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						Call Now
					</a>
					<a
						href={Env_data.WHATSAPP_CONTACT_LINK}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-white px-6 py-3 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-white active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
					>
						<svg class="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
							/>
						</svg>
						WhatsApp
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Information Cards -->
	<section
		bind:this={contactCardsRef}
		class="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
	>
		<div class="mx-auto max-w-7xl">
			<div class="mb-8 text-center sm:mb-12">
				<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Get In Touch</h2>
				<p class="mt-2 text-sm text-gray-600 sm:text-base">
					Multiple ways to reach us - choose what works best for you
				</p>
			</div>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Phone Card -->
				<div
					class="contact-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-primary/10 p-4">
							<svg
								class="h-8 w-8 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
					</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Phone</h3>
					<a
						href="tel:+919361417837"
						class="text-lg font-bold text-primary hover:underline sm:text-xl"
					>
						+91-9361417837
					</a>
					<p class="mt-2 text-xs text-gray-500 sm:text-sm">Available 24/7</p>
				</div>

				<!-- Location Card -->
				<div
					class="contact-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg"
				>
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-primary/10 p-4">
							<svg
								class="h-8 w-8 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
					</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Location</h3>
					<p class="text-base font-medium text-gray-900 sm:text-lg">Trichy, Tamil Nadu</p>
					<p class="mt-2 text-xs text-gray-500 sm:text-sm">India</p>
				</div>

				<!-- WhatsApp Card -->
				<div
					class="contact-card rounded-xl border-2 border-gray-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-lg sm:col-span-2 lg:col-span-1"
				>
					<div class="mb-4 flex justify-center">
						<div class="rounded-full bg-primary/10 p-4">
							<svg class="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
								/>
							</svg>
						</div>
					</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">WhatsApp</h3>
					<a
						href={Env_data.WHATSAPP_CONTACT_LINK}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-block text-base font-medium text-primary hover:underline sm:text-lg"
					>
						Send Message
					</a>
					<p class="mt-2 text-xs text-gray-500 sm:text-sm">Quick response</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Form Section -->
	<section bind:this={formRef} class="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
		<div class="mx-auto max-w-3xl">
			<div class="mb-8 text-center sm:mb-12">
				<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Send Us a Message</h2>
				<p class="mt-2 text-sm text-gray-600 sm:text-base">
					Fill out the form below and we'll get back to you within 24 hours
				</p>
			</div>
			<form onsubmit={handleSubmit} class="rounded-xl bg-white p-6 shadow-lg sm:p-8">
				<div class="grid gap-6 sm:grid-cols-2">
					<!-- Name -->
					<div class="sm:col-span-2">
						<label for="name" class="mb-2 block text-sm font-medium text-gray-900">
							Name <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="Your full name"
						/>
						{#if formErrors.name}
							<p class="mt-1 text-xs text-red-500">{formErrors.name}</p>
						{/if}
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="mb-2 block text-sm font-medium text-gray-900">
							Email <span class="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="your@email.com"
						/>
						{#if formErrors.email}
							<p class="mt-1 text-xs text-red-500">{formErrors.email}</p>
						{/if}
					</div>

					<!-- Phone -->
					<div>
						<label for="phone" class="mb-2 block text-sm font-medium text-gray-900">
							Phone <span class="text-red-500">*</span>
						</label>
						<input
							type="tel"
							id="phone"
							bind:value={formData.phone}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="10-digit mobile number"
							maxlength="10"
						/>
						{#if formErrors.phone}
							<p class="mt-1 text-xs text-red-500">{formErrors.phone}</p>
						{/if}
					</div>

					<!-- Subject -->
					<div class="sm:col-span-2">
						<label for="subject" class="mb-2 block text-sm font-medium text-gray-900">
							Subject
						</label>
						<input
							type="text"
							id="subject"
							bind:value={formData.subject}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="What is this regarding?"
						/>
					</div>

					<!-- Message -->
					<div class="sm:col-span-2">
						<label for="message" class="mb-2 block text-sm font-medium text-gray-900">
							Message <span class="text-red-500">*</span>
						</label>
						<textarea
							id="message"
							bind:value={formData.message}
							rows="5"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
							placeholder="Tell us how we can help you..."
						></textarea>
						{#if formErrors.message}
							<p class="mt-1 text-xs text-red-500">{formErrors.message}</p>
						{/if}
					</div>
				</div>

				<div class="mt-6">
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
					>
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</button>
				</div>
			</form>
		</div>
	</section>

	<!-- Business Information -->
	<section class="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
		<div class="mx-auto max-w-7xl">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Service Hours -->
				<div class="rounded-xl bg-gray-50 p-6 text-center">
					<div class="mb-3 text-3xl sm:text-4xl">🕐</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Service Hours</h3>
					<p class="text-xl font-bold text-primary sm:text-2xl">24/7</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">Always available</p>
				</div>

				<!-- Service Areas -->
				<div class="rounded-xl bg-gray-50 p-6 text-center">
					<div class="mb-3 text-3xl sm:text-4xl">🗺️</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Service Areas</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						Tamil Nadu, Kerala, Karnataka, Pondicherry
					</p>
				</div>

				<!-- Response Time -->
				<div class="rounded-xl bg-gray-50 p-6 text-center sm:col-span-2 lg:col-span-1">
					<div class="mb-3 text-3xl sm:text-4xl">⚡</div>
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Response Time</h3>
					<p class="text-xl font-bold text-primary sm:text-2xl">Within 24 hours</p>
					<p class="mt-1 text-xs text-gray-500 sm:text-sm">We value your time</p>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section bind:this={faqRef} class="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
		<div class="mx-auto max-w-4xl">
			<div class="mb-8 text-center sm:mb-12">
				<h2 class="text-2xl font-bold text-gray-900 sm:text-3xl">Frequently Asked Questions</h2>
				<p class="mt-2 text-sm text-gray-600 sm:text-base">Quick answers to common questions</p>
			</div>
			<div class="space-y-4">
				<div class="faq-item rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
						How do I book a ride?
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						You can book a ride through our website by filling out the booking form on the home
						page, or by calling us directly at +91-9361417837, or via WhatsApp.
					</p>
				</div>

				<div class="faq-item rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
						What payment methods do you accept?
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						We accept Cash, UPI, Credit/Debit Cards, and Online Bank Transfer for your convenience.
					</p>
				</div>

				<div class="faq-item rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
						Do you operate 24/7?
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						Yes! We provide 24/7 taxi services across Tamil Nadu, Kerala, Karnataka, and
						Pondicherry.
					</p>
				</div>

				<div class="faq-item rounded-xl bg-white p-4 shadow-md sm:p-6">
					<h3 class="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
						What areas do you cover?
					</h3>
					<p class="text-sm text-gray-600 sm:text-base">
						We serve Tamil Nadu, Kerala, Karnataka, and Pondicherry with reliable taxi services for
						both one-way and round-trip journeys.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="mt-0 mb-0 bg-primary px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<h2 class="text-2xl font-bold text-white sm:text-3xl">Ready to Book Your Ride?</h2>
			<p class="mt-3 text-sm text-blue-100 sm:mt-4 sm:text-base">
				Experience reliable and comfortable taxi service. Book now and travel with confidence.
			</p>
			<div class="mt-6 sm:mt-8">
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
