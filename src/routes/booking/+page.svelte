<script lang="ts">
	let formData = {
		name: '',
		contact: '',
		contact2: '',
		email: '',
		pickupAddress: ''
	};

	const bookingDetails = {
		bookType: 'One way',
		carType: 'Hatchback',
		carDescription: '2 Luggages | Maruti Wagon R, or Similar C...',
		pickup: 'Chennai, Tamil Nadu, India',
		drop: 'Madurai, Tamil Nadu, India',
		bookedAt: '2025-11-12 12:53 AM'
	};

	const paymentDetails = {
		baseFare: { km: 130, amount: 1690.0 },
		additionalFare: { km: 326, amount: 4238.0 },
		driverBata: { km: 400, amount: 600.0 },
		total: 6528.0
	};

	function handleSubmit() {
		console.log('Booking submitted:', formData);
		alert('Booking submitted successfully!');
	}

	function handleBack() {
		window.history.back();
	}
</script>

<div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
	<!-- Back Button -->
	<div class="mx-auto mb-6 max-w-7xl">
		<div class="flex gap-4">
			<button
				onclick={handleBack}
				class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 active:scale-95"
				aria-label="Go back"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<h1 class="text-xl font-bold text-gray-900 lg:text-2xl">Booking</h1>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Left Column - Booking Summary -->
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Booking Summary</h2>

			<!-- Booking Details -->
			<div class="mb-8 space-y-4">
				<div class="flex items-start justify-between">
					<span class="text-sm font-medium text-gray-700">Book Type</span>
					<span class="text-sm font-medium text-gray-900">{bookingDetails.bookType}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Car Type</span>
					<div class="text-right">
						<div class="text-sm font-medium text-gray-900">{bookingDetails.carType}</div>
						<div class="mt-1 text-xs text-gray-500">{bookingDetails.carDescription}</div>
					</div>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Pickup</span>
					<span class="text-right text-sm text-gray-900">{bookingDetails.pickup}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Drop</span>
					<span class="text-right text-sm text-gray-900">{bookingDetails.drop}</span>
				</div>

				<div class="flex items-start justify-between border-t border-gray-100 pt-4">
					<span class="text-sm font-medium text-gray-700">Booked At</span>
					<span class="text-sm text-gray-900">{bookingDetails.bookedAt}</span>
				</div>
			</div>

			<!-- Payment Details -->
			<h3 class="mb-4 text-xl font-bold text-gray-900">Payment Details</h3>

			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<div>
						<span class="text-sm font-medium text-gray-700">Base Fare</span>
						<span class="ml-1 text-xs text-gray-500">[{paymentDetails.baseFare.km} Km]</span>
					</div>
					<span class="text-sm font-semibold text-gray-900"
						>₹ {paymentDetails.baseFare.amount.toFixed(2)}</span
					>
				</div>

				<div class="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span class="text-sm font-medium text-gray-700">Additional Fare</span>
						<span class="ml-1 text-xs text-gray-500">[{paymentDetails.additionalFare.km} Km]</span>
					</div>
					<span class="text-sm font-semibold text-gray-900"
						>₹ {paymentDetails.additionalFare.amount.toFixed(2)}</span
					>
				</div>

				<div class="flex items-center justify-between border-t border-gray-100 pt-3">
					<div>
						<span class="text-sm font-medium text-gray-700">Driver Bata</span>
						<span class="ml-1 text-xs text-gray-500">[upto {paymentDetails.driverBata.km} Km]</span>
					</div>
					<span class="text-sm font-semibold text-gray-900"
						>₹ {paymentDetails.driverBata.amount.toFixed(2)}</span
					>
				</div>

				<!-- Total Amount -->
				<div class="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
					<div class="flex items-center justify-between">
						<span class="text-base font-bold text-gray-900">Total Amount</span>
						<span class="text-xl font-bold text-gray-900">₹ {paymentDetails.total.toFixed(2)}</span>
					</div>
				</div>
			</div>

			<!-- Note -->
			<div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<p class="text-sm text-gray-700">
					<span class="font-semibold">Note:</span> The actual bill amount might differ based on actual
					KMs travelled, Waiting time (for Oneway only), Hill-station charges, Inter-state Permits,Toll
					Charges etc.
				</p>
			</div>
		</div>

		<!-- Right Column - Booking Form -->
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Make Your Booking</h2>

			<form onsubmit={handleSubmit} class="space-y-5">
				<!-- Name -->
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
						Name <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="name"
						bind:value={formData.name}
						placeholder="Enter your name"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Contact -->
				<div>
					<label for="contact" class="mb-2 block text-sm font-medium text-gray-700">
						Contact <span class="text-red-500">*</span>
					</label>
					<input
						type="tel"
						id="contact"
						bind:value={formData.contact}
						placeholder="Mobile Number"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Contact 2 -->
				<div>
					<label for="contact2" class="mb-2 block text-sm font-medium text-gray-700">
						Contact 2
					</label>
					<input
						type="tel"
						id="contact2"
						bind:value={formData.contact2}
						placeholder="Mobile Number"
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700">
						Email <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						placeholder="Enter your email"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Pickup Address -->
				<div>
					<label for="pickupAddress" class="mb-2 block text-sm font-medium text-gray-700">
						Pickup Address <span class="text-red-500">*</span>
					</label>
					<textarea
						id="pickupAddress"
						bind:value={formData.pickupAddress}
						placeholder="Enter your pickup address"
						required
						rows="4"
						class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					class="hover:bg-primary-600 w-full rounded-lg bg-[#051C34] py-4 font-semibold text-white shadow-sm transition-colors"
				>
					Book Now
				</button>
			</form>
		</div>
	</div>
</div>
