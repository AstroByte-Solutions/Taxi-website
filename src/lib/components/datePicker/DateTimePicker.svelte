<script lang="ts">
	import { DatePicker } from 'bits-ui';
	import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date';

	interface Props {
		value?: string;
		label?: string;
		placeholder?: string;
		minDate?: string;
	}

	let { value = $bindable(''), label, placeholder = 'Pick date & time', minDate }: Props = $props();

	// Get current time for default
	const now = new Date();
	const currentHour = String(now.getHours()).padStart(2, '0');
	const currentMinute = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0'); // Round to nearest 15 min
	// Parse value to CalendarDate
	let selectedDate = $state<CalendarDate | undefined>(
		value ? parseDate(value.split('T')[0]) : undefined
	);

	// Time selection - initialize with current time
	const getCurrentTime = () => {
		const now = new Date();
		const h = now.getHours();
		const period = h >= 12 ? 'PM' : 'AM';
		const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
		const hour12 = String(h12).padStart(2, '0');

		// Round to nearest 15 minutes to match dropdown options
		const currentMinutes = now.getMinutes();
		const roundedMinutes = Math.round(currentMinutes / 15) * 15;
		const minute = String(roundedMinutes === 60 ? 0 : roundedMinutes).padStart(2, '0');

		return { hour12, minute, period };
	};

	const currentTime = getCurrentTime();
	let selectedHour12 = $state(currentTime.hour12);
	let selectedMinute = $state(currentTime.minute);
	let selectedPeriod = $state(currentTime.period);

	// Initialize time from existing value
	$effect(() => {
		if (value) {
			const [, time] = value.split('T');
			if (time) {
				const [h, m] = time.split(':');
				const hour = parseInt(h);
				selectedPeriod = hour >= 12 ? 'PM' : 'AM';
				const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
				selectedHour12 = String(h12).padStart(2, '0');
				selectedMinute = m;
			}
		}
	});

	// Auto-fill current time when user selects a date
	$effect(() => {
		if (selectedDate && !value) {
			// User just selected a date, auto-fill with current time
			const time = getCurrentTime();
			selectedHour12 = time.hour12;
			selectedMinute = time.minute;
			selectedPeriod = time.period;
		}
	});

	// Update value when date or time changes
	$effect(() => {
		if (selectedDate) {
			const dateStr = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;

			// Convert 12h to 24h for storage
			let h24 = parseInt(selectedHour12);
			if (selectedPeriod === 'PM' && h24 !== 12) h24 += 12;
			if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;

			const hourStr = String(h24).padStart(2, '0');
			value = `${dateStr}T${hourStr}:${selectedMinute}`;
		}
	});

	// Format display value
	const displayValue = $derived(() => {
		if (!selectedDate) return placeholder;
		const date = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
		const dateStr = date.toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});

		// Use the 12h values directly for display
		const hour = parseInt(selectedHour12); // Remove leading zero for display if desired, or keep
		return `${dateStr} • ${hour}:${selectedMinute} ${selectedPeriod}`;
	});

	// Get minimum date
	const minDateValue = minDate ? parseDate(minDate.split('T')[0]) : today(getLocalTimeZone());

	// Generate hours (1-12) and minutes
	const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
	const minutes = ['00', '15', '30', '45'];
	const periods = ['AM', 'PM'];
</script>

<div class="w-full">
	{#if label}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="mb-2 block text-xs font-semibold text-gray-900 sm:text-sm">{label}</label>
	{/if}

	<DatePicker.Root bind:value={selectedDate} minValue={minDateValue}>
		<div class="relative">
			<!-- Trigger Button -->
			<DatePicker.Trigger
				class="group flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
			>
				<div class="flex min-w-0 flex-1 items-center gap-2.5">
					<svg
						class="h-5 w-5 flex-shrink-0 text-primary transition-transform duration-200 group-hover:scale-110"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span
						class="truncate transition-colors duration-200 {selectedDate
							? 'font-medium text-gray-900'
							: 'text-gray-400'}"
					>
						{displayValue()}
					</span>
				</div>
				<svg
					class="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-primary"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</DatePicker.Trigger>

			<!-- Calendar Dropdown -->
			<DatePicker.Portal>
				<DatePicker.Content
					class="z-[9999] w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-2xl sm:w-auto"
					sideOffset={4}
					side="bottom"
					align="start"
					avoidCollisions={true}
					collisionPadding={8}
				>
					<DatePicker.Calendar class="w-full">
						{#snippet children({ months, weekdays })}
							<!-- Header -->
							<DatePicker.Header class="mb-4 flex items-center justify-between">
								<DatePicker.PrevButton
									class="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-gray-100 active:scale-95"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</DatePicker.PrevButton>

								<DatePicker.Heading class="text-sm font-semibold text-gray-900" />

								<DatePicker.NextButton
									class="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-gray-100 active:scale-95"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</DatePicker.NextButton>
							</DatePicker.Header>

							<!-- Calendar Grid -->
							{#each months as month}
								<DatePicker.Grid class="w-full border-collapse">
									<DatePicker.GridHead>
										<DatePicker.GridRow class="mb-1 flex w-full">
											{#each weekdays as day}
												<DatePicker.HeadCell
													class="w-10 flex-1 text-center text-xs font-medium text-gray-500"
												>
													{day.slice(0, 2)}
												</DatePicker.HeadCell>
											{/each}
										</DatePicker.GridRow>
									</DatePicker.GridHead>

									<DatePicker.GridBody>
										{#each month.weeks as weekDates}
											<DatePicker.GridRow class="flex w-full">
												{#each weekDates as date}
													<DatePicker.Cell
														{date}
														month={month.value}
														class="flex-1 p-0 text-center"
													>
														{#snippet children({ disabled, unavailable, selected })}
															<DatePicker.Day
																class="flex h-10 w-10 items-center justify-center rounded-md text-sm transition-all
																{disabled || unavailable
																	? 'cursor-not-allowed text-gray-300'
																	: selected
																		? 'bg-primary font-semibold text-white shadow-sm'
																		: 'text-gray-700 hover:bg-blue-50 active:scale-95'}"
															>
																{date.day}
															</DatePicker.Day>
														{/snippet}
													</DatePicker.Cell>
												{/each}
											</DatePicker.GridRow>
										{/each}
									</DatePicker.GridBody>
								</DatePicker.Grid>
							{/each}
						{/snippet}
					</DatePicker.Calendar>

					<!-- Time Selection -->
					<div class="mt-4 border-t border-gray-200 pt-4">
						<div class="mb-2 text-xs font-semibold text-gray-700">Select Time</div>
						<div class="grid grid-cols-3 gap-2">
							<!-- Hour -->
							<div>
								<label for="hour-select" class="mb-1 block text-xs text-gray-600">Hour</label>
								<select
									id="hour-select"
									bind:value={selectedHour12}
									class="w-full rounded-md border border-gray-300 px-2 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
								>
									{#each hours12 as hour}
										<option value={hour}>{hour}</option>
									{/each}
								</select>
							</div>

							<!-- Minute -->
							<div>
								<label for="minute-select" class="mb-1 block text-xs text-gray-600">Minute</label>
								<select
									id="minute-select"
									bind:value={selectedMinute}
									class="w-full rounded-md border border-gray-300 px-2 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
								>
									{#each minutes as minute}
										<option value={minute}>:{minute}</option>
									{/each}
								</select>
							</div>

							<!-- Period (AM/PM) -->
							<div>
								<label for="period-select" class="mb-1 block text-xs text-gray-600">AM/PM</label>
								<select
									id="period-select"
									bind:value={selectedPeriod}
									class="w-full rounded-md border border-gray-300 px-2 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
								>
									{#each periods as period}
										<option value={period}>{period}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>

					<!-- Selected Display -->
					{#if selectedDate}
						<div
							class="mt-3 rounded-md bg-blue-50 px-3 py-2 text-center text-sm font-medium text-primary"
						>
							✓ {displayValue()}
						</div>
					{/if}
				</DatePicker.Content>
			</DatePicker.Portal>
		</div>
	</DatePicker.Root>
</div>

<style>
	/* Smooth fade and slide animation - Slower for elegance */
	:global([data-bits-date-picker-content]) {
		animation: fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: top;
	}

	:global([data-bits-date-picker-content][data-state='closed']) {
		animation: fadeSlideOut 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(-12px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes fadeSlideOut {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(-12px) scale(0.95);
		}
	}

	/* Smooth transitions for all interactive elements */
	:global([data-bits-date-picker-day]) {
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	:global([data-bits-date-picker-day]:hover) {
		transform: scale(1.08);
	}

	:global([data-bits-date-picker-day]:active) {
		transform: scale(0.92);
	}

	/* Smooth button transitions */
	:global([data-bits-date-picker-prev-button]),
	:global([data-bits-date-picker-next-button]) {
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>
