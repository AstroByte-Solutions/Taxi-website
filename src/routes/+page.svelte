<script lang="ts">
	import ChooseVehicles from '$lib/components/homePage/chooseVehicles.svelte';
	import Files from '$lib/pages/files.svelte';
	import TaxiService from '$lib/components/taxiService/taxiService.svelte';
	import HeroSection from '$lib/components/homePage/heroSection.svelte';
	import BookingForm from '$lib/components/homePage/bookingForm.svelte';
	import { onMount } from 'svelte';
	import { tripStore } from '$lib/stores/tripStore';
	import { vehicleStore } from '$lib/stores/vehicleStore';
	import { resetFormData } from '$lib/stores/formDataStore';

	onMount(() => {
		tripStore.reset();
		vehicleStore.reset();
		resetFormData();
	});
</script>

<HeroSection>
	<BookingForm />
</HeroSection>

<Files />
<ChooseVehicles />
<TaxiService />

<style>
	:global(body) {
		overflow-x: hidden;
		max-width: 100vw;
	}
</style>
