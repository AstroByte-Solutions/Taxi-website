<script lang="ts">
	import ChooseVehicles from '$lib/components/homePage/chooseVehicles.svelte';
	import Files from '$lib/pages/files.svelte';
	import TaxiService from '$lib/components/taxiService/taxiService.svelte';
	import HeroSection from '$lib/components/homePage/heroSection.svelte';
	import BookingForm from '$lib/components/homePage/bookingForm.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('🔄 Component mounted - clearing localStorage');
		localStorage.removeItem('tripData');
		localStorage.removeItem('vehicle-details');
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
